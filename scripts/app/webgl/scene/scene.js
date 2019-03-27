define([
	'backbone-webgl',
	'three',
	'webgl/object/floor',
	'webgl/object/flowers'
], function (WebGL, THREE, Floor, Flowers) {

	return WebGL.extend({

		initialize: function () {

			this.scene = new THREE.Scene();

			new Floor({ parent: this.scene });
			new Flowers({ parent: this.scene });
		}
	});
});
