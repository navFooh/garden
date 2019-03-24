define([
	'backbone',
	'underscore',
	'model/display-model',
	'util/events/pointer-events',
	'util/events/mouse-events',
	'util/events/touch-events',
	'util/events/wheel-events'
], function (Backbone, _, DisplayModel, PointerEvents, MouseEvents, TouchEvents, WheelEvents) {

	var PointerModel = Backbone.Model.extend({

		/* About pointers, events and buttons:

		DOWN and UP is triggered for each button of the active pointer type.
		Check event.button in the callback to prevent unexpected behaviour.

		When there are multiple pointers, DOWN fires for the first press of a button
		on any of the pointers and UP fires for the last release of that button.

		This is a contrary to how MOVE and the pointer position works, which is
		independent buttons being pressed or not. When there are multiple pointers,
		the pointer position and delta are always averaged between all active pointers.

		This becomes inconvenient when multiple pointers can also support hover or various
		buttons. E.g. pinch can then be triggered by a hovering and a touching pointer.

		*/

		EVENT: {
			DOWN: 0,
			MOVE: 1,
			UP: 2,
			PINCH_START: 3,
			PINCH_MOVE: 4,
			PINCH_END: 5,
			WHEEL: 6,
			CLICK: 7,
			DOUBLE_CLICK: 8
		},

		defaults: {
			element: null,
			pointerX: 0,
			pointerY: 0,
			normalX: 0,
			normalY: 0
		},

		initialize: function () {
			this.mouseEventsTimeoutId = null;
			this.mouseEventsTimeoutFn = this.listenToMouseEvents.bind(this);
			this.onClick = this.trigger.bind(this, this.EVENT.CLICK);
			this.onDoubleClick = this.trigger.bind(this, this.EVENT.DOUBLE_CLICK);
			this.on('change:element', this.onChangeElement);
		},

		onChangeElement: function () {

			if (this.previous('element')) {
				this.previous('element').removeEventListener('click', this.onClick);
				this.previous('element').removeEventListener('dblclick', this.onDoubleClick);
				this.stopListening();
				this.stopMouseEventsTimeout();
				this.pointerEvents && this.pointerEvents.remove();
				this.touchEvents && this.touchEvents.remove();
				this.mouseEvents && this.mouseEvents.remove();
				this.wheelEvents && this.wheelEvents.remove();
				delete this.pointerEvents;
				delete this.touchEvents;
				delete this.mouseEvents;
				delete this.wheelEvents;
			}

			var element = this.get('element');
			if (element == document) throw 'PointerEvents do not fire pointerleave on document in IE / Edge';
			if (!element) return;

			element.addEventListener('click', this.onClick);
			element.addEventListener('dblclick', this.onDoubleClick);

			if (PointerEvents.isSupported) {
				this.pointerEvents = new PointerEvents(element);
				this.listenToPointerEvents();
			} else {
				this.touchEvents = new TouchEvents(element);
				this.mouseEvents = new MouseEvents(element);
				this.listenToTouchEvents();
				this.listenToMouseEvents();
			}

			this.wheelEvents = new WheelEvents(element);
			this.listenTo(this.wheelEvents, this.wheelEvents.EVENT.WHEEL, this.trigger.bind(this, this.EVENT.WHEEL));
		},

		listenToPointerEvents: function () {
			this.listenTo(this.pointerEvents, this.pointerEvents.EVENT.CHANGE, this.onPointersChange);
			this.listenTo(this.pointerEvents, this.pointerEvents.EVENT.MOVE, this.onPointersMove);
			this.listenTo(this.pointerEvents, this.pointerEvents.EVENT.DOWN, this.onPointerDown);
			this.listenTo(this.pointerEvents, this.pointerEvents.EVENT.UP, this.onPointerUp);
		},

		listenToTouchEvents: function () {
			this.listenTo(this.touchEvents, this.touchEvents.EVENT.MOVE, this.onPointersMove);
			this.listenTo(this.touchEvents, this.touchEvents.EVENT.DOWN, this.onPointersChange);
			this.listenTo(this.touchEvents, this.touchEvents.EVENT.DOWN, this.onTouchDown);
			this.listenTo(this.touchEvents, this.touchEvents.EVENT.UP, this.onPointersChange);
			this.listenTo(this.touchEvents, this.touchEvents.EVENT.UP, this.onTouchUp);
		},

		listenToMouseEvents: function () {
			this.listenTo(this.mouseEvents, this.mouseEvents.EVENT.MOVE, this.onPointerMove);
			this.listenTo(this.mouseEvents, this.mouseEvents.EVENT.DOWN, this.onMouseDown);
			this.listenTo(this.mouseEvents, this.mouseEvents.EVENT.UP, this.onMouseUp);
		},

		startMouseEventsTimeout: function () {
			this.mouseEventsTimeoutId = setTimeout(this.mouseEventsTimeoutFn, 500);
		},

		stopMouseEventsTimeout: function () {
			if (!this.mouseEventsTimeoutId) return;
			clearTimeout(this.mouseEventsTimeoutId);
			this.mouseEventsTimeoutId = null;
		},

		// HANDLE POINTER UP AND DOWN

		onPointerDown: function (pointer, first) {
			first && this.trigger(this.EVENT.DOWN, { button: pointer.button, target: pointer.target });
		},

		onPointerUp: function (pointer, last) {
			last && this.trigger(this.EVENT.UP, { button: pointer.button, target: pointer.target });
		},

		// HANDLE TOUCH UP AND DOWN

		onTouchDown: function (touches, changedTouches, first) {
			if (first) {
				this.trigger(this.EVENT.DOWN, { button: 0, target: changedTouches[0].target });
				this.stopListening(this.mouseEvents);
				this.stopMouseEventsTimeout();
			}
		},

		onTouchUp: function (touches, changedTouches, last) {
			if (last) {
				this.trigger(this.EVENT.UP, { button: 0, target: changedTouches[0].target });
				this.startMouseEventsTimeout();
			}
		},

		// HANDLE MOUSE UP AND DOWN

		onMouseDown: function (event) {
			this.trigger(this.EVENT.DOWN, { button: event.button, target: event.target });
			this.stopListening(this.touchEvents);
		},

		onMouseUp: function (event) {
			this.trigger(this.EVENT.UP, { button: event.button, target: event.target });
			event.buttons == 0 && this.listenToTouchEvents();
		},

		// HANDLE PINCH START, MOVE & END

		setPinching: function (pointers) {
			var pinching = pointers && pointers.length == 2;
			if (pinching && !this.pinching) this.onPinchStart(pointers);
			if (!pinching && this.pinching) this.onPinchEnd();
		},

		onPinchStart: function (pointers) {
			this.pinching = true;
			this.pinchStart = this.getPinchLength(pointers);
			this.trigger(this.EVENT.PINCH_START);
		},

		onPinchMove: function (pointers) {
			if (!this.pinching || !pointers || pointers.length != 2) return;
			var scale = this.getPinchLength(pointers) / this.pinchStart;
			this.trigger(this.EVENT.PINCH_MOVE, { scale: scale });
		},

		onPinchEnd: function () {
			this.pinching = false;
			this.trigger(this.EVENT.PINCH_END);
		},

		getPinchLength: function (pointers) {
			var dx = pointers[0].clientX - pointers[1].clientX,
				dy = pointers[0].clientY - pointers[1].clientY;
			return Math.sqrt(dx * dx + dy * dy);
		},

		// HANDLE MULTIPLE AND SINGLE POINTER MOVES

		onPointersChange: function (pointers) {
			this.setPointer(this.getAverage(pointers));
			this.setPinching(pointers);
		},

		onPointersMove: function (pointers) {
			this.onPointerMove(this.getAverage(pointers));
			this.onPinchMove(pointers);
		},

		onPointerMove: function (event) {
			if (!event) return;
			var pointerPrevX = this.get('pointerX'),
				pointerPrevY = this.get('pointerY'),
				normalPrevX = this.get('normalX'),
				normalPrevY = this.get('normalY');
			this.setPointer(event);
			this.trigger(this.EVENT.MOVE, {
				pointerDeltaX: this.get('pointerX') - pointerPrevX,
				pointerDeltaY: this.get('pointerY') - pointerPrevY,
				normalDeltaX: this.get('normalX') - normalPrevX,
				normalDeltaY: this.get('normalY') - normalPrevY
			});
		},

		setPointer: function (event) {
			if (!event) return;
			var width = DisplayModel.get('width'),
				height = DisplayModel.get('height'),
				normal = Math.max(width, height) * 0.5;
			this.set({
				pointerX: event.clientX,
				pointerY: event.clientY,
				normalX: event.clientX / normal - 1,
				normalY: event.clientY / normal - 1
			})
		},

		getAverage: function () {
			var add = function (a, b) { return a + b };
			return function (pointers) {
				if (!pointers || !pointers.length) return;
				return pointers.length == 1 ? pointers[0] : {
					clientX: _.reduce(_.pluck(pointers, 'clientX'), add) / pointers.length,
					clientY: _.reduce(_.pluck(pointers, 'clientY'), add) / pointers.length
				}
			}
		}()
	});

	return new PointerModel();
});
