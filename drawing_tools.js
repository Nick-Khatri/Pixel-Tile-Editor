function cvClick(e) {
	if(e.buttons === 1) {
		drawWith[active_tool](e)
	}
	
	if(e.buttons === 2) {
		let x = Math.floor(e.layerX / 40)
		let y = Math.floor(e.layerY / 40)
		let string = pixels[y*16+x].slice(1)
		
		els.pallete[0].icon.style.backgroundColor = pixels[y*16+x]
		color_values[0].r = parseInt((string[0] + string[1]), 16)
		color_values[0].g = parseInt((string[2] + string[3]), 16)
		color_values[0].b = parseInt((string[4] + string[5]), 16)
		color_values[0].hex = pixels[y*16+x]
		
		setToValue(0, 0)
		setToValue(0, 1)
		setToValue(0, 2)
		setToValue(0, 3)
	}
}

function draw(e) {
	if(mouse_down) {drawWith[active_tool](e)}
}

const drawWith = [
	function(e) {
		let x = Math.floor(e.layerX / 40)
		let y = Math.floor(e.layerY / 40)
		ctx.fillStyle = color_values[0].hex
		ctx.fillRect(x * 40, y * 40, 40, 40)
		pixels[y*16+x] = color_values[0].hex
	},
	function(e) {
		let x = Math.floor(e.layerX / 40)
		let y = Math.floor(e.layerY / 40)
		floodFill(x, y)
	},
	function(e) {
		if(select_tool.selected.length > 0 && select_tool.grabbing) {
			return select_tool.drag(e)
		}
		if(select_tool.selected.length > 0 && !select_tool.grabbing) {
			return select_tool.grab(e)
		}
		if(select_tool.selecting) {
			select_tool.move(e)
		} else {
			select_tool.start(e)
		}
	},
	function(e) {
		let x = Math.floor(e.layerX / 40)
		let y = Math.floor(e.layerY / 40)
		ctx.fillStyle = background_color.hex
		ctx.fillRect(x * 40, y * 40, 40, 40)
		pixels[y*16+x] = background_color.hex
	},
]

const select_tool = {
	selecting: false,
	grabbing: false,
	replacing: false,
	cv: document.createElement('canvas'),
	starting_point: {
		x: 0,
		y: 0,
	},
	last_mouse_pos: {
		x: 0,
		y: 0,
	},
	selected: [],
	box: [],
	colors: [],
	saved: {colors: [], box: []},
	start: function(e) {
		this.selecting = true
		this.selected = []
		this.box = []
		this.colors = []
		this.starting_point.x = e.layerX
		this.starting_point.y = e.layerY
		this.last_mouse_pos.x = e.layerX
		this.last_mouse_pos.y = e.layerY
	},
	move: function(e) {
		this.last_mouse_pos.x = e.layerX
		this.last_mouse_pos.y = e.layerY
		let x = e.layerX - this.starting_point.x
		let y = e.layerY - this.starting_point.y
		
		select_ctx.clearRect(0, 0, select_cv.width, select_cv.height)
		select_ctx.fillStyle = 'powderblue'
		select_ctx.globalAlpha = .4
		select_ctx.fillRect(this.starting_point.x, this.starting_point.y, x, y)
	},
	end: function(e) {
		this.selecting = false
		let x1
		let y1
		let x2
		let y2
		if(this.last_mouse_pos.x > this.starting_point.x) {
			x1 = Math.floor(this.starting_point.x / 40)
			x2 = Math.ceil(this.last_mouse_pos.x / 40)
		} else {
			x1 = Math.ceil(this.starting_point.x / 40)
			x2 = Math.floor(this.last_mouse_pos.x / 40)
		}
		if(this.last_mouse_pos.y > this.starting_point.y) {
			y1 = Math.floor(this.starting_point.y / 40)
			y2 = Math.ceil(this.last_mouse_pos.y / 40)
		} else {
			y1 = Math.ceil(this.starting_point.y / 40)
			y2 = Math.floor(this.last_mouse_pos.y / 40)
		}
		
		select_ctx.clearRect(0, 0, select_cv.width, select_cv.height)
		select_ctx.fillStyle = 'powderblue'
		select_ctx.globalAlpha = .4
		select_ctx.fillRect(x1 * 40, y1 * 40, (x2-x1) * 40, (y2-y1) * 40)
		
		if(x1 > x2) {[x1, x2] = [x2, x1]}
		if(y1 > y2) {[y1, y2] = [y2, y1]}
		this.box = [[x1 * 40, y1 * 40], [x2 * 40, y2 * 40]]
		
		for(let y = y1; y < y2; y++) {
			for(let x = x1; x < x2; x++) {
				this.selected.push(y*16+x)
				this.colors.push(pixels[y*16+x])
			}
		}
		
		let w = this.box[1][0] - this.box[0][0]
		let h = this.box[1][1] - this.box[0][1]
		
		this.cv.width = w
		this.cv.height = h
	},
	grab: function(e) {
		if(e.layerX >= this.box[0][0] && e.layerX <= this.box[1][0] && e.layerY >= this.box[0][1] && e.layerY <= this.box[1][1]) {
			this.grabbing = true
			this.starting_point.x = e.layerX
			this.starting_point.y = e.layerY
			
			let w = this.box[1][0] - this.box[0][0]
			let h = this.box[1][1] - this.box[0][1]
			
			let i = 0
			for(let y = 0; y < h/40; y++) {
				for(let x = 0; x < w/40; x++) {
					this.ctx.fillStyle = this.colors[i]
					this.ctx.fillRect(x*40, y*40, 40, 40)
					
					if(this.selected[0] != -1) {
						ctx.fillStyle = background_color.hex
						ctx.fillRect((this.selected[i] % 16) * 40, (Math.floor(this.selected[i]/16)) * 40, 40, 40)
						pixels[this.selected[i]] = background_color.hex
					}
					i++
				}
			}
			this.drag(e)
		} else {
			if(this.replacing) {this.replace()}
			this.start(e)
		}
	},
	drag: function(e) {
		let translate_x = e.layerX - this.starting_point.x
		let translate_y = e.layerY - this.starting_point.y
		select_ctx.clearRect(0, 0, select_cv.width, select_cv.height)
		select_ctx.globalAlpha = 1
		select_ctx.drawImage(this.cv, this.box[0][0] + translate_x, this.box[0][1] + translate_y)
		select_ctx.fillStyle = 'powderblue'
		select_ctx.globalAlpha = .4
		select_ctx.fillRect(this.box[0][0] + translate_x, this.box[0][1] + translate_y, (this.box[1][0]-this.box[0][0]), (this.box[1][1]-this.box[0][1]))
	},
	release: function(e) {
		let translate_x = e.layerX - this.starting_point.x
		let translate_y = e.layerY - this.starting_point.y
		this.grabbing = false

		if(e.target === cv) {
			if(translate_x >= 0) {
				this.box[0][0] += Math.floor((translate_x + 20) / 40) * 40
				this.box[1][0] += Math.floor((translate_x + 20) / 40) * 40
			} else {
				this.box[0][0] += Math.ceil((translate_x - 20) / 40) * 40
				this.box[1][0] += Math.ceil((translate_x - 20) / 40) * 40
			}
			if(translate_y >= 0) {
				this.box[0][1] += Math.floor((translate_y + 20) / 40) * 40
				this.box[1][1] += Math.floor((translate_y + 20) / 40) * 40
			} else {
				this.box[0][1] += Math.ceil((translate_y - 20) / 40) * 40
				this.box[1][1] += Math.ceil((translate_y - 20) / 40) * 40
			}
			
			if(this.box[0][0] === 640) {
				this.box[0][0] -= 40
				this.box[1][0] -= 40
			}
			if(this.box[1][0] === 0) {
				this.box[0][0] += 40
				this.box[1][0] += 40
			}
			if(this.box[1][1] === 0) {
				this.box[0][1] += 40
				this.box[1][1] += 40
			}
			if(this.box[0][1] === 640) {
				this.box[0][1] -= 40
				this.box[1][1] -= 40
			}
		}
		
		select_ctx.clearRect(0, 0, select_cv.width, select_cv.height)
		select_ctx.globalAlpha = 1
		select_ctx.drawImage(this.cv, this.box[0][0], this.box[0][1])
		select_ctx.fillStyle = 'powderblue'
		select_ctx.globalAlpha = .4
		select_ctx.fillRect(this.box[0][0], this.box[0][1], (this.box[1][0]-this.box[0][0]), (this.box[1][1]-this.box[0][1]))
		
		this.replacing = true
	},
	replace: function() {
		this.replacing = false
		ctx.drawImage(this.cv, this.box[0][0], this.box[0][1])
		
		let x1 = this.box[0][0] / 40
		let y1 = this.box[0][1] / 40
		let x2 = this.box[1][0] / 40
		let y2 = this.box[1][1] / 40
		
		let i = 0
		for(let y = y1; y < y2; y++) {
			for(let x = x1; x < x2; x++) {
				if(x >= 0 && x < 16 && y >= 0 && y < 16) {
					pixels[y*16+x] = this.colors[i]
				}
				i++
			}
		}
	},
	rotate: function(direction) {
		if(direction === undefined) {direction = 0}
		let x1 = this.box[0][0] / 40
		let y1 = this.box[0][1] / 40
		let x2 = this.box[1][0] / 40
		let y2 = this.box[1][1] / 40
		
		let h = y2 - y1
		let w = x2 - x1
		
		this.replacing = true
		this.box[1] = [this.box[0][0] + h*40, this.box[0][1] + w*40]
		this.cv.width = h*40
		this.cv.height = w*40
		
		let r = []
		
		for(let y = 0; y < h; y++) {
			r[y] = []
			for(let x = 0; x < w; x++){
				r[y][x] = this.colors[x+y*w]
			}
		}
		
		this.colors = []
		
		if(direction) {
			for(let x = 0; x < w; x++) {
				for(let y = 0; y < h; y++){
					this.colors.push(r[y][(w-1)-x])//-90 degrees
					this.ctx.fillStyle = r[y][(w-1)-x]
					this.ctx.fillRect(y*40, x*40, 40, 40)
				}
			}
		} else {
			for(let x = 0; x < w; x++) {
				for(let y = 0; y < h; y++){
					this.colors.push(r[(h-1)-y][x])//+90 degrees
					this.ctx.fillStyle = r[(h-1)-y][x]
					this.ctx.fillRect(y*40, x*40, 40, 40)
				}
			}
		}
		
		ctx.fillStyle = background_color.hex
		for(let i = 0; i < this.selected.length; i++) {
			ctx.fillRect((this.selected[i] % 16) * 40, (Math.floor(this.selected[i]/16)) * 40, 40, 40)
			pixels[this.selected[i]] = background_color.hex
		}
		
		select_ctx.clearRect(0, 0, select_cv.width, select_cv.height)
		select_ctx.globalAlpha = 1
		select_ctx.drawImage(this.cv, this.box[0][0], this.box[0][1])
		select_ctx.fillStyle = 'powderblue'
		select_ctx.globalAlpha = .4
		select_ctx.fillRect(this.box[0][0], this.box[0][1], (this.box[1][0]-this.box[0][0]), (this.box[1][1]-this.box[0][1]))
	},
	reflect: function(direction) {
		if(direction === undefined) {direction = 1}
		let x1 = this.box[0][0] / 40
		let y1 = this.box[0][1] / 40
		let x2 = this.box[1][0] / 40
		let y2 = this.box[1][1] / 40
		
		let h = y2 - y1
		let w = x2 - x1
		
		this.replacing = true
		
		let r = []
		
		for(let y = 0; y < h; y++) {
			r[y] = []
			for(let x = 0; x < w; x++){
				r[y][x] = this.colors[x+y*w]
			}
		}
		
		this.colors = []
		
		if(direction) {
			for(let y = 0; y < h; y++) {
				for(let x = 0; x < w; x++){
					this.colors.push(r[y][(w-1)-x])//horizontal
					this.ctx.fillStyle = r[y][(w-1)-x]
					this.ctx.fillRect(x*40, y*40, 40, 40)
				}
			}
		} else {
			for(let y = 0; y < h; y++) {
				for(let x = 0; x < w; x++){
					this.colors.push(r[(h-1)-y][x])//vertical
					this.ctx.fillStyle = r[(h-1)-y][x]
					this.ctx.fillRect(x*40, y*40, 40, 40)
				}
			}
		}
		
		select_ctx.clearRect(0, 0, select_cv.width, select_cv.height)
		select_ctx.globalAlpha = 1
		select_ctx.drawImage(this.cv, this.box[0][0], this.box[0][1])
		select_ctx.fillStyle = 'powderblue'
		select_ctx.globalAlpha = .4
		select_ctx.fillRect(this.box[0][0], this.box[0][1], (this.box[1][0]-this.box[0][0]), (this.box[1][1]-this.box[0][1]))
	},
	copy: function() {
		this.saved.colors = this.colors.slice(0)
		this.saved.box = [[0, 0], [this.box[1][0] - this.box[0][0], this.box[1][1] - this.box[0][1]]]
	},
	cut: function() {
		if(this.selected[0] != -1) {
			this.copy()
			let w = this.box[1][0] - this.box[0][0]
			let h = this.box[1][1] - this.box[0][1]
			
			let i = 0
			for(let y = 0; y < h/40; y++) {
				for(let x = 0; x < w/40; x++) {
					ctx.fillStyle = background_color.hex
					ctx.fillRect((this.selected[i] % 16) * 40, (Math.floor(this.selected[i]/16)) * 40, 40, 40)
					pixels[this.selected[i]] = background_color.hex
					i++
				}
			}
		}
	},
	cancel: function() {
		select_ctx.clearRect(0, 0, 640, 640)
		this.selected = []
		this.box = []
		this.colors = []
	},
	paste: function() {
		if(this.selected[0] != -1 || !(this.box[0][0] === 0 && this.box[0][1] === 0)) {
			if(this.selected.length > 0) {
				this.replace()
			}
			if(active_tool != 2) {
				forceSelectTool(2)
			}
			
			this.selected = [-1]
			this.box[0] = this.saved.box[0].slice(0)
			this.box[1] = this.saved.box[1].slice(0)
			this.colors = this.saved.colors.slice(0)
			
			let w = this.box[1][0]
			let h = this.box[1][1]
			
			this.cv.width = w
			this.cv.height = h
			
			let i = 0
			for(let y = 0; y < h/40; y++) {
				for(let x = 0; x < w/40; x++) {
					this.ctx.fillStyle = this.colors[i]
					this.ctx.fillRect(x*40, y*40, 40, 40)
					i++
				}
			}
			
			select_ctx.clearRect(0, 0, select_cv.width, select_cv.height)
			select_ctx.globalAlpha = 1
			select_ctx.drawImage(this.cv, this.box[0][0], this.box[0][1])
			select_ctx.fillStyle = 'powderblue'
			select_ctx.globalAlpha = .4
			select_ctx.fillRect(this.box[0][0], this.box[0][1], (this.box[1][0]-this.box[0][0]), (this.box[1][1]-this.box[0][1]))
		}
	},
	clear: function() {
		if(this.replacing) {this.replace()}
		select_ctx.clearRect(0, 0, 640, 640)
		this.selected = []
		this.box = []
		this.colors = []
	}
}

const applyTransform = [
	function() {
		if(select_tool.selected.length) {
			select_tool.rotate(0)
		} else {
			rotate(0)
		}
	},
	function() {
		if(select_tool.selected.length) {
			select_tool.rotate(1)
		} else {
			rotate(1)
		}
	},
	function() {
		if(select_tool.selected.length) {
			select_tool.reflect(0)
		} else {
			reflect(0)
		}
	},
	function() {
		if(select_tool.selected.length) {
			select_tool.reflect(1)
		} else {
			reflect(1)
		}
	},
]

function rotate(direction) {
	let r = []
		
	for(let y = 0; y < 16; y++) {
		r[y] = []
		for(let x = 0; x < 16; x++){
			r[y][x] = pixels[x+y*16]
		}
	}
	
	if(direction) {
		for(let x = 0; x < 16; x++) {
			for(let y = 0; y < 16; y++){
				pixels[y+x*16] = r[y][15-x]
				ctx.fillStyle = r[y][15-x]
				ctx.fillRect(y*40, x*40, 40, 40)
			}
		}
	} else {
		for(let x = 0; x < 16; x++) {
			for(let y = 0; y < 16; y++){
				pixels[y+x*16] = r[15-y][x]
				ctx.fillStyle = r[15-y][x]
				ctx.fillRect(y*40, x*40, 40, 40)
			}
		}
	}
}

function reflect(direction) {
	let r = []
		
	for(let y = 0; y < 16; y++) {
		r[y] = []
		for(let x = 0; x < 16; x++){
			r[y][x] = pixels[x+y*16]
		}
	}
	
	if(direction) {
		for(let y = 0; y < 16; y++) {
			for(let x = 0; x < 16; x++){
				pixels[x+y*16] = r[y][(16-1)-x]
				ctx.fillStyle = r[y][(16-1)-x]
				ctx.fillRect(x*40, y*40, 40, 40)
			}
		}
	} else {
		for(let y = 0; y < 16; y++) {
			for(let x = 0; x < 16; x++){
				pixels[x+y*16] = r[(16-1)-y][x]
				ctx.fillStyle = r[(16-1)-y][x]
				ctx.fillRect(x*40, y*40, 40, 40)
			}
		}
	}
}

function floodFill(x, y) {
	let target_color = pixels[y*16+x]
	let connected = [y*16+x]
	let to_check = [y*16+x]
	
	while(to_check.length > 0) {
		let px = to_check.shift()
		if(pixels[px + 1] === target_color && connected.indexOf(px + 1) === -1) {
			connected.push(px + 1)
			to_check.push(px + 1)
		}
		if(pixels[px - 1] === target_color && connected.indexOf(px - 1) === -1) {
			connected.push(px - 1)
			to_check.push(px - 1)
		}
		if(pixels[px + 16] === target_color && connected.indexOf(px + 16) === -1) {
			connected.push(px + 16)
			to_check.push(px + 16)
		}
		if(pixels[px - 16] === target_color && connected.indexOf(px - 16) === -1) {
			connected.push(px - 16)
			to_check.push(px - 16)
		}
	}
	
	ctx.fillStyle = color_values[0].hex
	for(let i = 0; i < connected.length; i++) {
		let ix = connected[i] % 16
		let iy = Math.floor(connected[i] / 16)
		ctx.fillRect(ix * 40, iy * 40, 40, 40)
		pixels[connected[i]] = color_values[0].hex
	}
}