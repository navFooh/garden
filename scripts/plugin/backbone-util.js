define([
	'backbone',
	'underscore'
], function (Backbone, _) {

	var Util = Backbone.Util = function () {
		this.cid = _.uniqueId('util');
		this.initialize.apply(this, arguments);
	};

	_.extend(Util.prototype, Backbone.Events, {

		initialize: function () {},

		remove: function () {
			this.stopListening();
			return this;
		}
	});

	Util.extend = Backbone.Model.extend;

	return Util;

});
