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
		'dat.gui':				'../node_modules/dat.gui/build/dat.gui',
		'three-lib':            '../node_modules/three/build/three',
		'three-gltf-loader':    '../node_modules/three/examples/js/loaders/GLTFLoader',
		'three-bokeh-shader':   '../node_modules/three/examples/js/shaders/BokehShader',
		'three-copy-shader':    '../node_modules/three/examples/js/shaders/CopyShader',
		'three-bokeh-pass':		'../node_modules/three/examples/js/postprocessing/BokehPass',
		'three-mask-pass':		'../node_modules/three/examples/js/postprocessing/MaskPass',
		'three-render-pass':	'../node_modules/three/examples/js/postprocessing/RenderPass',
		'three-shader-pass':	'../node_modules/three/examples/js/postprocessing/ShaderPass',
		'three-effect-composer':'../node_modules/three/examples/js/postprocessing/EffectComposer',
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
		'three-bokeh-shader': {
			deps: ['three'],
			exports: 'THREE.BokehShader'
		},
		'three-copy-shader': {
			deps: ['three'],
			exports: 'THREE.CopyShader'
		},
		'three-bokeh-pass': {
			deps: ['three', 'three-effect-composer', 'three-bokeh-shader'],
			exports: 'THREE.BokehPass'
		},
		'three-mask-pass': {
			deps: ['three', 'three-effect-composer'],
			exports: 'THREE.MaskPass'
		},
		'three-render-pass': {
			deps: ['three', 'three-effect-composer'],
			exports: 'THREE.RenderPass'
		},
		'three-shader-pass': {
			deps: ['three', 'three-effect-composer'],
			exports: 'THREE.ShaderPass'
		},
		'three-effect-composer': {
			deps: ['three', 'three-copy-shader'],
			exports: 'THREE.EffectComposer'
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
