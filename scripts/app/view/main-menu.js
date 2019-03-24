define([
	'backbone',
	'TweenMax',
	'model/app-model',
	'templates/main-menu'
], function (Backbone, TweenMax, AppModel, template) {

	return Backbone.View.extend({

		events: {
			'click .info': 'onClickInfo'
		},

		initialize: function () {
			this.listenTo(AppModel, 'change:infoOpen', this.onInfoOpen);
		},

		render: function (parent) {
			this.setElement(template());
			parent.appendChild(this.el);
			return this;
		},

		onClickInfo: function () {
			AppModel.set({ infoOpen: true });
		},

		onInfoOpen: function () {
			var open = AppModel.get('infoOpen');
			TweenMax.to(this.el, 0.4, {
				delay: open ? 0 : 0.6,
				autoAlpha: open ? 0 : 1,
				ease: Power4.easeOut
			});
		}
	});
});
