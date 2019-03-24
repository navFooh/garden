define([
	'backbone',
	'underscore'
], function (Backbone, _) {

	var Audio = Backbone.Audio = function (options) {
		this.cid = _.uniqueId('audio');
		options || (options = {});
		_.extend(this, _.pick(options, ['context', 'model', 'collection']));
		this.initialize.apply(this, arguments);
	};

	_.extend(Audio.prototype, Backbone.Events, {

		initialize: function () {},

		remove: function () {
			this.stopListening();
			return this;
		}
	});

	Audio.extend = Backbone.Model.extend;

	return Audio;

});
