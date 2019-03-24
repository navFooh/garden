define([
	'backbone',
	'underscore',
	'TimelineMax'
], function (Backbone, _, TimelineMax) {

	return Backbone.View.extend({

		tagName: 'span',

		dotCount: 3,
		duration: 0.3,
		stagger: 0.15,
		delay: 0.3,

		render: function (parent, message) {
			this.el.innerHTML = message || '';
			parent.appendChild(this.el);

			this.createDots();
			this.createTimeline();

			return this;
		},

		createDots: function () {
			this.dots = [];

			_.times(this.dotCount, function () {
				var dot = document.createElement('span');
				dot.innerHTML = '.';
				this.dots.push(dot);
				this.el.appendChild(dot);
			}, this);
		},

		createTimeline: function () {
			this.timeline = new TimelineMax({
				repeat: -1,
				repeatDelay: this.delay
			});
			// hide all dots initially
			this.timeline.set(this.dots, { autoAlpha: 0 });
			// fade in dots one by one
			this.timeline.staggerTo(this.dots, this.duration, {
				autoAlpha: 1,
				ease: Power1.easeOut
			}, this.stagger);
			// fade out all dots
			this.timeline.to(this.dots, this.duration, {
				autoAlpha: 0,
				delay: this.delay,
				ease: Power1.easeOut
			});
		},

		remove: function () {
			// remove dot elements
			_.invoke(this.dots, 'remove');
			delete this.dots;
			// cleanup timeline
			this.timeline.kill();
			delete this.timeline;
			Backbone.View.prototype.remove.apply(this);
		}
	});
});
