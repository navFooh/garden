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
			radius: 400,
			fogProps: null,
			fogColor: new THREE.Color(),
			fogNear: 200,
			fogFar: 500,
			transitions: [],
			transitionId: 0,
			transitionInRange: 50,
			transitionOutRange: 15,
			availableTextures: _.range(19),
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

			// fog transition
			var fogProps = this.get('fogProps');
			var newFogProps = this.getNewFogProps();
			if (newFogProps.h - fogProps.h > 0.5)
				fogProps.h += 1;
			if (fogProps.h - newFogProps.h > 0.5)
				fogProps.h -= 1;
			TweenLite.to(fogProps, 2, {
				h: newFogProps.h,
				s: newFogProps.s,
				l: newFogProps.l,
				ease: Power3.easeInOut,
				onUpdate: this.updateFogColor,
				onUpdateScope: this
			});

			// texture transition
			var radius = this.get('radius');
			var transitions = this.get('transitions');
			var transitionId = this.get('transitionId');
			var pointerPosition = this.get('pointerPosition');
			var availableTextures = this.get('availableTextures');

			transitionId = ++transitionId % 256;
			this.set('transitionId', transitionId);

			var transition = {
				id: transitionId,
				radius: 0,
				outRange: 0,
				position: {
					x: pointerPosition.x,
					z: pointerPosition.z
				},
				textures: _.sample(availableTextures, 3)
			};
			TweenLite.to(transition, 3, {
				radius: radius * 2,
				ease: Power2.easeIn,
				onComplete: transitions.pop,
				onCompleteScope: transitions
			});
			TweenLite.to(transition, 0.5, {
				outRange: this.get('transitionOutRange'),
				ease: Power2.easeOut
			});
			transitions.unshift(transition);
		},

		getNewFogProps: function () {
			var fogProps = this.get('fogProps');
			return {
				h: fogProps ? (fogProps.h + 0.25 + Math.random() * 0.5) % 1 : Math.random(),
				s: 0.25 + 0.25 * Math.random(),
				l: 0.6 + 0.3 * Math.random()
			}
		},

		updateFogColor: function () {
			var fogColor = this.get('fogColor');
			var fogProps = this.get('fogProps');
			fogColor.setHSL(fogProps.h, fogProps.s, fogProps.l);
			this.trigger(this.UPDATE.FOG_COLOR, fogColor);
		},

		updatePointer: function (x, z, ignoreDelta) {
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
				pointerMoving: !ignoreDelta,
				pointerSpeed: pointerSpeed
			});
		}
	});

	return new StateModel();
});
