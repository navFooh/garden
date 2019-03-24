define([
	'backbone',
	'TweenMax',
	'model/app-model',
	'view/dots',
	'templates/preloader'
], function (Backbone, TweenMax, AppModel, Dots, template) {

	return Backbone.View.extend({

		render: function (parent) {
			this.setElement(template(AppModel.toJSON()));
			parent.appendChild(this.el);

			var message = this.el.getElementsByClassName('message')[0];
			this.dots = new Dots().render(message);

			return this;
		},

		remove: function () {
			this.dots.remove();
			delete this.dots;
			Backbone.View.prototype.remove.apply(this);
		},

		fadeOut: function (callback) {
			TweenMax.to(this.el, 1.2, {
				autoAlpha: 0,
				ease: Power2.easeInOut,
				onComplete: callback
			});
		}
	});
});
