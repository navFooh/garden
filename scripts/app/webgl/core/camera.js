define([
	'backbone-webgl',
	'three',
	'model/display-model',
	'util/orbit-control'
], function (WebGL, THREE, DisplayModel, OrbitControl) {

	return WebGL.extend({

		initialize: function () {
			var aspect = DisplayModel.get('aspect');

			this.camera = new THREE.PerspectiveCamera(35, aspect, 1, 5000);
			this.camera.position.set(0, 0, 500);
			this.camera.lookAt(new THREE.Vector3(0, 0, 0));

			this.control = new OrbitControl(this.camera);

			this.listenTo(DisplayModel, 'resize', this.onResize);
		},

		onResize: function () {
			this.camera.aspect = DisplayModel.get('aspect');
			this.camera.updateProjectionMatrix();
		}
	});
});
