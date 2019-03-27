define([
	'backbone-webgl',
	'three',
	'model/state-model'
], function (WebGL, THREE, StateModel) {

	return WebGL.extend({

		initialize: function () {
			var width = StateModel.get('width');
			var depth = StateModel.get('depth');
			this.geometry = new THREE.PlaneGeometry(width, depth);
			this.material = new THREE.MeshBasicMaterial({ color: 0x004a2c });
			this.mesh = new THREE.Mesh(this.geometry, this.material);
			this.mesh.position.set(0, 0, depth * -0.5);
			this.mesh.rotation.set(Math.PI * 1.5, 0, 0);
			this.parent.add(this.mesh);
		}
	});
});
