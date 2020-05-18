const PVector = require('pvectorjs');
const { PI, map_range, clamp } = require('../utils/utils');

class Particle {
	constructor(start, maxSpeed) {
		if(maxSpeed){
			maxSpeed = 5;
		}
		this.maxSpeed = maxSpeed;
		this.pos = start;
		this.vel = new PVector(1, 0);
		this.acc = new PVector(0, 0);
		this.prevPos = this.pos.clone();
	}

	syncPrevPos() {
		this.prevPos.x = this.pos.x;
		this.prevPos.y = this.pos.y;
	}

	edges(width, height) {
		if (this.pos.x < 0) {
			this.pos.x = width;
			this.syncPrevPos();
		}
		if (this.pos.x > width) {
			this.pos.x = 0;
			this.syncPrevPos();
		}
		if (this.pos.y < 0) {
			this.pos.y = height;
			this.syncPrevPos();
		}
		if (this.pos.y > height) {
			this.pos.y = 0;
			this.syncPrevPos();
		}
	}

	update(delta) {
		if(!delta){
			delta = 1;
		}
		this.syncPrevPos();

		var random = PVector.random2D().mult(0.01);

		this.acc.add(random);
		this.vel.add(this.acc.clone().mult(delta));
		this.vel.clampMag(0, this.maxSpeed);
		this.pos.add(this.vel.clone().mult(delta));
		this.acc.mult(0);
	}

	applyForce(force) {
		this.acc.add(force);
	}

	draw(ctx, alpha, drawMode) {
		if(!alpha){
			alpha = 0.01;
		}
		switch(drawMode){
			case 'dir':
				let h = map_range(this.vel.angle2D(), -PI, PI, 0, 360);
				ctx.strokeStyle = `hsla(${h}, 100%, 50%, ${alpha})`;
				break;
			case 'white':
				ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
				break;
			default:
				ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
		}
		ctx.beginPath();
		ctx.moveTo(this.prevPos.x, this.prevPos.y);
		ctx.lineTo(this.pos.x, this.pos.y);
		ctx.stroke();
	}

	follow(flowField, fieldStrength) {
		const fieldX = clamp(Math.floor(this.pos.x / flowField.scale), 0, flowField.width - 1);
		const fieldY = clamp(Math.floor(this.pos.y / flowField.scale), 0, flowField.height - 1);
		const index = fieldX + fieldY * flowField.width;
		const vector = flowField.vectorField[index].clone();

		// const fieldEdgeRadius = 5;

		// if(fieldX < fieldEdgeRadius){
		// 	const fieldXSmooth = this.pos.x / flowField.scale;
		// 	vector.mult(map_range(fieldXSmooth, 0, fieldEdgeRadius, 0.4, 1));
		// }
		// if(fieldX > flowField.width - fieldEdgeRadius){
		// 	const fieldXSmooth = flowField.width - this.pos.x / flowField.scale;
		// 	vector.mult(map_range(fieldXSmooth, 0, fieldEdgeRadius, 0.4, 1));
		// }
		this.applyForce(vector.mult(fieldStrength));
	}
}

const CreateParticles = (numParticles, width, height, maxSpeed) => {
	let particles = [];

	for (let i = 0; i < numParticles; i++) {
		let pos = PVector.random();
		pos.x = map_range(pos.x, 0, 1, 0, width);
		pos.y = map_range(pos.y, 0, 1, 0, height);

		particles.push(new Particle(pos, maxSpeed));
	}

	return particles;
}


export { Particle, CreateParticles };