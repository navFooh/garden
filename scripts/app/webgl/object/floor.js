define([
	'backbone-webgl',
	'three'
], function (WebGL, THREE) {

	return WebGL.extend({

		initialize: function (options) {
			this.geometry = new THREE.CircleGeometry(options.radius, 24);
			this.material = new THREE.MeshBasicMaterial({ color: 0x004a2c });
			this.mesh = new THREE.Mesh(this.geometry, this.material);
			this.mesh.rotation.set(Math.PI * 1.5, 0, 0);
			this.parent.add(this.mesh);
		}
	});
});
