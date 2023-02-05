let pixels 
let filters

let active_tool = 0
let forceSelectTool
let picking_color

let mouse_down = false
let ctrl_pressed = 0
let c_pressed = 0
let x_pressed = 0
let v_pressed = 0

function globalMouseDown(e) {
	if(e.buttons === 1) {mouse_down = true}
	
	if(e.target.className != 'color_wheel' && e.target.className != 'color_picker_cv') {
		color_picker_cv.style.visibility = 'hidden'
		picking_color = -1
	}
	if(active_tool === 2 && e.target.className != 'main_cv' && e.target.className != 'tool_icon') {
		select_tool.clear()
	}
}

function globalMouseUp(e) {
	if(e.button === 0) {
		mouse_down = false
		if(select_tool.selecting) {select_tool.end(e)}
		if(select_tool.grabbing) {select_tool.release(e)}
	}
}

function globalKeyDown(e) {
	ctrl_pressed = ctrl_pressed | (e.code === 'ControlLeft' | e.code === 'ControlRight')
	if(ctrl_pressed && !c_pressed && e.code === 'KeyC' && active_tool === 2 && select_tool.selected.length) {
		select_tool.copy()
		c_pressed = 1
	}
	if(ctrl_pressed && !x_pressed && e.code === 'KeyX' && active_tool === 2 && select_tool.selected.length) {
		select_tool.cut()
		x_pressed = 1
	}
	if(ctrl_pressed && !v_pressed && e.code === 'KeyV' && select_tool.saved.colors.length) {
		select_tool.paste()
		v_pressed = 1
	}
	if(e.code === "Delete" || e.code === "Backspace") {
		select_tool.cancel()
	}
}

function globalKeyUp(e) {
	ctrl_pressed = ctrl_pressed & !(e.code === 'ControlLeft' | e.code === 'ControlRight')
	c_pressed = c_pressed && !(e.code === 'KeyC')
	x_pressed = x_pressed && !(e.code === 'KeyX')
	v_pressed = v_pressed && !(e.code === 'KeyV')
}

function init() {
	column1.append(cv)
	column1.append(select_cv)
	column1.append(grid_cv)
	document.body.append(color_picker_cv)
	gridlines()
	pallete()
	save_load_el.init()
	tools()
	select_tool.ctx = select_tool.cv.getContext('2d')
	options()
	els.init()
	options_els.init()
	if(localStorage.projects) {
		save_data.load()
	} else {
		save_data.createProject()
	}
	document.addEventListener('mousedown', globalMouseDown)
	document.addEventListener('mouseup', globalMouseUp)
	document.addEventListener('keydown', globalKeyDown)
	document.addEventListener('keyup', globalKeyUp)
	cv.addEventListener('mousemove', draw)
	cv.addEventListener('mousedown', cvClick)
	cv.addEventListener('contextmenu', function() {event.preventDefault(); return false})
}