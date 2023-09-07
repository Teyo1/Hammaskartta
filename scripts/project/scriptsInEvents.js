var t=0;

// Flood fill
function fill(runtime)
{
	var c = runtime.objects.DrawingCanvas.getFirstInstance();
	
	var col = {r: runtime.globalVars.r, g: runtime.globalVars.g, b: runtime.globalVars.b, a: 0xff}

	// tolerance value
	t = runtime.globalVars.tolerance;

	c.getImagePixelData().then(d=> {
		floodFill(d, col, runtime.globalVars.x, runtime.globalVars.y);

		// load changed image back into the canvas
		c.loadImagePixelData(d);
		console.log(d.data[0]);
	})
}


function getColorAtPixel(imageData, x, y) {
  const {width, data} = imageData

  return {
    r: data[4 * (width * y + x) + 0],
    g: data[4 * (width * y + x) + 1],
    b: data[4 * (width * y + x) + 2],
    a: data[4 * (width * y + x) + 3]
  }
}

function setColorAtPixel(imageData, color, x, y) {
  const {width, data} = imageData

  data[4 * (width * y + x) + 0] = color.r & 0xff
  data[4 * (width * y + x) + 1] = color.g & 0xff
  data[4 * (width * y + x) + 2] = color.b & 0xff
  data[4 * (width * y + x) + 3] = color.a & 0xff
}

function colorMatch(a, b) {
  return (a.r>=b.r-t && a.r<=b.r+t) && (a.g>=b.g-t && a.g<=b.g+t) && (a.b>=b.b-t && a.b<=b.b+t) && (a.a>=b.a-t && a.a<=b.a+t);
}

function floodFill(imageData, newColor, x, y) {
  const {width, height, data} = imageData
  const stack = []
  const baseColor = getColorAtPixel(imageData, x, y)
  let operator = {x, y}

  // Check if base color and new color are the same
  if (colorMatch(baseColor, newColor)) {
    return
  }

  // Add the clicked location to stack
  stack.push({x: operator.x, y: operator.y})

  while (stack.length) {
    operator = stack.pop()
    let contiguousDown = true // Vertical is assumed to be true
    let contiguousUp = true // Vertical is assumed to be true
    let contiguousLeft = false
    let contiguousRight = false

    // Move to top most contiguousDown pixel
    while (contiguousUp && operator.y >= 0) {
      operator.y--
      contiguousUp = colorMatch(getColorAtPixel(imageData, operator.x, operator.y), baseColor)
    }

    // Move downward
    while (contiguousDown && operator.y < height) {
      setColorAtPixel(imageData, newColor, operator.x, operator.y)

      // Check left
      if (operator.x - 1 >= 0 && colorMatch(getColorAtPixel(imageData, operator.x - 1, operator.y), baseColor)) {
        if (!contiguousLeft) {
          contiguousLeft = true
          stack.push({x: operator.x - 1, y: operator.y})
        }
      } else {
        contiguousLeft = false
      }

      // Check right
      if (operator.x + 1 < width && colorMatch(getColorAtPixel(imageData, operator.x + 1, operator.y), baseColor)) {
        if (!contiguousRight) {
          stack.push({x: operator.x + 1, y: operator.y})
          contiguousRight = true
        }
      } else {
        contiguousRight = false
      }

      operator.y++
      contiguousDown = colorMatch(getColorAtPixel(imageData, operator.x, operator.y), baseColor)
    }
  }
}


const scriptsInEvents = {

	async EventSheet1_Event2_Act5(runtime, localVars)
	{
		fill(runtime);
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

