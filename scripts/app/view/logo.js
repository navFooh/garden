define([
	'backbone',
	'underscore',
	'TimelineMax',
	'TweenMax',
	'model/app-model',
	'templates/logo-letter'
], function (Backbone, _, TimelineMax, TweenMax, AppModel, template) {

	return Backbone.View.extend({

		tagName: 'a',
		className: 'logo',
		events: {
			'click': 'onClick',
			'mouseenter': 'onMouseEnter',
			'mouseleave': 'onMouseLeave'
		},

		render: function (parent) {
			this.el.href = AppModel.get('metadata').home;
			parent.appendChild(this.el);

			this.createLogo();
			this.createTimeline();

			return this;
		},

		createLogo: function () {
			_.times(3, function () {
				this.el.insertAdjacentHTML('beforeend', template().trim());
			}, this);

			this.letter = this.el.getElementsByClassName('logo-letter');
			this.maskOut = this.el.getElementsByClassName('mask-out');
			this.maskOut1 = _.filter(this.maskOut, function (mask, i) { return i % 3 == 0; });
			this.maskOut2 = _.filter(this.maskOut, function (mask, i) { return (i - 1) % 3 == 0; });
			this.maskOut3 = _.filter(this.maskOut, function (mask, i) { return (i - 2) % 3 == 0; });
			this.maskIn = this.el.getElementsByClassName('mask-in');
			this.drop1 = this.el.getElementsByClassName('drop1');
			this.drop3 = this.el.getElementsByClassName('drop3');

			TweenMax.set(this.maskIn, { y: -7 });
		},

		createTimeline: function () {
			this.timeline = new TimelineMax({
				paused: true,
				onComplete: this.onComplete,
				onCompleteScope: this
			});

			// SHOW TIMELINE
			this.timeline.add('showing');
			this.timeline.set(this.maskOut, { x: 0 }, 0.5);
			this.timeline.to(this.maskIn, 0.3, { y: 0, ease: Power3.easeOut });
			this.timeline.to(this.maskIn, 0.15, { y: 6, ease: Power3.easeIn });
			this.timeline.set(this.el, { skewX: '15deg' });
			this.timeline.set(this.maskIn, { y: 7 });
			this.timeline.set(this.maskOut1, { x: 3 });
			this.timeline.set(this.maskOut2, { x: 1 });
			this.timeline.set(this.maskOut3, { x: -1 });
			this.timeline.to(this.maskIn, 1.2, { y: -7, ease: Power3.easeOut });
			this.timeline.set(this.maskOut, { x: 0 });
			this.timeline.set(this.el, { skewX: '-10deg' });
			this.timeline.to(this.maskIn, 0.4, { y: 0, ease: Power1.easeIn });
			this.timeline.set(this.maskOut, { overflow: 'visible' });
			this.timeline.add([
				TweenMax.to(this.drop1, 0.4, { y: 1, ease: Power3.easeOut }),
				TweenMax.to(this.drop3, 0.4, { y: 3, ease: Power3.easeOut })
			]);
			this.timeline.set(this.letter, { overflow: 'hidden' });
			this.timeline.call(this.onShown, [], this);
			this.timeline.add('shown');

			// HOVER TIMELINE
			var stagger = [this.maskOut1, this.maskOut2, this.maskOut3];
			this.timeline.staggerTo(stagger, 0.3, { x: 26, ease: Power4.easeIn }, 0.1);
			this.timeline.staggerFromTo(stagger, 0.6, { x: -26 }, { x: 0, ease: Power4.easeOut }, 0.1, '-=0.2');
		},

		hide: function () {
			this.timeline.pause();
			this.timeline.time(0);
		},

		show: function () {
			if (this.timeline.time() == 0) {
				this.timeline.play(0);
			}
		},

		onShown: function () {
			if (!this.hovering) {
				this.timeline.pause();
			}
		},

		onComplete: function () {
			if (this.hovering) {
				this.timeline.play('shown');
			}
		},

		onClick: function (event) {
			event.preventDefault();
			this.trigger('click', this.el.href);
		},

		onMouseEnter: function () {
			this.hovering = true;
			var label = this.timeline.currentLabel(),
				active = this.timeline.isActive();
			if (label == 'shown' && !active) {
				this.timeline.play('shown');
			}
		},

		onMouseLeave: function () {
			this.hovering = false;
		}
	});
});
