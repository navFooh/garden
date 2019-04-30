define([
	'backbone-webgl',
	'model/webgl-model',
	'webgl/core/camera',
	'webgl/core/renderer',
	'webgl/scene/scene'
], function (WebGL, WebGLModel, Camera, Renderer, Scene) {

	return WebGL.extend({

		initialize: function (options) {

			WebGLModel.set('camera', new Camera());
			WebGLModel.set('scene', new Scene());

			this.renderer = new Renderer({ canvas: options.canvas });
		}
	});
});
