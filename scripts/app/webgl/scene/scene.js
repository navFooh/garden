define([
	'backbone-webgl',
	'three',
	'webgl/light/ambient',
	'webgl/light/directional',
	'webgl/object/cube'
], function (WebGL, THREE, Ambient, Directional, Cube) {

	return WebGL.extend({

		initialize: function () {

			this.scene = new THREE.Scene();

			new Ambient({ parent: this.scene });
			new Directional({ parent: this.scene });
			new Cube({ parent: this.scene });
		}
	});
});
