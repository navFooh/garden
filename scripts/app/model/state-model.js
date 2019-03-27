define([
	'backbone',
	'three',
	'TweenLite'
], function (Backbone, THREE, TweenLite) {

	var StateModel = Backbone.Model.extend({

		defaults: {
			width: 800,
			depth: 400,
			fogProps: null,
			fogColor: new THREE.Color(),
			fogNear: 200,
			fogFar: 500
		},

		initialize: function () {
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
		}
	});

	return new StateModel();
});
