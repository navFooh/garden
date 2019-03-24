define([
	'backbone-util',
	'underscore',
	'model/display-model'
], function (Util, _, DisplayModel) {

	return Util.extend({

		EVENT: {
			WHEEL: 0
		},

		initialize: function (element) {
			if (!element) throw 'Supply a target element for WheelEvents';
			this.element = element;

			this.lowestDelta = null;
			this.nullLowestDeltaTimeout = null;
			this.events = 'onwheel' in document || document.documentMode >= 9 ?
				['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];

			this.onWheel = this.onWheel.bind(this);
			this.nullLowestDelta = this.nullLowestDelta.bind(this);

			_.each(this.events, function (event) {
				this.element.addEventListener(event, this.onWheel);
			}, this);
		},

		remove: function () {

			_.each(this.events, function (event) {
				this.element.removeEventListener(event, this.onWheel);
			}, this);

			Util.prototype.remove.apply(this);
		},

		onWheel: function (event) {
			var deltaX = 0,
				deltaY = 0;

			// Old school scrollwheel delta
			if ('detail'      in event) deltaY = event.detail * -1;
			if ('wheelDelta'  in event) deltaY = event.wheelDelta;
			if ('wheelDeltaY' in event) deltaY = event.wheelDeltaY;
			if ('wheelDeltaX' in event) deltaX = event.wheelDeltaX * -1;

			// Firefox < 17 horizontal scrolling related to DOMMouseScroll event
			if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
				deltaX = deltaY * -1;
				deltaY = 0;
			}

			// New school wheel delta (wheel event)
			if ('deltaX' in event) deltaX = event.deltaX;
			if ('deltaY' in event) deltaY = event.deltaY * -1;

			// Nothing happened
			if (deltaY === 0 && deltaX === 0) return;

			// Convert lines and pages to pixels
			// - deltaMode 0 is by pixels, nothing to do
			// - deltaMode 1 is by lines
			// - deltaMode 2 is by pages
			if (event.deltaMode === 1) {
				var lineHeight = DisplayModel.get('lineHeight');
				deltaY *= lineHeight;
				deltaX *= lineHeight;
			} else if (event.deltaMode === 2) {
				var pageHeight = DisplayModel.get('height');
				deltaY *= pageHeight;
				deltaX *= pageHeight;
			}

			// Store lowest absolute delta to normalize the delta values
			var absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));
			// If this is an older event and the delta is divisable by 120,
			// then we are assuming that the browser is treating this as an
			// older mouse wheel event and that we should divide the deltas
			// by 40 to try and get a more usable deltaFactor.
			// Side note, this actually impacts the reported scroll distance
			// in older browsers and can cause scrolling to be slower than native.
			var shouldAdjust = event.type === 'mousewheel' && absDelta % 120 === 0;

			if (!this.lowestDelta || absDelta < this.lowestDelta) {
				this.lowestDelta = absDelta;

				// Adjust older deltas if necessary
				if (shouldAdjust) this.lowestDelta /= 40;
			}

			// Adjust older deltas if necessary
			if (shouldAdjust) {
				deltaX /= 40;
				deltaY /= 40;
			}

			// Get a whole, normalized value for the deltas
			deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / this.lowestDelta);
			deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / this.lowestDelta);

			// Clearout lowestDelta after sometime to better handle multiple
			// device types that give different a different lowestDelta
			// Ex: trackpad = 3 and mouse wheel = 120
			if (this.nullLowestDeltaTimeout) clearTimeout(this.nullLowestDeltaTimeout);
			this.nullLowestDeltaTimeout = setTimeout(this.nullLowestDelta, 200);

			// Trigger wheel event
			this.trigger(this.EVENT.WHEEL, _.extend({}, event, {
				deltaX: deltaX,
				deltaY: deltaY,
				deltaFactor: this.lowestDelta
			}));
		},

		nullLowestDelta: function () {
			this.lowestDelta = null;
		}
	});
});
