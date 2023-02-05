const options_els = {
	init: function() {
		let op = document.getElementsByClassName('options')[1]
		let fields = op.getElementsByClassName('options_input')
		let sliders = op.getElementsByClassName('slider')
		let buttons = op.querySelectorAll('button')
		
		this.list = ['brightness', 'saturation', 'contrast', 'shift_hue', 'sepia', 'grayscale']
		this.gridlines = {
			box: op.querySelectorAll('input')[0],
		}
		this.invert = {
			state: 0,
			box: op.querySelectorAll('input')[1],
		}
		this.brightness = {
			state: 100,
			field: fields[0],
			slider: sliders[0],
		}
		this.saturation = {
			state: 100,
			field: fields[1],
			slider: sliders[1],
		}
		this.contrast = {
			state: 100,
			field: fields[2],
			slider: sliders[2],
		}
		this.shift_hue = {
			state: 0,
			field: fields[3],
			slider: sliders[3],
		}
		this.sepia = {
			state: 0,
			field: fields[4],
			slider: sliders[4],
		}
		this.grayscale = {
			state: 0,
			field: fields[5],
			slider: sliders[5],
		}
		
		this.gridlines.box.addEventListener('input', toggleGridlines)
		this.invert.box.addEventListener('input', toggleInvert)
		
		for(let i = 0; i < 6; i++) {
			let temp = i
			fields[i].addEventListener('input', function() {filterField(temp)})
			fields[i].addEventListener('focusout', function() {setFieldValue(temp)})
			sliders[i].addEventListener('input', function() {filterSlider(temp)})
			buttons[i].addEventListener('click', function() {restoreDefault(temp)})
		}
	},
}

function toggleGridlines(e) {
	if(e.target.checked) {
		grid_cv.style.visibility = 'visible'
	} else {
		grid_cv.style.visibility = 'hidden'
	}
}

function toggleInvert(e) {
	if(e.target.checked) {
		options_els.invert.state = 100
	} else {
		options_els.invert.state = 0
	}
	applyFilter()
}

function filterField(f) {
	let filter = options_els[options_els.list[f]]
	let string = filter.field.value
	
	if(string[string.length - 1] === '%') {string = string.slice(0, -1)}
	let v = parseInt(filter.field.value, 10)
	if(filter.field.value === '') {v = 0}
	if(v < filter.slider.min) {v = filter.slider.min}
	if(v > filter.slider.max) {v = filter.slider.max}

	if(v >= filter.slider.min && v <= filter.slider.max) {
		filter.state = v
		filter.slider.value = v
		applyFilter()
	}
}

function setFieldValue(f) {
	if(f != 3) {
		options_els[options_els.list[f]].field.value = options_els[options_els.list[f]].state + '%'
	} else {
		options_els[options_els.list[f]].field.value = options_els[options_els.list[f]].state + '°'
	}
}

function filterSlider(f) {
	let filter = options_els[options_els.list[f]]
	filter.state = filter.slider.value
	if(f != 3) {filter.field.value = filter.state + '%'}
	else {filter.field.value = filter.state + '°'}
	applyFilter()
}

function restoreDefault(f) {
	let filter = options_els[options_els.list[f]]
	if(f < 3) {
		filter.state = 100
		filter.field.value = '100%'
		filter.slider.value = 100
	} else {
		filter.state = 0
		filter.field.value = '0%'
		if(f === 3) {filter.field.value = '0°'}
		filter.slider.value = 0
	}
	applyFilter()
}

function getFilter() {
	let string = 'hue-rotate(' +options_els.shift_hue.state+ 'deg) '
	string += 'brightness(' +options_els.brightness.state+ '%) '
	string += 'saturate(' +options_els.saturation.state+ '%) '
	string += 'contrast(' +options_els.contrast.state+ '%) '
	string += 'invert(' +options_els.invert.state+ '%) '
	string += 'sepia(' +options_els.sepia.state+ '%) '
	string += 'grayscale(' +options_els.grayscale.state+ '%)'
	return string
}

function applyFilter() {
	cv.style.filter = getFilter()
	select_cv.style.filter = getFilter()
	grid_cv.style.filter = 'invert(' +options_els.invert.state+ '%)'
	let s = 255 * (options_els.invert.state === 100)
	select_cv.style.boxShadow = '0 4px 8px 0 rgba('+s+', '+s+', '+s+', 0.2), 0 6px 20px 0 rgba('+s+', '+s+', '+s+', 0.19)'
	grid_cv.style.boxShadow = '0 4px 8px 0 rgba('+s+', '+s+', '+s+', 0.2), 0 6px 20px 0 rgba('+s+', '+s+', '+s+', 0.19)'
	save_data.projects[save_data.current].updateFilter()
}