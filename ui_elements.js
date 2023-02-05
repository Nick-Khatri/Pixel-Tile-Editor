const body = document.createElement('div')
body.classList.add('main_body')
const column0 = document.createElement('div')
const column1 = document.createElement('div')
const column2 = document.createElement('div')
column0.classList.add('column')
column1.classList.add('column')
column2.classList.add('column')
column1.style.width = '640px'
column1.style.paddingTop = '3px'
body.append(column0)
body.append(column1)
body.append(column2)
document.body.append(body)

const cv = document.createElement('canvas')
cv.classList.add('main_cv')
cv.width = 640
cv.height = 640
cv.style.backgroundColor = 'white'
const ctx = cv.getContext('2d')
ctx.imageSmoothingEnabled = false

const grid_cv = document.createElement('canvas')
grid_cv.classList.add('main_cv')
grid_cv.style.pointerEvents = 'none'
grid_cv.width = 640
grid_cv.height = 640
const grid_ctx = grid_cv.getContext('2d')
grid_ctx.imageSmoothingEnabled = false

const select_cv = document.createElement('canvas')
select_cv.classList.add('main_cv')
select_cv.style.pointerEvents = 'none'
select_cv.width = 640
select_cv.height = 640
const select_ctx = select_cv.getContext('2d')
select_ctx.imageSmoothingEnabled = false

const color_picker_cv = initColorPicker()

function initColorPicker() {
	let col = document.createElement('canvas')
	col.classList.add('color_picker_cv')
	col.width = 256
	col.height = 256
	let col_ctx = col.getContext('2d')
	
	let gradient = col_ctx.createLinearGradient(0, 0, col.width, 0)
	gradient.addColorStop(0, '#ff0000')
	gradient.addColorStop(1 / 6, '#ffff00')
	gradient.addColorStop((1 / 6) * 2, '#00ff00')
	gradient.addColorStop((1 / 6) * 3, '#00ffff')
	gradient.addColorStop((1 / 6) * 4, '#0000ff')
	gradient.addColorStop((1 / 6) * 5, '#ff00ff')
	gradient.addColorStop(1, '#ff0000')
	col_ctx.fillStyle = gradient
	col_ctx.fillRect(0, 0, col.width, col.height)
	
	gradient = col_ctx.createLinearGradient(0, 0, 0, col.height)
	gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
	gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)')
	gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
	col_ctx.fillStyle = gradient
	col_ctx.fillRect(0, 0, col.width, col.height)
	
	gradient = col_ctx.createLinearGradient(0, 0, 0, col.height)
	gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
	gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)')
	gradient.addColorStop(1, 'rgba(0, 0, 0, 1)')
	col_ctx.fillStyle = gradient
	col_ctx.fillRect(0, 0, col.width, col.height)
	
	col.addEventListener('click', function(e) {
		
		let color_data = col_ctx.getImageData((e.offsetX / col.clientWidth) * col.width, (e.offsetY / col.clientHeight) * col.height, 1, 1).data
		color_values[picking_color].r = color_data[0]
		color_values[picking_color].g = color_data[1]
		color_values[picking_color].b = color_data[2]
		
		let hex_r = color_data[0].toString(16)
		let hex_g = color_data[1].toString(16)
		let hex_b = color_data[2].toString(16)
		
		if(hex_r.length === 1) {hex_r = '0' + hex_r}
		if(hex_g.length === 1) {hex_g = '0' + hex_g}
		if(hex_b.length === 1) {hex_b = '0' + hex_b}
		
		color_values[picking_color].hex = ('#' + hex_r + hex_g + hex_b).toUpperCase()
		els.pallete[picking_color].icon.style.backgroundColor = color_values[picking_color].hex
		
		setToValue(picking_color, 0)
		setToValue(picking_color, 1)
		setToValue(picking_color, 2)
		setToValue(picking_color, 3)
	})
	
	return col
}

function pallete() {
	let pal = document.createElement('div')
	pal.classList.add('pallete')
	
	let s = document.createElement('div')
	s.classList.add('selected_color')
	let icon = colorIcon(0, 0, 0)
	icon.style.margin = '8px'
	s.append(icon)
	let inp = colorInputs()
	inp.style.left = '48px'
	inp.style.top = '14px'
	s.append(inp)
	let wheel = document.createElement('div')
	wheel.classList.add('color_wheel')
	wheel.style.right = '16px'
	wheel.style.top = '13px'
	s.append(wheel)
	pal.append(s)
	
	let tt = document.createElement('div')
	tt.classList.add('tooltip')
	tt.innerHTML = 'LC - Select</br>RC - Overwrite'
	icon.addEventListener('mouseenter', function() {tt.style.visibility = 'visible'; tt.innerHTML = 'Right Click Canvas</br>to Copy a Color'})
	icon.addEventListener('mouseleave', function() {tt.style.visibility = 'hidden'})
	icon.addEventListener('mousemove', function() {tt.style.transform = 'translate('+event.clientX+'px, '+event.clientY+'px)'})
	pal.append(tt)
	
	let c = document.createElement('div')
	c.classList.add('color_list')
	for(let i = 0; i < 13; i++) {
		let row = document.createElement('div')
		row.classList.add('pallete_row')
		let icon = colorIcon(preset_colors[i][0], preset_colors[i][1], preset_colors[i][2])
		row.append(icon)
		icon.addEventListener('mouseenter', function() {tt.style.visibility = 'visible'; tt.innerHTML = 'LC - Select</br>RC - Overwrite'})
		icon.addEventListener('mouseleave', function() {tt.style.visibility = 'hidden'})
		icon.addEventListener('mousemove', function() {tt.style.transform = 'translate('+event.clientX+'px, '+event.clientY+'px)'})
		row.append(colorInputs())
		let wheel = document.createElement('div')
		wheel.classList.add('color_wheel')
		row.append(wheel)
		if(i === 12) {
			row.style.borderBottomWidth = '0px'
		}
		c.append(row)
	}
	
	pal.append(c)
	column2.append(pal)
}

const save_load_el = {
	init: function() {
		let container = document.createElement('div')
		container.classList.add('options_container')
		
		let el = document.createElement('div')
		el.classList.add('options')
		
		let row0 = document.createElement('div')
		row0.style.paddingTop = '7px'
		row0.style.marginRight = '8px'
		row0.style.marginLeft = '8px'
		row0.style.display = 'flex'
		row0.style.justifyContent = 'space-between'
		
		let b0 = document.createElement('button')
		b0.style.fontSize = '14px'
		b0.innerHTML = 'New Project'
		b0.addEventListener('click', function() {save_data.createProject()})
		let b1 = document.createElement('button')
		b1.style.fontSize = '14px'
		b1.innerHTML = 'Save'
		b1.addEventListener('click', function() {localStorage.setItem('projects', JSON.stringify(save_data.projects))})
		let b2 = document.createElement('button')
		b2.style.fontSize = '14px'
		b2.innerHTML = 'Download'
		b2.addEventListener('click', dlTile)
		let b3 = document.createElement('button')
		b3.style.fontSize = '14px'
		b3.innerHTML = 'Delete'
		b3.addEventListener('click', function() {save_data.deleteProject()})
		
		row0.append(b0)
		row0.append(b1)
		row0.append(b2)
		row0.append(b3)
		
		let row1 = document.createElement('div')
		row1.style.paddingTop = '6px'
		row1.style.paddingBottom = '7px'
		row1.style.marginRight = '8px'
		row1.style.marginLeft = '8px'
		row1.style.display = 'flex'
		
		let b4 = document.createElement('button')
		b4.style.fontSize = '14px'
		b4.innerHTML = 'Edit Name'
		b4.addEventListener('click', function() {
			let name = prompt('Enter New Name', save_data.projects[save_data.current].name)
			if(name != null && name != '') {
				save_data.projects[save_data.current].rename(name)
			}
		})
		row1.append(b4)
		
		let s = document.createElement('select')
		s.style.fontSize = '14px'
		s.style.direction = 'rtl'
		s.style.paddingRight = '6px'
		s.style.flex = 1
		s.style.marginLeft = '4px'
		row1.append(s)
		s.addEventListener('change', function() {
			for(let i = 0; i < save_data.projects.length; i++) {
				if(save_data.projects[i].name === this.value) {
					save_data.projects[i].load()
					save_data.current = i
					return
				}
			}
		})
		this.dropdown_list = s
		
		el.append(row0)
		el.append(row1)
		container.append(el)
		column0.append(container)
	},
}

function tools() {
	let tc = document.createElement('div')
	tc.classList.add('options_container')
	tc.style.top = '16px'
	let t = document.createElement('div')
	t.classList.add('tools')
	let tr_0 = document.createElement('div')
	tr_0.classList.add('tool_row')
	let tr_1 = document.createElement('div')
	tr_1.classList.add('tool_row')
	let tr_2 = document.createElement('div')
	tr_2.classList.add('tool_row')
	tr_2.style.borderBottomWidth = '0px'
	
	let icon_images = ["url('assets/pencil.png')", "url('assets/paint_bucket.png')", "url('assets/selection.png')", "url('assets/eraser.png')",
						"url('assets/rotate_right.png')", "url('assets/rotate_left.png')", "url('assets/reflect_vertical.png')", "url('assets/reflect_horizontal.png')",
						"url('assets/copy.png')", "url('assets/cut.png')", "url('assets/paste.png')", "url('assets/cancel.png')",]
	let tooltip_text = [
		'Draw', 'Fill', 'Select', 'Erase',
		'Copy (Ctrl+C)', 'Cut (Ctrl+X)', 'Paste (Ctrl+P)', 'Cancel Selection (Backspace/Delete)',
		'Rotate Right (90°)', 'Rotate Left (90°)', 'Reflect Vertical', 'Reflect Horizontal',
	]
	let icons = []
	let setTool = function(e) {
		icons[active_tool].classList.replace('tool_icon_selected', 'tool_icon')
		e.target.classList.replace('tool_icon', 'tool_icon_selected')
		active_tool = icons.indexOf(e.target)
		select_tool.clear()
	}
	
	forceSelectTool = function(n) {
		icons[active_tool].classList.replace('tool_icon_selected', 'tool_icon')
		icons[n].classList.replace('tool_icon', 'tool_icon_selected')
		active_tool = n
		select_tool.clear()
	}
	
	let tt = document.createElement('div')
	tt.classList.add('tooltip')
	
	for(let i = 0; i < 4; i++) {
		let icon = document.createElement('div')
		if(i === 0) {icon.classList.add('tool_icon_selected')}
		else{icon.classList.add('tool_icon')}
		icon.addEventListener('click', setTool)
		icon.addEventListener('mouseenter', function() {tt.innerHTML = tooltip_text[i]})
		if(i === 3) {icon.style.borderRightWidth = '0px'}
		icon.style.backgroundImage = icon_images[i]
		icons[i] = icon
		tr_0.append(icon)
	}
	
	let f_list = [
		function() {if(active_tool === 2 && select_tool.selected.length) {select_tool.copy()}},
		function() {if(active_tool === 2 && select_tool.selected.length) {select_tool.cut()}},
		function() {if(select_tool.saved.colors.length) {select_tool.paste()}},
		function() {select_tool.cancel()},
	]
	
	for(let i = 0; i < 4; i++) {
		let icon = document.createElement('div')
		icon.classList.add('tool_icon')
		icon.addEventListener('click', f_list[i])
		if(i === 3) {icon.style.borderRightWidth = '0px'}
		icon.style.backgroundImage = icon_images[i+8]
		icon.addEventListener('mouseenter', function() {tt.innerHTML = tooltip_text[i+4]})
		tr_1.append(icon)
	}
	
	for(let i = 0; i < 4; i++) {
		let icon = document.createElement('div')
		icon.classList.add('tool_icon')
		let temp = i
		icon.addEventListener('click', function() {applyTransform[temp]()})
		if(i === 3) {icon.style.borderRightWidth = '0px'}
		icon.style.backgroundImage = icon_images[i+4]
		icon.addEventListener('mouseenter', function() {tt.innerHTML = tooltip_text[i+8]})
		tr_2.append(icon)
	}
	
	t.append(tr_0)
	t.append(tr_1)
	t.append(tr_2)
	t.append(tt)
	t.addEventListener('mouseleave', function() {tt.style.visibility = 'hidden'})
	t.addEventListener('mousemove', function() {
		if(event.target === t) {tt.style.visibility = 'hidden'} else {tt.style.visibility = 'visible'}
		tt.style.transform = 'translate('+event.clientX+'px, '+event.clientY+'px)'})
	tc.append(t)
	column0.append(tc)
}

function options() {
	let el = document.createElement('div')
	el.classList.add('options_container')
	let op = document.createElement('div')
	op.classList.add('options')
	
	let gl = document.createElement('div')
	gl.classList.add('options_row')
	gl.style.paddingBottom = '5px'
	let inv = document.createElement('span')
	inv.style.float = 'right'
	inv.append(document.createElement('span'))
	inv.append(checkBox(false))
	inv.querySelector('span').innerText = 'Invert Colors:'
	gl.append(document.createElement('span'))
	gl.querySelector('span').innerText = 'Grid Lines:'
	gl.append(checkBox(true))
	gl.append(inv)
	op.append(gl)
	
	let brt = document.createElement('div')
	brt.classList.add('options_row')
	brt.append(document.createElement('div'))
	brt.querySelector('div').innerText = 'Brightness: '
	brt.querySelector('div').append(optionsInput('100%'))
	brt.querySelector('div').append(defaultButton())
	brt.append(slider(0, 300, 100))
	op.append(brt)
	
	let sat = document.createElement('div')
	sat.classList.add('options_row')
	sat.append(document.createElement('div'))
	sat.querySelector('div').innerText = 'Saturation: '
	sat.querySelector('div').append(optionsInput('100%'))
	sat.querySelector('div').append(defaultButton())
	sat.append(slider(0, 300, 100))
	op.append(sat)
	
	let con = document.createElement('div')
	con.classList.add('options_row')
	con.append(document.createElement('div'))
	con.querySelector('div').innerText = 'Contrast: '
	con.querySelector('div').append(optionsInput('100%'))
	con.querySelector('div').append(defaultButton())
	con.append(slider(0, 300, 100))
	op.append(con)
	
	let hue = document.createElement('div')
	hue.classList.add('options_row')
	hue.append(document.createElement('div'))
	hue.querySelector('div').innerText = 'Shift Hue: '
	hue.querySelector('div').append(optionsInput('0°'))
	hue.querySelector('div').append(defaultButton())
	hue.append(slider(0, 360, 0))
	op.append(hue)
	
	let sep = document.createElement('div')
	sep.classList.add('options_row')
	sep.append(document.createElement('div'))
	sep.querySelector('div').innerText = 'Sepia: '
	sep.querySelector('div').append(optionsInput('0%'))
	sep.querySelector('div').append(defaultButton())
	sep.append(slider(0, 100, 0))
	op.append(sep)
	
	let gry = document.createElement('div')
	gry.classList.add('options_row')
	gry.style.borderBottomWidth = '0px'
	gry.style.paddingBottom = '2px'
	gry.append(document.createElement('div'))
	gry.querySelector('div').innerText = 'Grayscale: '
	gry.querySelector('div').append(optionsInput('0%'))
	gry.querySelector('div').append(defaultButton())
	gry.append(slider(0, 100, 0))
	op.append(gry)
	
	el.append(op)
	column0.append(el)
}

function optionsInput(value) {
	let inp = document.createElement('input')
	inp.type = 'text'
	inp.classList.add('options_input')
	inp.value = value
	inp.addEventListener('focusin', function() {this.select()})
	return inp
}

function checkBox(checked) {
	let box = document.createElement('input')
	box.type = 'checkbox'
	box.checked = checked
	return box
}

function slider(min, max, pos) {
	let sld = document.createElement('input')
	sld.type = 'range'
	sld.min = min
	sld.max = max
	sld.value = pos
	sld.classList.add('slider')
	return sld
}

function defaultButton() {
	let b = document.createElement('button')
	b.innerText = 'Default'
	b.style.float = 'right'
	b.style.marginRight = '8px'
	return b
}

function colorIcon(r, g, b) {
	let col = document.createElement('div')
	col.classList.add('color_icon')
	col.style.backgroundColor = 'rgb('+r+','+g+','+b+')'
	return col
}

function colorInputs() {
	let labels = ['R:', 'G:', 'B:', 'Hex:']
	let el = document.createElement('div')
	el.classList.add('input_row')
	for(let i = 0; i < 4; i++) {
		let text_field = document.createElement('input')
		text_field.type = 'text'
		text_field.classList.add('color_input')
		text_field.addEventListener('focusin', function() {this.select()})
		if(i === 3) {
			text_field.style.width = '64px'
		}
		
		let lbl = document.createElement('span')
		lbl.innerText = labels[i]
		lbl.style.marginRight = '1px'
		lbl.style.marginLeft = '10px'
		
		el.append(lbl)
		el.append(text_field)
	}
	return el
}

function colorWheelIcon() {
	let wheel = document.createElement('div')
	wheel.classList.add('color_wheel')
	document.body.append(wheel)
}

function gridlines() {
	grid_ctx.lineWidth = 1
	grid_ctx.setLineDash([6, 4])
	grid_ctx.lineDashOffset = -2
	grid_ctx.beginPath()
	for(let i = 1; i < 16; i++) {
		if(i % 4 != 0) {
			grid_ctx.moveTo(i*40, 0)
			grid_ctx.lineTo(i*40, 640)
			grid_ctx.moveTo(0, i*40)
			grid_ctx.lineTo(640, i*40)
		}
	}
	grid_ctx.strokeStyle = 'rgb(16,24,32)'
	grid_ctx.stroke()
	
	grid_ctx.setLineDash([0, 0])
	grid_ctx.beginPath()
	grid_ctx.moveTo(160, 0)
	grid_ctx.lineTo(160, 640)
	grid_ctx.moveTo(480, 0)
	grid_ctx.lineTo(480, 640)
	grid_ctx.moveTo(0, 160)
	grid_ctx.lineTo(640, 160)
	grid_ctx.moveTo(0, 480)
	grid_ctx.lineTo(640, 480)
	grid_ctx.strokeStyle = 'black'
	grid_ctx.stroke()
	
	grid_ctx.beginPath()
	grid_ctx.moveTo(320, 0)
	grid_ctx.lineTo(320, 640)
	grid_ctx.moveTo(0, 320)
	grid_ctx.lineTo(640, 320)
	grid_ctx.strokeStyle = 'red'
	grid_ctx.stroke()
}