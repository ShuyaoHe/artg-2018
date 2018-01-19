import * as d3 from 'd3';
//Install bootstrap first, using npm install bootstrap --save
//import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import parse from './parse';

console.log('Week 2 in class...');

// review of D3 Selection
// DOM Matipulation
// Select elements
const moduleSelection = d3.select('.module')
// console.log(moduleSelection);
// console.log(moduleSelection.node())//Node

const divSelection = d3.select('div')

//Selection vs DOMNode
//modifying selection
const redNode = moduleSelection
   .append('div')
	 .attr('class', 'new new-div')
	 .style('width', '100px')
	 .style('height', '200px')
	 .style('background', 'red')

const greenNode = redNode
	 .append('div')
	 .style('width', '20px')
	 .style('height', '20px')
	 .style('background', 'green')
	 .classed('green-node', true)

console.log(redNode.node());
console.log(greenNode.node());

//handle events
redNode.on('click', function(){
	console.log('Red box has been clikced.')
});
//so as the greenbox(the child of the events),events bubbled up.
greenNode.on('click', function(){
	d3.event.stopPropagation();
});
const divSelection2 = d3
  .select('body')
  .selectAll('div');

console.log(divSelection2.size());
//control flow: .each and .call
divSelection2.each(function(d,i,nodes){
	console.group();

	console.log(d);//datum
	console.log(i);//index
	console.log(nodes);//group
	console.log(this);//node

	console.groupEnd();
	//callback
});
//Data binding

//Import and parse data
d3.csv('./data/hubway_trips_reduced.csv', parse, function(err,trips){



	const tripsByStation0 = d3.nest()
	.key(function(d){
		return d.station0
	})
	.entries(trips); //group data based on station0
//
	const tripVolumeByStation0 = tripsByStation0.map(function(d){

		return {
			station_id:d.key,
			volume:d.values.length
		};
	});

	console.log(tripVolumeByStation0);

//Mine for maxium
const maxVolume = d3.max(tripVolumeByStation0, function(d){return d.volume});
console.log(maxVolume);
// visual space
const margin ={t:100, r:300, b:100, l:300};
const padding = 3;
const w = d3.select('.module').node().clientWidth;
const h = d3.select('.module').node().clientHeight;
const _w = w - margin.l - margin.r;
const _h = h - margin.t - margin.b;


//Scale
const scaleX = d3.scaleLinear().domain([0, maxVolume]).range([0,_w]);

//Represent / DOM manipulation

const svgNode = d3.select('.module')
.append('svg')
.attr('width', w)
.attr('height', h);

const plot = svgNode
.append('g')
.attr('class', 'chart')
.attr('transform', `translate(${margin.l},${margin.t})`); //selection of <g.chart>

console.log(svgNode.node());
console.log(plot.node());


const stationNodes = plot.selectAll('.station')
    .data(tripVolumeByStation0)
		.enter() // special selection, of deficit between DOM and data points in the array size
		.append('g')
		.attr('class', 'station')
		.attr('transform', function(d,i){
			return `translate(0, ${i*_h/tripVolumeByStation0.length})`
		})//selection of <g.station> *142

stationNodes
    .append('rect')
		.attr('width', function(d){
			return scaleX(d.volume);
		})
		.attr('height', _h/tripVolumeByStation0.length - padding)
		.style('fill', 'red');

stationNodes
    .append('text')
		.text(function(d){
			return d.station;
		})
		.attr('text-anchor', 'end')
		.style('font-size', '6px');
});
