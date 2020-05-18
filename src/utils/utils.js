const PI = 3.14159265;

function map_range(value, low1, high1, low2, high2) {
	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function clamp(value, min, max){
	if(value < min){
		return min;
	}else if(value > max){
		return max;
	}
	return value;
}


export {PI, map_range, clamp};