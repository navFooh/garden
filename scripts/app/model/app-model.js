define([
	'backbone',
	'util/detector',
	'json!../../../metadata.json'
], function (Backbone, Detector, metadata) {

	var AppModel = Backbone.Model.extend({

		defaults: {
			metadata: metadata,
			dev: document.body.hasAttribute('data-dev'),
			testFeatures: ['webgl'],
			testResults: null,
			testSuccess: null,
			infoOpen: false
		},

		runFeatureTests: function () {
			var results = {};

			_.each(this.get('testFeatures'), function (feature) {
				// prevent attempts to test unknown features
				if (!Detector.hasOwnProperty(feature))
					throw 'cannot test unknown feature: ' + feature;
				results[feature] = Detector[feature];
			});

			this.set({
				testResults: results,
				testSuccess: _.every(results)
			});
		}
	});

	return new AppModel();
});
