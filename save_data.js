const save_data = {
	current: 0,
	projects: [],
	createProject: function() {
		let p = new project()
		this.projects.push(p)
		this.current = this.projects.length - 1
		p.load()
	},
	deleteProject: function() {
		if(this.projects.length > 1) {
			this.projects.splice(this.current, 1)[0].list_el.remove()
			if(this.current >= this.projects.length) {
				this.current = this.projects.length -1
			}
			this.projects[this.current].load()
		} else {
			alert('Cannot Delete Only Existing Project')
		}
	},
	load: function() {
		let p = JSON.parse(localStorage.getItem('projects'))
		for(let i = 0; i < p.length; i++) {
			this.projects.push (new project(p[i]))
		}
		this.projects[0].load()
	},
}

class project {
	constructor(base) {
		if(base) {
			this.name = base.name
			this.pixels = base.pixels
			this.filter = base.filter
		} else {
			this.name = 'Untitled Project ' + (1 + save_data.projects.length)
			this.pixels = []
			for(let i = 0; i < 256; i++) {
				this.pixels[i] = background_color.hex
			}
			this.filter = {
				gridlines: true,
				invert: 0,
				brightness: 100,
				saturation: 100,
				contrast: 100,
				shift_hue: 0,
				sepia: 0,
				grayscale: 0,
			}
		}
		this.list_el = document.createElement('option')
		this.list_el.innerText = this.name
		save_load_el.dropdown_list.append(this.list_el)
	}
	load() {
		pixels = this.pixels
		//draw the image to the canvas
		let i = 0
		for(let y = 0; y < 16; y++) {
			for(let x = 0; x < 16; x++) {
				ctx.fillStyle = this.pixels[i]
				ctx.fillRect(x * 40, y * 40, 40, 40)
				i++
			}
		}
		//set the filters
		options_els.gridlines.box.checked = this.filter.gridlines
		const v = ['hidden', 'visible']
		grid_cv.style.visibility = v[+this.filter.gridlines]
		
		options_els.invert.state = this.filter.invert
		options_els.invert.box.checked = this.filter.invert > 0
		
		for(let i = 0; i < 6; i++) {
			let f = options_els.list[i]
			options_els[f].state = this.filter[f]
			options_els[f].slider.value = this.filter[f]
			setFieldValue(i)
		}
		
		cv.style.filter = getFilter()
		select_tool.clear()
		if(save_load_el.dropdown_list.value != this.name) {save_load_el.dropdown_list.value = this.name}
	}
	updateFilter() {
		let f = this.filter
		f.gridlines = options_els.gridlines.box.checked
		f.invert = options_els.invert.state
		f.brightness = options_els.brightness.state
		f.saturation = options_els.saturation.state
		f.contrast = options_els.contrast.state
		f.shift_hue = options_els.shift_hue.state
		f.sepia = options_els.sepia.state
		f.grayscale = options_els.grayscale.state
	}
	rename(string) {
		this.name = string
		this.list_el.innerText = string
	}
}

function dlTile() {
	if(confirm('Confirm Download')) {
		let save_cv = document.createElement('canvas')
		save_cv.width = 16
		save_cv.height = 16
		let save_ctx = save_cv.getContext("2d")
		save_ctx.filter = getFilter()
		
		for(let i = 0; i < pixels.length; i++) {
			save_ctx.fillStyle = pixels[i]
			save_ctx.fillRect(i%16, Math.floor(i/16), 1, 1)
		}
		
		let b = document.createElement('a')
		b.href = save_cv.toDataURL()
		b.download = save_data.projects[save_data.current].name
		document.body.appendChild(b)
		b.click()
		document.body.removeChild(b)
	}
}