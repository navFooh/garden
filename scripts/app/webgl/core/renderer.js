define([
	'backbone-webgl',
	'three',
	'model/display-model',
	'model/state-model',
	'model/webgl-model'
], function (WebGL, THREE, DisplayModel, StateModel, WebGLModel) {

	return WebGL.extend({

		initialize: function (options) {

			this.renderer = new THREE.WebGLRenderer({
				canvas: options.canvas,
				alpha: false,
				antialias: false
			});

			this.renderer.autoClear = true;
			this.renderer.sortObjects = false;
			this.renderer.setClearColor(StateModel.get('fogColor'), 1);
			this.renderer.setPixelRatio(window.devicePixelRatio || 1);

			this.onResize();
			this.listenTo(DisplayModel, 'resize', this.onResize);
			this.listenTo(WebGLModel, 'render', this.render);
			this.listenTo(StateModel, StateModel.UPDATE.FOG_COLOR, this.onUpdateFogColor);
		},

		onResize: function () {
			var width = DisplayModel.get('width'),
				height = DisplayModel.get('height');
			this.renderer.setSize(width, height);
		},

		render: function (scene, camera) {
			this.renderer.render(scene, camera);
		},

		onUpdateFogColor: function (fogColor) {
			this.renderer.setClearColor(fogColor, 1);
		}
	});
});
