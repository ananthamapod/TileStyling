var color;

/* Adding dashed line functionality to 2d context prototype */
CanvasRenderingContext2D.prototype.dashedLine = function (x1, y1, x2, y2, dashLen) {
    if (dashLen == undefined) dashLen = 2;
    this.moveTo(x1, y1);

    var dX = x2 - x1;
    var dY = y2 - y1;
    var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
    var dashX = dX / dashes;
    var dashY = dY / dashes;

    var q = 0;
    while (q++ < dashes) {
        x1 += dashX;
        y1 += dashY;
        if(q % 2 == 0) {
        	this.lineTo(x1, y1);
        	this.stroke();
        } else {
        	this.moveTo(x1, y1);
        }
    }
    this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
};


/* Adding HEX value extraction from ImageData object */
ImageData.prototype.hex = function() {
	var data = this.data;
	var hexString = "0123456789ABCDEF";
	var toHex = function(n) {
		n = parseInt(n,10);
		if (isNaN(n)) return "00";
		n = Math.max(0,Math.min(n,255));return hexString.charAt((n-n%16)/16) + hexString.charAt(n%16);
	}

	return '#' + toHex(data[0]) + toHex(data[1]) + toHex(data[2]);
};


var mainCanvSetup = function() {
	//Grab overlay context for drawing gridlines
	var overlaySelector = $('canvas#overlay');
	var overlayCanvas = overlaySelector[0];
	var context = overlayCanvas.getContext("2d");
	var width = overlaySelector.parent().width();

	//Set main canvas size
	mainCanvas = $('canvas#main')[0];
	mainCanvas.width = width;
	mainCanvas.height = width;

	//Set overlay size
	overlayCanvas.width = width;
	overlayCanvas.height = width;
	//Assuming square canvas, as is set
	var spacing = width/3;
	var marks = [];
	for(var j = 0; j < 2; j++) {
		marks[j] = (j+1) * spacing;
	}

	context.strokeStyle = "#bbb";
	for(var j = 0; j < 2; j++) {
		context.dashedLine(0, marks[j], width, marks[j]);
		context.dashedLine(marks[j], 0, marks[j], width);
	}
};

var colorPickerSetup = function() {
	var colorPickerSelector = $('#canvas_picker');
	var pickerCanvas = colorPickerSelector[0];
	pickerCanvas.width = colorPickerSelector.parent().width();
	var width = Math.min(pickerCanvas.width, 300);
	pickerCanvas.height = width;

	var context = pickerCanvas.getContext('2d');
	var img = new Image();
	img.src = 'img/color-wheel.png';
	$(img).load(function() {
		context.drawImage(img,0,0, width, width);
	});

	var slider = $('#color-slider');
	slider.height(width);

	colorPickerSelector.on("click", function(event) {
		var rect = this.getBoundingClientRect();

		var x = event.pageX - rect.left;
		console.log(rect.top);
		console.log(event.pageY);
		var y = event.pageY - rect.top;

		var context = this.getContext('2d');

		var imageData = context.getImageData(x, y, 1, 1);
		var rgbData = imageData.data;
		var r = rgbData[0];
		var g = rgbData[1];
		var b = rgbData[2];

		var rgb = r + ', ' + g + ', ' + b;
		var hex = imageData.hex();
		$('#colorbox').css('background-color', 'rgb('+rgb+')');
		var slider = $('#color-slider').css('background-color', 'rgb('+rgb+')');
		var width = slider.width();
		var height = slider.height();
		var ctx = slider[0].getContext('2d');
		var gradient = ctx.createLinearGradient(0,0,0,height/2);
		gradient.addColorStop(0,"white");
		gradient.addColorStop(1,hex);
		ctx.fillStyle = gradient;
		ctx.fillRect(0,0,width,height/2);

		var rgbInputs = $('#rgb input');
		rgbInputs[0].value = r;
		rgbInputs[1].value = g;
		rgbInputs[2].value = b;

		$('#hex input').val(hex);
		color = hex;
	});

	var colorbox = $('#colorbox');
	colorbox.css('height', colorbox.width());
};

var exportBoxSetup = function() {
	var choices = $(".reveal-modal input[type=radio]");
	var parents = choices.parent();
	parents.on('click', function() {
		$(this).find("input")[0].checked = true;
		$(this).parent().children().removeClass("checked");
		$(this).addClass("checked");
	});
}

var setup = function() {
	var wrapper = $("#wrapper")[0];
	wrapper.height = document.body.height;
	colorPickerSetup();
	mainCanvSetup();
	exportBoxSetup();
}