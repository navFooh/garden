define([
	'backbone-webgl',
	'three'
], function (WebGL, THREE) {

	return WebGL.extend({

		initialize: function () {
			this.light = new THREE.AmbientLight(0x404040);
			this.parent.add(this.light);
		}
	});
});
