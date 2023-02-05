const preset_colors = [
	[0, 0, 0, '#000000'],
	[255, 255, 255, '#FFFFFF'],
	[128, 128, 128, '#808080'],
	[128, 0, 0, '#800000'],
	[255, 0, 0, '#FF0000'],
	[255, 165, 0, '#FFA500'],
	[255, 255, 0, '#FFFF00'],
	[0, 255, 0, '#00FF00'],
	[0, 128, 0, '#008000'],
	[0, 0, 255, '#0000FF'],
	[0, 0, 128, '#000080'],
	[255, 0, 255, '#FF00FF'],
	[128, 0, 128, '#800080'],
]

const color_values = [
	{
		r: 0,
		g: 0,
		b: 0,
		hex: '#000000',
	}
]
for(let i = 1; i < 14; i++) {
	color_values[i] = {
		r: preset_colors[i-1][0],
		g: preset_colors[i-1][1],
		b: preset_colors[i-1][2],
		hex: preset_colors[i-1][3],
	}
}

const background_color = {
	r: 255,
	g: 255,
	b: 255,
	hex: '#FFFFFF',
}

const els = {
	pallete: [],
	init: function() {
		let col_icons = document.getElementsByClassName('color_icon')
		let col_fields = document.getElementsByClassName('color_input')
		let col_wheels = document.getElementsByClassName('color_wheel')
		for(let i = 0; i < 14; i++) {
			this.pallete[i] = {
				icon: col_icons[i],
				wheel: col_wheels[i],
				fields: [
					col_fields[i*4],
					col_fields[(i*4)+1],
					col_fields[(i*4)+2],
					col_fields[(i*4)+3]
				]
			}
			
			if(i === 0) {
				this.pallete[i].fields[0].value = 0
				this.pallete[i].fields[1].value = 0
				this.pallete[i].fields[2].value = 0
				this.pallete[i].fields[3].value = '#000000'
			} else {
				this.pallete[i].fields[0].value = preset_colors[i-1][0]
				this.pallete[i].fields[1].value = preset_colors[i-1][1]
				this.pallete[i].fields[2].value = preset_colors[i-1][2]
				this.pallete[i].fields[3].value = preset_colors[i-1][3]
			}
			
			let temp = i
			this.pallete[i].fields[0].addEventListener('input', function() {changeColor(temp, 0)})
			this.pallete[i].fields[1].addEventListener('input', function() {changeColor(temp, 1)})
			this.pallete[i].fields[2].addEventListener('input', function() {changeColor(temp, 2)})
			this.pallete[i].fields[3].addEventListener('input', function() {changeColor(temp, 3)})
			
			this.pallete[i].fields[0].addEventListener('focusout', function() {setToValue(temp, 0)})
			this.pallete[i].fields[1].addEventListener('focusout', function() {setToValue(temp, 1)})
			this.pallete[i].fields[2].addEventListener('focusout', function() {setToValue(temp, 2)})
			this.pallete[i].fields[3].addEventListener('focusout', function() {setToValue(temp, 3)})
			
			this.pallete[i].wheel.addEventListener('click', function() {
				let col = color_picker_cv
				if(temp === picking_color) {
					col.style.visibility = 'hidden'
					picking_color = -1
					return
				}
				col.style.visibility = 'visible'
				if(temp === 0) {
					col.style.top = '8px'
					col.style.left = this.offsetParent.offsetLeft + 105 + 'px'
				} else{
					if(56 + (43 * (temp - 1)) + col.offsetHeight > document.body.clientHeight) {
						col.style.top = (document.body.clientHeight - col.offsetHeight) + 'px'
					} else {
						col.style.top = (56 + (43 * (temp - 1))) + 'px'
					}
					col.style.left = this.offsetParent.offsetLeft + 95 + 'px'
				}
				picking_color = temp
			})
			
			this.pallete[i].icon.addEventListener('mousedown', function(e) {setActiveColor(temp, e)})
			this.pallete[i].icon.addEventListener('contextmenu', function(e) {e.preventDefault(); return false})
		}
	}
}

function setActiveColor(color, e) {
	if(e.buttons === 1) {
		if(active_tool === 2 || active_tool === 3) {
			forceSelectTool(0)
		}
		els.pallete[0].icon.style.backgroundColor = color_values[color].hex
		color_values[0].r = color_values[color].r
		color_values[0].g = color_values[color].g
		color_values[0].b = color_values[color].b
		color_values[0].hex = color_values[color].hex
		setToValue(0, 0)
		setToValue(0, 1)
		setToValue(0, 2)
		setToValue(0, 3)
	}
	if(e.buttons === 2) {
		els.pallete[color].icon.style.backgroundColor = color_values[0].hex
		color_values[color].r = color_values[0].r
		color_values[color].g = color_values[0].g
		color_values[color].b = color_values[0].b
		color_values[color].hex = color_values[0].hex
		setToValue(color, 0)
		setToValue(color, 1)
		setToValue(color, 2)
		setToValue(color, 3)
	}
}

function changeColor(color, field) {
	let rgb = ['r', 'g', 'b', 'hex']
	let v = parseInt(els.pallete[color].fields[field].value, 10)
	if(els.pallete[color].fields[field].value === '') {v = 0}

	if(field < 3 && v > -1 && v < 256) {
		color_values[color][rgb[field]] = v
		els.pallete[color].icon.style.backgroundColor = 'rgb('+color_values[color].r+','+color_values[color].g+','+color_values[color].b+')'
		
		let hex_r = color_values[color].r.toString(16)
		let hex_g = color_values[color].g.toString(16)
		let hex_b = color_values[color].b.toString(16)
		
		if(hex_r.length === 1) {hex_r = '0' + hex_r}
		if(hex_g.length === 1) {hex_g = '0' + hex_g}
		if(hex_b.length === 1) {hex_b = '0' + hex_b}
		
		color_values[color].hex = ('#' + hex_r + hex_g + hex_b).toUpperCase()
		setToValue(color, 3)
	}
	
	if(field === 3) {
		let string = els.pallete[color].fields[field].value
		if(string === '') {string = '000000'}
		if(string[0] === '#') {
			string = string.slice(1)
		}
		if(string.length === 6) {
			let r = parseInt((string[0] + string[1]), 16)
			let g = parseInt((string[2] + string[3]), 16)
			let b = parseInt((string[4] + string[5]), 16)
			if((r > -1 && r < 256) && (g > -1 && g < 256) && (b > -1 && b < 256)) {
				color_values[color].r = r
				color_values[color].g = g
				color_values[color].b = b
				color_values[color].hex = '#' + string
				els.pallete[color].icon.style.backgroundColor = '#' + string
				setToValue(color, 0)
				setToValue(color, 1)
				setToValue(color, 2)
			}
		}
		
	}
}

function setToValue(color, field) {
	let rgb = ['r', 'g', 'b', 'hex']
	els.pallete[color].fields[field].value = color_values[color][rgb[field]]
}