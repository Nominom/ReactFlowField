// const PVector = require('pvectorjs');
// const tumult = require('tumult');
// const { Particle, CreateParticles } = require('./flowfield/Particle');
// const {FlowField} = require('./flowfield/FlowField');

//require("two.js");

// console.log(FlowField)


// const fieldStrength = 0.6;

// const scale = 20;
// var canvas = document.getElementById("draw-area");
// var ctx = canvas.getContext("2d");

// const width = canvas.width;
// const height = canvas.height;

// ctx.fillStyle = 'rgb(0,0,0)';
// ctx.fillRect(0, 0, width, height);

// var flowField = new FlowField(width, height, scale);
// const noiseScale = 0.1;

// console.log(flowField);



// const numParticles = 1000;
// var particles = CreateParticles(numParticles, width, height, 5);

// console.log(particles);

// let last = performance.now();
// let lastfps = last;
// let z = 0;

// const draw = () => {
// 	let canvas = document.getElementById("draw-area");
// 	let ctx = canvas.getContext("2d");

	
// 	let canvas2 = document.getElementById("draw-area-2");
// 	let ctx2 = canvas2.getContext("2d");

// 	ctx2.clearRect(0,0,width, height);

// 	// ctx.fillStyle = 'rgb(0, 0, 0)';
// 	// ctx.fillRect(0, 0, width, height);

// 	flowField.update(z, noiseScale);
// 	flowField.draw(ctx2);

// 	const now = performance.now();

// 	z += 1 / 120;

// 	if (now - lastfps > 1000) {
// 		const fps = 1000 / (now - last);
// 		console.log('fps:', fps);
// 		lastfps = now;
// 	}
// 	last = now;

// 	for (let i = 0; i < particles.length; i++) {
// 		particles[i].follow(flowField, fieldStrength);
// 		particles[i].update(1);
// 		particles[i].edges(width, height);
// 		particles[i].draw(ctx, 0.01, 'dir');
// 	}

// 	window.requestAnimationFrame(draw);
// }

// window.requestAnimationFrame(draw);

import React from 'react'
import ReactDOM from 'react-dom'
import FlowSimulation  from './components/FlowSimulation'

ReactDOM.render(
    <FlowSimulation />,
    document.getElementById('root')
)