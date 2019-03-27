define([
	'backbone',
	'three'
], function (Backbone, THREE) {

	var StateModel = Backbone.Model.extend({

		defaults: {
			width: 800,
			depth: 400,
			fogColor: new THREE.Color(0x000000),
			fogNear: 200,
			fogFar: 500
		}
	});

	return new StateModel();
});
