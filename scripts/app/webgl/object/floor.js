define([
	'backbone-webgl',
	'three',
	'model/display-model',
	'model/pointer-model',
	'model/state-model',
	'model/webgl-model'
], function (WebGL, THREE, DisplayModel, PointerModel, StateModel, WebGLModel) {

	return WebGL.extend({

		initialize: function () {
			var width = StateModel.get('width');
			var depth = StateModel.get('depth');

			this.geometry = new THREE.PlaneGeometry(width, depth);
			this.material = new THREE.MeshBasicMaterial({ visible: false });
			this.mesh = new THREE.Mesh(this.geometry, this.material);
			this.mesh.position.set(0, 0, depth * -0.5);
			this.mesh.rotation.set(Math.PI * 1.5, 0, 0);
			this.mesh.matrixAutoUpdate = false;
			this.mesh.updateMatrix();
			this.parent.add(this.mesh);

			this.pointer = new THREE.Vector2();
			this.raycaster = new THREE.Raycaster();
			this.intersects = [];

			this.listenTo(PointerModel, PointerModel.EVENT.CLICK, this.onPointerClick);
			this.listenTo(WebGLModel, 'update', this.update);
		},

		onPointerClick: function () {
			if (this.intersects.length) {
				StateModel.startTransition();
			}
		},

		update: function () {
			this.pointer.x = (PointerModel.get('pointerX') / DisplayModel.get('width')) * 2 - 1;
			this.pointer.y = -(PointerModel.get('pointerY') / DisplayModel.get('height')) * 2 + 1;
			this.raycaster.setFromCamera(this.pointer, WebGLModel.get('camera').camera);
			this.intersects = this.raycaster.intersectObject(this.mesh);
			if (this.intersects.length) {
				var x = this.intersects[0].point.x;
				var z = this.intersects[0].point.z;
				StateModel.updatePointer(x, z);
			}
		}
	});
});
