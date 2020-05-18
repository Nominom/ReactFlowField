import React, { useState, useEffect } from 'react';
import styled from 'styled-components';


const StyledSlider = styled.input`
	appearance: none;
	width: 100%;
	height: 15px;
	border-radius: 5px;  
	background: #d3d3d3;
	outline: none;
	opacity: 0.7;
	-webkit-transition: .2s;
	transition: opacity .2s;

	&::-webkit-slider-thumb {
		appearance: none;
		width: 25px;
		height: 25px;
		border-radius: 50%; 
		background: orangered;
		cursor: pointer;
	}
`;

const Slider = ({ min, max, value, onChange, className, step }) => {

	const handleInputChange = (event) => {
		const target = event.target;
		onChange(Number(target.value));
	}

	return (
		<div className={className ? className : "w-full"} >
			<StyledSlider type="range" min={min} max={max} value={value} step={step} onChange={handleInputChange} />
		</div>
	)
}

export default Slider;