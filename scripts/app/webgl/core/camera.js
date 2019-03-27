define([
	'backbone-webgl',
	'three',
	'model/display-model',
	'model/state-model',
	'util/orbit-control'
], function (WebGL, THREE, DisplayModel, StateModel, OrbitControl) {

	return WebGL.extend({

		initialize: function () {
			var aspect = DisplayModel.get('aspect');
			var depth = StateModel.get('depth');

			this.camera = new THREE.PerspectiveCamera(35, aspect, 1, 5000);
			this.camera.position.set(0, 200, 200);

			this.target = new THREE.Vector3(0, 0, depth * -0.5);
			this.control = new OrbitControl(this.camera, this.target, {
				minDistance: 200,
				maxDistance: 500,
				minPolarAngle: 0.2 * Math.PI,
				maxPolarAngle: 0.4 * Math.PI,
				minAzimuthAngle: -0.15 * Math.PI,
				maxAzimuthAngle: 0.15 * Math.PI
			});

			this.listenTo(DisplayModel, 'resize', this.onResize);
		},

		onResize: function () {
			this.camera.aspect = DisplayModel.get('aspect');
			this.camera.updateProjectionMatrix();
		}
	});
});
