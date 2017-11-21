import $ from 'jquery'
var stage, shape, oldX, oldY, size

var draw = function(evt) {
	if (oldX) {
		var width = this.canvas.width
		var increment = width/3
		var graphics = shape.graphics
		var trials = [0, width]

		//Verrrry sloppy right now, I know. Idea was just to get a working version initially before cleaning up logic and code
		//tries first left edge and then right edge.
		for(var trialX in trials) {
			var x = 1
			var currX = 0
			var iterX = 0
			var LorR = (trialX == 0)

			//if left edge
			if(LorR) {
				//For each square from current position to left edge
				while(x >= trialX) {
					x = oldX - iterX*increment
					currX = evt.stageX - iterX*increment

					for(var trialY in trials) {
						var y = 1
						var currY = 0
						var iterY = 0
						var UorD = (trialY == 0)

						if(UorD) {
							while(y >= trialY) {
								y = oldY - iterY*increment
								currY = evt.stageY - iterY*increment
								graphics.beginStroke(window.color)
									.setStrokeStyle(size, "round")
									.moveTo(x, y)
									.lineTo(currX, currY)
								iterY++
								stage.update()
							}
						} else {
							while(y <= trialY) {
								y = oldY + iterY*increment
								currY = evt.stageY + iterY*increment
								graphics.beginStroke(window.color)
									.setStrokeStyle(size, "round")
									.moveTo(x, y)
									.lineTo(currX, currY)
								iterY++
								stage.update()
							}
						}
					}
					iterX++
				}
			} else {
				while(x <= trialX) {
					x = oldX + iterX*increment
					currX = evt.stageX + iterX*increment

					for(trialY in trials) {
						y = 1
						currY = 0
						iterY = 0
						UorD = trialY == 0

						if(UorD) {
							while(y >= trialY) {
								y = oldY - iterY*increment
								currY = evt.stageY - iterY*increment
								graphics.beginStroke(window.color)
									.setStrokeStyle(size, "round")
									.moveTo(x, y)
									.lineTo(currX, currY)
								iterY++
								stage.update()
							}
						} else {
							while(y <= trialY) {
								y = oldY + iterY*increment
								currY = evt.stageY + iterY*increment
								graphics.beginStroke(window.color)
									.setStrokeStyle(size, "round")
									.moveTo(x, y)
									.lineTo(currX, currY)
								iterY++
								stage.update()
							}
						}
					}
					iterX++
				}
			}
		}


		stage.update()
	}
	oldX = evt.stageX
	oldY = evt.stageY
}

function toggleDraw() {
    if(stage.hasEventListener("stagemousemove")) {
			stage.removeEventListener('stagemousemove', draw)
		return
    } else {
			stage.on("stagemousemove", draw)
    }
	/*window.color = easeljs.Graphics.getHSL(Math.random()*360, 100, 50)*/
}

function init() {
	stage = new window.easeljs.Stage("main")
	stage.autoClear = false
	stage.enableDOMEvents(true)

	shape = new window.easeljs.Shape()
	stage.addChild(shape)

	// set up our defaults:
	window.color = "#000"
	size = 2

	// add handler for stage mouse events:
	stage.on("stagemousedown", function() {
		toggleDraw()
		console.log(stage)
	})
}

function displayExport() {
	var main = $("#main")
	var showcase = $("#showcase")
	var mainCtx = main[0].getContext('2d')
	var showcaseCtx = showcase[0].getContext('2d')
	var increment = main.width()/3
	showcase.height(increment)
	showcase.width(increment)
	showcase.css("border","1px solid #0084C5")

	var imgData = mainCtx.getImageData(increment,increment,increment,increment)

	showcaseCtx.putImageData(imgData, 0, 0, 0, 0, increment, increment)
}


$("#export").on("click", displayExport)

$("#downloadButton").on("click", function() {
	var canvas = document.getElementById("showcase")
	var form = $('#exportForm')
	var format = form.find('input[name=format]:checked').val()
	var quality = form.find('input[name=quality]:checked').val()
	var dataURL = canvas.toDataURL("image/"+format, quality)
	console.log(dataURL)
	this.href = dataURL
	this.target = "_blank"
})

export default init
