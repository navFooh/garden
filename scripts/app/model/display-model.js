define([
	'backbone',
	'underscore'
], function (Backbone, _) {

	var DisplayModel = Backbone.Model.extend({

		defaults: {
			width: null,
			height: null,
			aspect: null,
			diagonal: null,
			fontSize: null,
			lineHeight: null
		},

		initialize: function () {
			this.onResize();
			this.setStyles();

			window.addEventListener('resize', this.onResize.bind(this));

			var debounce = 250;
			this.on('resize', _.debounce(_.partial(this.trigger, 'resize:start'), debounce, true));
			this.on('resize', _.debounce(_.partial(this.trigger, 'resize:end'), debounce));
		},

		onResize: function () {
			var width = window.innerWidth,
				height = window.innerHeight;
			this.set({
				width: width,
				height: height,
				aspect: width / height,
				diagonal: Math.sqrt(width * width + height * height)
			}).trigger('resize');
		},

		setStyles: function () {
			var style = window.getComputedStyle(document.body, null),
				fontSize = style.getPropertyValue('font-size'),
				lineHeight = style.getPropertyValue('line-height');
			this.set({
				fontSize: parseFloat(fontSize) || 16,
				lineHeight: parseFloat(lineHeight) || 24
			});
		}
	});

	return new DisplayModel();
});
