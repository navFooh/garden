define([
	'backbone',
	'model/app-model',
	'templates/fallback'
], function (Backbone, AppModel, template) {

	return Backbone.View.extend({

		initialize: function () {
			window.addEventListener('message', this.onMessage.bind(this));
		},

		render: function (parent) {
			this.setElement(template(AppModel.toJSON()));
			parent.appendChild(this.el);
			return this;
		},

		onMessage: function (event) {
			if (event.data == 'get-content') {
				event.source.postMessage({
					type: 'fallback',
					data: AppModel.toJSON()
				}, '*');
			}
		}
	});
});
