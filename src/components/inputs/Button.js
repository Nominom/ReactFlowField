import styled from 'styled-components';

const Button = styled.button`
	border: 0.1rem solid orangered;
	color: orangered;
	padding: 1rem;
	padding-top: 0.5rem;
	padding-bottom: 0.5rem;
	font-weight: 700;

	&:focus {
		background-color: rgba(255, 255, 255, 0.05);
		border:0.12rem solid orangered;
		outline: none;
	}

	&:hover {
		background-color: rgba(255, 255, 255, 0.1);
		border:0.12rem solid orangered;
	}

	&:active {
		background-color: rgba(128, 45, 0, 0.3);
	}
`;

export default Button;