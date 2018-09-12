// ================================================ 
// Canvas Resize
// ------------------------------------------------ 

// waits 500ms after you finishing resizing the window, then adjusts the
// canvas element's width/height to match the new window size. TODO: make this
// smoother by using RequestAnimationFrame.

let ResizeTimer
function handleResize() {
	clearTimeout(ResizeTimer)
	ResizeTimer = setTimeout(maximizeCanvas, 500)
}
function maximizeCanvas() {
	c.width = window.innerWidth
	c.height = window.innerHeight
	console.log(`New Dimensions (${c.width}, ${c.height})`)
	drawAll()
}
window.addEventListener('resize', handleResize, false)
maximizeCanvas()