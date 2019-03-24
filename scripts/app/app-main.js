define([
	'app/app-base',
	'model/asset-model',
	'model/webgl-model',
	'view/canvas',
	'view/info',
	'view/main-menu',
	'view/preloader',
	'webgl/engine'
], function (AppBase, AssetModel, WebGLModel, Canvas, Info, MainMenu, Preloader, Engine) {

	return AppBase.extend({

		createViews: function () {
			this.canvas = new Canvas().render(document.body);
			this.preloader = new Preloader().render(document.body);
			this.mainMenu = new MainMenu().render(document.body);
			this.info = new Info().render(document.body);
		},

		createWebGL: function () {
			new Engine({ canvas: this.canvas.el });
		},

		start: function () {
			AssetModel.get('loading')
				? this.listenToOnce(AssetModel, 'change:loading', this.run)
				: this.run();
		},

		run: function () {
			WebGLModel.start();
			this.preloader.fadeOut(function () {
				this.preloader.remove();
				delete this.preloader;
			}.bind(this));
		}
	});
});
