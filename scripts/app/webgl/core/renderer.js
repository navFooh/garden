define([
	'backbone-webgl',
	'three',
	'model/display-model',
	'model/state-model',
	'model/webgl-model',
	'three-bokeh-pass',
	'three-render-pass',
	'three-shader-pass',
	'three-effect-composer'
], function (WebGL, THREE, DisplayModel, StateModel, WebGLModel) {

	return WebGL.extend({

		initialize: function (options) {

			var width = DisplayModel.get('width');
			var height = DisplayModel.get('height');
			var scene = WebGLModel.get('scene').scene;
			var camera = WebGLModel.get('camera').camera;

			this.renderer = new THREE.WebGLRenderer({
				canvas: options.canvas,
				alpha: false,
				antialias: false
			});

			this.renderer.autoClear = false;
			this.renderer.sortObjects = false;
			this.renderer.setClearColor(StateModel.get('fogColor'), 1);
			this.renderer.setPixelRatio(window.devicePixelRatio || 1);
			this.renderer.setSize(width, height);

			this.composer = new THREE.EffectComposer(this.renderer);
			this.composer.addPass(new THREE.RenderPass(scene, camera));
			this.composer.addPass(new THREE.BokehPass(scene, camera, {
				focus:		4750,
				aperture:	0.00001,
				maxblur:	1,
				width:		width,
				height:		height
			}));

			this.listenTo(DisplayModel, 'resize', this.onResize);
			this.listenTo(WebGLModel, 'update', this.update);
			this.listenTo(WebGLModel, 'render', this.render);
			this.listenTo(StateModel, StateModel.UPDATE.FOG_COLOR, this.onUpdateFogColor);
		},

		onResize: function () {
			var width = DisplayModel.get('width'),
				height = DisplayModel.get('height');
			this.renderer.setSize(width, height);
			this.composer.setSize(width, height);
		},

		update: function (delta) {
			this.delta = delta;
		},

		render: function () {
			this.composer.render(this.delta);
		},

		onUpdateFogColor: function (fogColor) {
			this.renderer.setClearColor(fogColor, 1);
		}
	});
});
