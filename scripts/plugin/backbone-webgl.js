define([
	'backbone',
	'underscore'
], function (Backbone, _) {

	var WebGL = Backbone.WebGL = function (options) {
		this.cid = _.uniqueId('webgl');
		options || (options = {});
		_.extend(this, _.pick(options, ['parent', 'model', 'collection']));
		this.initialize.apply(this, arguments);
	};

	_.extend(WebGL.prototype, Backbone.Events, {

		initialize: function () {},

		remove: function () {
			this.stopListening();
			return this;
		}
	});

	WebGL.extend = Backbone.Model.extend;

	return WebGL;

});
