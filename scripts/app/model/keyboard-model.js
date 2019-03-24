define(['backbone'], function (Backbone) {

	var KeyboardModel = Backbone.Model.extend({

		EVENT: {
			TAB: 0,
			ENTER: 1,
			ESCAPE: 2,
			SPACE: 3
		},

		defaults: {
			shift: false,
			ctrl: false,
			alt: false,
			up: false,
			down: false,
			left: false,
			right: false
		},

		initialize: function () {
			document.addEventListener('keydown', this.onKeyDown.bind(this), true);
			document.addEventListener('keyup', this.toggle.bind(this, false), true);
		},

		onKeyDown: function (event) {

			this.toggle(true, event);

			switch(event.which) {
				case 9:
					event.preventDefault();
					this.trigger(this.EVENT.TAB);
					break;
				case 13: this.trigger(this.EVENT.ENTER); break;
				case 27: this.trigger(this.EVENT.ESCAPE); break;
				case 32: this.trigger(this.EVENT.SPACE); break;
			}
		},

		toggle: function (on, event) {

			switch(event.which) {
				case 16: this.set({ shift: on }); break;
				case 17: this.set({ ctrl: on }); break;
				case 18: this.set({ alt: on }); break;
				case 87: // W
				case 38: this.set({ up: on }); break;
				case 83: // S
				case 40: this.set({ down: on }); break;
				case 65: // A
				case 37: this.set({ left: on }); break;
				case 68: // D
				case 39: this.set({ right: on }); break;
			}
		}
	});

	return new KeyboardModel();
});
