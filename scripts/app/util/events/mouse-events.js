define(['backbone-util'], function (Util) {

	return Util.extend({

		EVENT: {
			DOWN: 0,
			MOVE: 1,
			UP: 2
		},

		initialize: function (element) {
			if (!element) throw 'Supply a target element for MouseEvents';
			this.element = element;

			this.buttons = [];

			this.onDown = this.onDown.bind(this);
			this.onMove = this.onMove.bind(this);
			this.onUp = this.onUp.bind(this);

			this.element.addEventListener('mousedown', this.onDown);
			this.element.addEventListener('mousemove', this.onMove);
			this.element.addEventListener('mouseup', this.onUp);
			this.element.addEventListener('mouseleave', this.onUp);
		},

		remove: function () {
			this.element.removeEventListener('mousedown', this.onDown);
			this.element.removeEventListener('mousemove', this.onMove);
			this.element.removeEventListener('mouseup', this.onUp);
			this.element.removeEventListener('mouseleave', this.onUp);
			Util.prototype.remove.apply(this);
		},

		onDown: function (event) {
			!this.buttons[event.button] && this.trigger(this.EVENT.DOWN, event);
			this.buttons[event.button] = true;
		},

		onMove: function (event) {
			this.trigger(this.EVENT.MOVE, event);
		},

		onUp: function (event) {
			this.buttons[event.button] && this.trigger(this.EVENT.UP, event);
			this.buttons[event.button] = false;
		}
	});
});
