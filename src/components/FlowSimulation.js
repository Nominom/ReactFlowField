import React, { useRef, useEffect, useState } from "react";
import CheckBox from "./inputs/CheckBox";
import Button from "./inputs/Button";
import Slider from "./inputs/Slider";
import LabelSlider from "./inputs/LabelSlider";
const { Particle, CreateParticles } = require('./../flowfield/Particle');
const { FlowField } = require('./../flowfield/FlowField');


const FlowSimulation = () => {
	const [fieldStrength, setFieldStrength] = useState(0.6);
	const [noiseScale, setNoiseScale] = useState(0.1);
	const [scrollingMultiplier, setScrollingMultiplier] = useState(1);
	const [particleAlpha, setParticleAlpha] = useState(0.01);
	const [rgbParticles, setRgbParticles] = useState(false);
	const [switchedColors, setSwitchedColors] = useState(false);
	const [maxParticleSpeed, setMaxParticleSpeed] = useState(5);
	const [numParticles, setNumParticles] = useState(1000);
	const [renderVectors, setRenderVectors] = useState(false);
	const [particles, setParticles] = useState([]);
	const [flowField, setFlowField] = useState(null);
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const [viewScale, setViewScale] = useState(1);
	const [fps, setFps] = useState(0)

	const canvas1 = useRef();
	const canvas2 = useRef();
	const div = useRef();

	const scale = 20;
	const viewPortScaleThreshold = 800;

	const calculateSize = () => {
		const deltaW = width - div?.current?.getBoundingClientRect().width;
		const deltaH = height - div?.current?.getBoundingClientRect().height;

		if (Math.abs(deltaW + deltaH) > 100) {
			setWidth(div?.current?.getBoundingClientRect().width);
			setHeight(div?.current?.getBoundingClientRect().height);
			if (div?.current?.getBoundingClientRect().width <= viewPortScaleThreshold) {
				setViewScale(2);
			} else {
				setViewScale(1);
			}
		}
	}

	const clearCanvas = () => {
		if (canvas1.current) {
			let ctx = canvas1.current.getContext("2d");
			if (switchedColors) {
				ctx.fillStyle = 'rgb(255, 255, 255)';
			} else {
				ctx.fillStyle = 'rgb(0, 0, 0)';
			}
			ctx.fillRect(0, 0, width * viewScale, height * viewScale);
			let ctx2 = canvas2.current.getContext("2d");
			ctx2.clearRect(0, 0, width * viewScale, height * viewScale);
		}
	}

	const randomSeed = () => {
		if (width > 0 && height > 0) {
			setFlowField(new FlowField(width * viewScale, height * viewScale, scale));
		}
		clearCanvas();
	}

	useEffect(() => {

		let requestId;
		let last = performance.now();
		let lastfps = last;
		let z = 0;

		const draw = () => {
			if (canvas1.current && canvas2.current && flowField && width > 0 && height > 0) {
				let ctx = canvas1.current.getContext("2d");
				let ctx2 = canvas2.current.getContext("2d");

				ctx2.clearRect(0, 0, width * viewScale, height * viewScale);
				flowField.update(z, noiseScale);

				if (renderVectors === true) {
					flowField.draw(ctx2, switchedColors);
				}

				flowField.update(z, noiseScale);

				const now = performance.now();

				z += (1 / 1200) * scrollingMultiplier;

				if (now - lastfps > 1000) {
					const fps = 1000 / (now - last);
					console.log('fps:', fps);
					setFps(fps);
					lastfps = now;
				}
				last = now;

				for (let i = 0; i < particles.length; i++) {
					particles[i].follow(flowField, fieldStrength);
					particles[i].update(1);
					particles[i].edges(width * viewScale, height * viewScale);
					particles[i].draw(ctx, particleAlpha, rgbParticles ? 'dir' : switchedColors ? 'black' : 'white');
				}

			}

			requestId = window.requestAnimationFrame(draw);
		}

		draw();
		return () => {
			window.cancelAnimationFrame(requestId);
		};
	}, [flowField, particles, rgbParticles, particleAlpha, fieldStrength, noiseScale, scrollingMultiplier, switchedColors, renderVectors]);

	useEffect(() => {
		setParticles(CreateParticles(numParticles, width * viewScale, height * viewScale, maxParticleSpeed));
	}, [numParticles, width, height, viewScale, maxParticleSpeed]);

	useEffect(() => {
		if (width > 0 && height > 0) {
			setFlowField(new FlowField(width * viewScale, height * viewScale, scale));
		}
		clearCanvas();
	}, [width, height, viewScale]);

	useEffect(() => {
		calculateSize();
	}, [div, canvas1, canvas2])

	useEffect(() => {
		window.addEventListener('resize', calculateSize);
		return () => window.removeEventListener('resize', calculateSize);
	}, [])

	useEffect(() => {
		clearCanvas();
	}, [switchedColors])

	return (
		<div className="flex flex-col lg:flex-row-reverse min-h-screen">
			<div className="flex-none w-full md:h-64 lg:h-screen lg:w-64 bg-gray-900 text-gray-200">
				<div className="w-full h-full p-8 gap-4 grid grid-cols-2 grid-rows-4 md:grid-cols-4 md:grid-rows-2 lg:grid-cols-1 lg:grid-rows-none">
					<div>
						<Button onClick={clearCanvas} className="m-auto">Clear Canvas</Button>
					</div>
					<div>
						<Button onClick={randomSeed} className="m-auto">Randomize seed</Button>
					</div>
					<div>
						<CheckBox
							label="Show vectors"
							name="renderVectorField"
							onChange={setRenderVectors}
							checked={renderVectors} />
					</div>
					<LabelSlider label='Field strength:' min={0} max={1} value={fieldStrength} step={0.05} onChange={setFieldStrength} />

					<LabelSlider label='Particle alpha:' min={0.01} max={0.20} value={particleAlpha} step={0.01} onChange={setParticleAlpha} />

					<LabelSlider label='Field scrolling:' min={0} max={3} value={scrollingMultiplier} step={0.1} onChange={setScrollingMultiplier} />

					<LabelSlider label='Particles:' min={100} max={5000} value={numParticles} step={100} onChange={setNumParticles} />
					<div>
						<CheckBox
							label="RGB"
							name="rgbParticleColors"
							onChange={setRgbParticles}
							checked={rgbParticles}
							className=""
						/>
						<CheckBox
							label="B/W"
							name="switchColors"
							onChange={setSwitchedColors}
							checked={switchedColors}
							className="mt-2"
						/>
					</div>

				</div>
			</div>
			<div ref={div} style={{ height: window.innerHeight }} className="flex flex-grow">
				<canvas ref={canvas1} width={width * viewScale} height={height * viewScale}
					style={{ position: 'absolute', width: width, height: height }}>
				</canvas>
				<canvas ref={canvas2} width={width * viewScale} height={height * viewScale}
					style={{
						position: 'absolute', width: width, height: height,
						display: (renderVectors ? 'block' : 'none')
					}}>
				</canvas>
				<div className={`absolute p-2 ${switchedColors?'text-gray-900':'text-gray-200'}`}>{Math.round(fps)}</div>
			</div>
		</div>
	)
}

export default FlowSimulation