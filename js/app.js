var stage, shape, oldX, oldY, size;

function init() {
	stage = new createjs.Stage("main");
	stage.autoClear = false;
	stage.enableDOMEvents(true);
	
	shape = new createjs.Shape();
	stage.addChild(shape);
	
	// set up our defaults:
	color = "#000";
	size = 2;
	
	// add handler for stage mouse events:
	stage.on("click", function(event) {
		size = 10;
	})                
	
	stage.on("stagemouseup", function(event) {
		/*color = createjs.Graphics.getHSL(Math.random()*360, 100, 50);*/
		size = 2;
	})
	 			
    stage.on("stagemousemove", function(evt) {
		if (oldX) {
			var width = this.canvas.width;
			var increment = width/3;
			var graphics = shape.graphics;
			var trials = [0, width];

			for(trialX in trials) {
				var x = 1;
				var currX = 0;
				var iterX = 0;
				var LorR = trialX == 0;
				if(LorR) {
					while(x > trialX) {
						x = oldX - iterX*increment;
						currX = evt.stageX - iterX*increment;

						for(trialY in trials) {
							var y = 1;
							var currY = 0;
							var iterY = 0;
							var UorD = trialY == 0;

							if(UorD) {
								while(y > trialY) {
									y = oldY - iterY*increment;
									currY = evt.stageY - iterY*increment;
									graphics.beginStroke(color)
												  .setStrokeStyle(size, "round")
												  .moveTo(x, y)
												  .lineTo(currX, currY);
									iterY++;
								}
							} else {
								while(y < trialY) {
									y = oldY + iterY*increment;
									currY = evt.stageY + iterY*increment;
									graphics.beginStroke(color)
												  .setStrokeStyle(size, "round")
												  .moveTo(x, y)
												  .lineTo(currX, currY);
									iterY++;
								}
							}
						}
						iterX++;
					}
				} else {
					while(x < trialX) {
						x = oldX + iterX*increment;
						currX = evt.stageX + iterX*increment;

						for(trialY in trials) {
							var y = 1;
							var currY = 0;
							var iterY = 0;
							var UorD = trialY == 0;

							if(UorD) {
								while(y > trialY) {
									y = oldY - iterY*increment;
									currY = evt.stageY - iterY*increment;
									graphics.beginStroke(color)
												  .setStrokeStyle(size, "round")
												  .moveTo(x, y)
												  .lineTo(currX, currY);
									iterY++;
								}
							} else {
								while(y < trialY) {
									y = oldY + iterY*increment;
									currY = evt.stageY + iterY*increment;
									graphics.beginStroke(color)
												  .setStrokeStyle(size, "round")
												  .moveTo(x, y)
												  .lineTo(currX, currY);
						 			iterY++;
								}
							}
						}
						iterX++;
					}
				}
			}


			stage.update();
		}
		oldX = evt.stageX;
		oldY = evt.stageY;
	});
	
	stage.update();
}

function displayExport() {
	var main = $("#main");
	var showcase = $("#showcase");
	var mainCtx = main[0].getContext('2d');
	var showcaseCtx = showcase[0].getContext('2d');
	var increment = main.width()/3;
	showcase.height(increment);
	showcase.width(increment);
	showcase.css("border","1px solid #0084C5");

	var imgData = mainCtx.getImageData(increment,increment,increment,increment);

	showcaseCtx.putImageData(imgData, 0, 0, 0, 0, increment, increment);
}


$("#export").on("click", displayExport);

$("#downloadButton").on("click", function() {
	var canvas = document.getElementById("showcase");
	var form = $('#exportForm');
	var format = form.find('input[name=format]:checked').val();
	var quality = form.find('input[name=quality]:checked').val();
	var dataURL = canvas.toDataURL("image/"+format, quality);
	console.log(dataURL);
	this.href = dataURL;
	this.target = "_blank";
});