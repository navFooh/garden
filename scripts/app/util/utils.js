define(['underscore'], function (_) {

	return {

		getCssMatrix: function (n) {
			return 'matrix(' + n.join() + ')';
		},

		getCssMatrix3d: function (n) {
			return 'matrix3d(' + n.join() + ')';
		},

		getCssTransformObj: function (transform) {
			return {
				'transform': transform,
				'-ms-transform': transform,
				'-webkit-transform': transform
			}
		},

		getCssTransformString: function (transform) {
			return 'transform:' + transform + ';' +
				'-ms-transform:' + transform + ';' +
				'-webkit-transform:' + transform + ';';
		},

		setStylePrefixed: function (element, property, value) {
			element.style['-webkit-' + property] = value;
			element.style['-ms-' + property] = value;
			element.style[property] = value;
		},

		getRadialAngleDelta: function (a, b) {
			var delta = a - b;
			while (delta > Math.PI) delta -= 2 * Math.PI;
			while (delta < -Math.PI) delta += 2 * Math.PI;
			return delta;
		},

		getEnvMapUrls: function (path, ext) {
			return [
				path + 'px' + ext, path + 'nx' + ext,
				path + 'py' + ext, path + 'ny' + ext,
				path + 'pz' + ext, path + 'nz' + ext
			];
		},

		getUrlList: function (path, names, ext) {
			return _.map(names, function (name) {
				return path + '/' + name + '.' + ext;
			});
		},

		clamp: function (value, min, max) {
			return Math.min(Math.max(value, min), max);
		},

		selectText: function(element) {
			var range;
			if (document.body.createTextRange) {
				range = document.body.createTextRange();
				range.moveToElementText(element);
				range.select();
			} else if (window.getSelection) {
				var selection = window.getSelection();
				range = document.createRange();
				range.selectNodeContents(element);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		}
	};
});
