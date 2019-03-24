define([
	'app/app-base',
	'view/fallback'
], function (AppBase, Fallback) {

	return AppBase.extend({

		createViews: function () {
			new Fallback().render(document.body);
		}
	});
});
