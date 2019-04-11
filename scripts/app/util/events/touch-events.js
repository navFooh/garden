define(['backbone-util'], function (Util) {

	return Util.extend({

		EVENT: {
			DOWN: 0,
			MOVE: 1,
			UP: 2
		},

		initialize: function (element) {
			if (!element) throw 'Supply a target element for TouchEvents';
			this.element = element;

			this.onStart = this.onStart.bind(this);
			this.onMove = this.onMove.bind(this);
			this.onEnd = this.onEnd.bind(this);

			this.element.addEventListener('touchstart', this.onStart);
			this.element.addEventListener('touchmove', this.onMove);
			this.element.addEventListener('touchend', this.onEnd);
			this.element.addEventListener('touchcancel', this.onEnd);
		},

		remove: function () {
			this.element.removeEventListener('touchstart', this.onStart);
			this.element.removeEventListener('touchmove', this.onMove);
			this.element.removeEventListener('touchend', this.onEnd);
			this.element.removeEventListener('touchcancel', this.onEnd);
			Util.prototype.remove.apply(this);
		},

		onStart: function (event) {
			this.trigger(this.EVENT.DOWN, event, !this.active);
			this.active = true;
		},

		onMove: function (event) {
			this.trigger(this.EVENT.MOVE, event);
		},

		onEnd: function (event) {
			if (!this.active) return;
			var last = event.touches.length == 0;
			if (last) this.active = false;
			this.trigger(this.EVENT.UP, event, last);
		}
	});
});
