import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Slider from './Slider';


const LabelSlider = ({ min, max, value, onChange, className, step, label }) => {

	const [changedValue, setChangedValue] = useState(value);

	const sendValue = () => {
		if(changedValue != value){
			onChange(changedValue);
		}
	}

	useEffect(() => {
		window.addEventListener("mouseup", sendValue);
		window.addEventListener("touchend", sendValue);
		return () => {
			window.removeEventListener("mouseup", sendValue);
			window.removeEventListener("touchend", sendValue);
		}
	}, [changedValue, value]);

	return (
		<div className={className}>
			<label className="truncate">{label} {changedValue}</label>
			<Slider className="mt-4" min={min} max={max} value={changedValue} step={step} onChange={setChangedValue} />
		</div>
	)
}

export default LabelSlider;