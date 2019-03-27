define([
	'backbone-webgl',
	'three',
	'webgl/light/ambient',
	'webgl/light/directional',
	'webgl/object/floor'
], function (WebGL, THREE, Ambient, Directional, Floor) {

	return WebGL.extend({

		initialize: function () {

			this.scene = new THREE.Scene();

			new Ambient({ parent: this.scene });
			new Directional({ parent: this.scene });
			new Floor({ parent: this.scene });
		}
	});
});
