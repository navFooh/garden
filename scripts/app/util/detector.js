define({

	canvas: !!window.CanvasRenderingContext2D,
	webgl: (function () { try { var canvas = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))); } catch(e) { return false; } })(),
	workers: !!window.Worker,
	fileapi: !!(window.File && window.FileReader && window.FileList && window.Blob),
	audioapi: !!(window.AudioContext || window.webkitAudioContext),
	fullscreen: 'fullscreenEnabled' in document || 'webkitFullscreenEnabled' in document || 'mozFullScreenEnabled' in document || 'msFullscreenEnabled' in document,
	pointerlock: 'pointerLockElement' in document || 'webkitPointerLockElement' in document || 'mozPointerLockElement' in document || 'msPointerLockElement' in document

});
