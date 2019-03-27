define(['backbone'], function (Backbone) {

	var StateModel = Backbone.Model.extend({

		defaults: {
			width: 800,
			depth: 400
		}
	});

	return new StateModel();
});
