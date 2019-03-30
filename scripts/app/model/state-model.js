define([
	'backbone',
	'three',
	'TweenLite'
], function (Backbone, THREE, TweenLite) {

	var StateModel = Backbone.Model.extend({

		UPDATE: {
			FOG_COLOR: 0
		},

		defaults: {
			width: 800,
			depth: 400,
			fogProps: null,
			fogColor: new THREE.Color(),
			fogNear: 200,
			fogFar: 500,
			pointerPosition: { x: 0, z: 0 },
			pointerDirection: { x: 0, z: 0 },
			pointerMoving: false,
			pointerRange: 50,
			pointerSpeed: 0
		},

		initialize: function () {
			this.pointerInitialized = false;
			this.set({ fogProps: this.getNewFogProps() });
			this.updateFogColor();
		},

		startTransition: function () {
			var fogProps = this.get('fogProps');
			var newFogProps = this.getNewFogProps();
			if (newFogProps.h - fogProps.h > 0.5)
				fogProps.h += 1;
			if (fogProps.h - newFogProps.h > 0.5)
				fogProps.h -= 1;
			TweenLite.killTweensOf(fogProps);
			TweenLite.to(fogProps, 3, {
				h: newFogProps.h,
				s: newFogProps.s,
				l: newFogProps.l,
				ease: Power3.easeOut,
				onUpdate: this.updateFogColor,
				onUpdateScope: this
			});
		},

		getNewFogProps: function () {
			return {
				h: Math.random(),
				s: 0.25 + 0.25 * Math.random(),
				l: 0.5 + 0.5 * Math.random()
			}
		},

		updateFogColor: function () {
			var fogColor = this.get('fogColor');
			var fogProps = this.get('fogProps');
			fogColor.setHSL(fogProps.h, fogProps.s, fogProps.l);
			this.trigger(this.UPDATE.FOG_COLOR, fogColor);
		},

		updatePointer: function (x, z) {
			var pointerPosition = this.get('pointerPosition');
			var pointerDirection = this.get('pointerDirection');

			if (!this.pointerInitialized) {
				this.pointerInitialized = true;
				pointerPosition.x = x;
				pointerPosition.z = z;
				return;
			}

			if (pointerPosition.x == x && pointerPosition.z == z) {
				return;
			}

			pointerDirection.x = x - pointerPosition.x;
			pointerDirection.z = z - pointerPosition.z;
			pointerPosition.x = x;
			pointerPosition.z = z;

			var pointerSpeed = Math.sqrt(pointerDirection.x * pointerDirection.x + pointerDirection.z * pointerDirection.z);

			pointerDirection.x /= pointerSpeed;
			pointerDirection.z /= pointerSpeed;

			this.set({
				pointerMoving: true,
				pointerSpeed: pointerSpeed
			});
		}
	});

	return new StateModel();
});
