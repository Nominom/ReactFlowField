import React from 'react';
import styled from 'styled-components';

const CheckBoxLabel = styled.label`
	position: relative;
	display: inline-block;
	width: 60px;
	height: 34px;

`;

const CheckBoxInput = styled.input`
	opacity: 0;
	width: 0;
	height: 0;

	&:checked + ${CheckBoxSlider}:before {
		-webkit-transform: translateX(26px);
		-ms-transform: translateX(26px);
		transform: translateX(26px);
	}
`;

const CheckBoxSlider = styled.span`
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: ${props => props.checked ? 'orangered' : '#777'};
	-webkit-transition: .4s;
	transition: .4s;
	border-radius: 34px;

	-webkit-tap-highlight-color: transparent;

	${CheckBoxInput}:focus + & {
		box-shadow: 0 0 1px #3B97D3;
	}

	&::before{
		position: absolute;
		content: "";
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: #ccc;
		-webkit-transition: .4s;
		transition: .4s;
		border-radius: 50%;
	}
`;
const CheckBox = ({ label, name, checked, onChange, className }) => {

	const handleInputChange = (event) => {
		const target = event.target;
		const value = target.checked;
		onChange(value);
	}

	return (
		<div className={(className ? className : "") + " flex flex-row flex-no-wrap"} >
			<CheckBoxLabel className="flex-none mr-4">
				<CheckBoxInput name={name} type="checkbox" checked={checked} onChange={handleInputChange} />
				<CheckBoxSlider checked={checked} />
			</CheckBoxLabel>
			<div className="flex pt-1">{label}</div>
		</div>
	)
}

export default CheckBox;