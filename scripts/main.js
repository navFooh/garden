require.config({

	paths: {
		// require.js
		'require-lib':          '../node_modules/requirejs/require',
		'text':                 '../node_modules/requirejs-plugins/lib/text',
		'json':                 '../node_modules/requirejs-plugins/src/json',
		// vendor
		'jquery':               '../node_modules/jquery/dist/jquery.slim',
		'underscore':           '../node_modules/underscore/underscore',
		'backbone':             '../node_modules/backbone/backbone',
		'handlebars':           '../node_modules/handlebars/dist/handlebars.runtime',
		'TweenLite':            '../node_modules/gsap/src/uncompressed/TweenLite',
		'TweenMax':             '../node_modules/gsap/src/uncompressed/TweenMax',
		'TimelineLite':         '../node_modules/gsap/src/uncompressed/TimelineLite',
		'TimelineMax':          '../node_modules/gsap/src/uncompressed/TimelineMax',
		'three-lib':            '../node_modules/three/build/three',
		'three-gltf-loader':    '../node_modules/three/examples/js/loaders/GLTFLoader',
		'three-projector':      '../node_modules/three/examples/js/renderers/Projector',
		'promise-polyfill':     '../node_modules/promise-polyfill/dist/polyfill',
		// plugins
		'backbone-audio':       'plugin/backbone-audio',
		'backbone-util':        'plugin/backbone-util',
		'backbone-webgl':       'plugin/backbone-webgl',
		// directories
		'model':                'app/model',
		'util':                 'app/util',
		'view':                 'app/view',
		'webgl':                'app/webgl'
	},

	shim: {
		'three-gltf-loader': {
			deps: ['three', 'promise-polyfill'],
			exports: 'THREE.GLTFLoader'
		},
		'three-projector': {
			deps: ['three'],
			exports: 'THREE.Projector'
		}
	}
});

// Force THREE on the global scope so we can shim the three.js examples code
define('three', ['three-lib'], function (THREE) {
	window.THREE = THREE;
	return THREE;
});

require([
	'model/app-model',
	'app/app-fallback',
	'app/app-main'
], function (AppModel, AppFallback, AppMain) {

	AppModel.runFeatureTests();
	AppModel.get('testSuccess')
		? new AppMain()
		: new AppFallback();
});
