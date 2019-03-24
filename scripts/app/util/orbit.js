define([
	'three',
	'underscore'
], function (THREE, _) {

	var Orbit = function (object, target) {
		this.object = object;
		this.target = target instanceof THREE.Object3D ? target.position
			: target instanceof THREE.Vector3 ? target : new THREE.Vector3();
		this.spherical = new THREE.Spherical();
		this.setSpherical();
	};

	_.extend(Orbit.prototype, {

		setAxis: function () {
			var up = new THREE.Vector3(0, 1, 0);

			return function (axis) {
				if (axis instanceof THREE.Vector3 && !axis.equals(up)) {
					axis = axis.clone().normalize();
					this.quat = new THREE.Quaternion().setFromUnitVectors(axis, up);
					this.quatInverse = this.quat.clone().inverse();
					this.rotated = true;
				} else {
					this.rotated = false;
				}
			}
		}(),

		setSpherical: function () {
			var offset = new THREE.Vector3();

			return function () {
				offset.copy(this.object.position).sub(this.target);
				this.spherical.setFromVector3(offset);
			};
		}(),

		update: function () {
			var offset = new THREE.Vector3();

			return function () {
				offset.setFromSpherical(this.spherical);
				this.rotated && offset.applyQuaternion(this.quatInverse);
				this.object.position.copy(this.target).add(offset);
				this.object.lookAt(this.target);
			};
		}()
	});

	return Orbit;
});
