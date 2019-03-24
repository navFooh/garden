define([
	'backbone',
	'underscore',
	'model/display-model',
	'model/pointer-model',
	'util/orbit'
], function (Backbone, _, DisplayModel, PointerModel, Orbit) {

	var OrbitControl = function (object, target, options) {

		_.extend(this, {
			autoStart: true,
			button: 0,
			enableZoom: true,
			zoomSpeed: 1,
			enableRotate: true,
			rotateSpeed: 1,
			minDistance: 0,
			maxDistance: Infinity,
			minPolarAngle: 0,
			maxPolarAngle: Math.PI,
			minAzimuthAngle: -Infinity,
			maxAzimuthAngle: Infinity
		}, options);

		this.enabled = false;
		this.orbit = new Orbit(object, target);
		this.autoStart && this.start();
	};

	_.extend(OrbitControl.prototype, Backbone.Events, {

		start: function () {
			if (this.enabled) return;
			this.enabled = true;

			this.orbit.update();

			this.enableRotate && this.listenTo(PointerModel, PointerModel.EVENT.DOWN, this.onPointerDown);
			this.enableZoom && this.listenTo(PointerModel, PointerModel.EVENT.WHEEL, this.onMouseWheel);
			this.enableZoom && this.listenTo(PointerModel, PointerModel.EVENT.PINCH_START, this.onPinchStart);
		},

		stop: function () {
			if (!this.enabled) return;
			this.enabled = false;
			this.stopListening();
		},

		onPointerDown: function (event) {
			if (event.button != this.button) return;
			this.listenTo(PointerModel, PointerModel.EVENT.MOVE, this.onPointerMove);
			this.listenTo(PointerModel, PointerModel.EVENT.UP, this.onPointerUp);
		},

		onPointerMove: function (event) {
			var theta = this.orbit.spherical.theta - 2 * Math.PI * event.pointerDeltaX / DisplayModel.get('width') * this.rotateSpeed,
				phi = this.orbit.spherical.phi - 2 * Math.PI * event.pointerDeltaY / DisplayModel.get('height') * this.rotateSpeed;
			this.orbit.spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, theta));
			this.orbit.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, phi));
			this.orbit.spherical.makeSafe();
			this.orbit.update();
		},

		onPointerUp: function (event) {
			if (event.button != this.button) return;
			this.stopListening(PointerModel, PointerModel.EVENT.MOVE);
			this.stopListening(PointerModel, PointerModel.EVENT.UP);
		},

		onMouseWheel: function (event) {
			var scale = Math.pow(0.95, this.zoomSpeed * Math.abs(event.deltaY));
			this.setRadius(event.deltaY > 0
				? this.orbit.spherical.radius * scale
				: this.orbit.spherical.radius / scale);
			this.orbit.update();
		},

		onPinchStart: function () {
			this._pinchStartRadius = this.orbit.spherical.radius;
			this.stopListening(PointerModel, PointerModel.EVENT.WHEEL);
			this.listenTo(PointerModel, PointerModel.EVENT.PINCH_MOVE, this.onPinchMove);
			this.listenTo(PointerModel, PointerModel.EVENT.PINCH_END, this.onPinchEnd);
		},

		onPinchMove: function (event) {
			this.setRadius(this._pinchStartRadius / event.scale);
			!this.enableRotate && this.orbit.update();
		},

		onPinchEnd: function () {
			this.stopListening(PointerModel, PointerModel.EVENT.PINCH_MOVE);
			this.stopListening(PointerModel, PointerModel.EVENT.PINCH_END);
			this.listenTo(PointerModel, PointerModel.EVENT.WHEEL, this.onMouseWheel);
		},

		setRadius: function (radius) {
			this.orbit.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius));
		}
	});

	return OrbitControl;
});
