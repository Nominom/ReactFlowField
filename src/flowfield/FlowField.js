const PVector = require('pvectorjs');
const tumult = require('tumult');
const { PI, map_range, clamp } = require('../utils/utils');

export class FlowField {
	constructor(width, height, scale) {
		this.perlin = new tumult.Perlin3();
		this.scale = scale;
		this.width = Math.floor(width / scale);
		this.height = Math.floor(height / scale);
		this.vectorField = []
	}

	index (x, y) {
		x = clamp(x, 0, this.width -1);
		y = clamp(y, 0, this.height -1);
		return x + y * this.width;
	}

	update(zNoise, noiseScale) {
		let newVectorField = [];

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let a = this.perlin.gen(x * noiseScale, y * noiseScale, zNoise);
				clamp(a, -1, 1);
				a = map_range(a, -1, 1, -PI * 2, PI * 2)
				let vector = PVector.fromAngle(a);
				newVectorField[this.index(x,y)] = vector;
			}
		}

		//this.vectorField = newVectorField;

		const smoothingRadius = 5;

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) { 
				if(y > smoothingRadius && x > smoothingRadius && 
					y < this.height - smoothingRadius && x < this.width - smoothingRadius){
						this.vectorField[this.index(x, y)] = newVectorField[this.index(x,y)].clone();
						continue;
				}

				let xVal = undefined;
				let yVal = undefined;

				if(x <= smoothingRadius){
					const weight = map_range(x, 0, smoothingRadius, 0.5, 0.9);
					const thisVal = newVectorField[this.index(x,y)].clone();
					const mirrorVal = newVectorField[this.index(this.width - 1 - x, y)].clone();

					const mirrorWeight = 1 - weight;

					thisVal.mult(weight);
					mirrorVal.mult(mirrorWeight);
					thisVal.add(mirrorVal);
					//thisVal.norm();

					xVal = thisVal;
					this.vectorField[this.index(x, y)] = thisVal;
				}

				if(x >= this.width - 1 - smoothingRadius){
					const weight = map_range(this.width - 1 - x, 0, smoothingRadius, 0.5, 0.9);
					const thisVal = newVectorField[this.index(x,y)].clone();
					const mirrorVal = newVectorField[this.index(this.width - 1 - x, y)].clone();

					const mirrorWeight = 1 - weight;

					thisVal.mult(weight);
					mirrorVal.mult(mirrorWeight);
					thisVal.add(mirrorVal);
					//thisVal.norm();

					xVal = thisVal;
					this.vectorField[this.index(x, y)] = thisVal;
				}

				if(y <= smoothingRadius){
					const weight = map_range(y, 0, smoothingRadius, 0.5, 0.9);
					const thisVal = newVectorField[this.index(x,y)].clone();
					const mirrorVal = newVectorField[this.index(x, this.height - 1 - y)].clone();

					const mirrorWeight = 1 - weight;

					thisVal.mult(weight);
					mirrorVal.mult(mirrorWeight);
					thisVal.add(mirrorVal);
					//thisVal.norm();

					yVal = thisVal;
					this.vectorField[this.index(x, y)] = thisVal;
				}

				if(y >= this.height - 1 - smoothingRadius){
					const weight = map_range(this.height - 1 - y, 0, smoothingRadius, 0.5, 0.9);
					const thisVal = newVectorField[this.index(x,y)].clone();
					const mirrorVal = newVectorField[this.index(x, this.height - 1 - y)].clone();

					const mirrorWeight = 1 - weight;

					thisVal.mult(weight);
					mirrorVal.mult(mirrorWeight);
					thisVal.add(mirrorVal);
					//thisVal.norm();

					yVal = thisVal;
					this.vectorField[this.index(x, y)] = thisVal;
				}

				//Combine x and y
				if(xVal && yVal) {
					xVal.mult(0.5);
					yVal.mult(0.5);
					xVal.add(yVal);

					this.vectorField[this.index(x, y)] = xVal;
				}
			}
		}
	}

	draw(ctx, invertColors) {
		if (invertColors) {
			ctx.strokeStyle = `rgba(0, 0, 0, 255)`;
		} else {
			ctx.strokeStyle = `rgba(255, 255, 255, 125)`;
		}
		ctx.beginPath();
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let vector = this.vectorField[this.index(x, y)];

				ctx.moveTo(x * this.scale + this.scale / 2, y * this.scale + this.scale / 2);
				ctx.lineTo(x * this.scale + this.scale / 2 + vector.x * 10, y * this.scale + this.scale / 2 + vector.y * 10);
			}
		}
		ctx.stroke();
	}
}