define([
	'backbone-webgl',
	'three'
], function (WebGL, THREE) {

	return WebGL.extend({

		initialize: function () {
			this.light = new THREE.DirectionalLight(0xffffff, 0.8);
			this.light.position.set(-0.5, 0.75, 0.25);
			this.parent.add(this.light);
		}
	});
});
