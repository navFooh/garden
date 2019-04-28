define([
	'backbone-util',
	'underscore'
], function (Util, _) {

	var BIT_TO_BUTTON = [0,2,1,3,4,5];

	return Util.extend({

		EVENT: {
			CHANGE: 0,
			DOWN: 1,
			MOVE: 2,
			UP: 3
		},

		initialize: function (element) {
			if (!element) throw 'Supply a target element for PointerEvents';
			this.element = element;

			var PointerEvent = window.PointerEvent || window.MSPointerEvent;
			if (!PointerEvent) throw 'PointerEvents are not supported, check PointerEvents.isSupported';

			this.activePointerType = null;	// active pointer type: 'mouse', 'pen' or 'touch'
			this.activeButtonCount = [];    // counts pressed buttons for the active pointer type
			this.activePointers = [];    	// stores all pointers for the active pointer type

			this.setPointer = this.setPointer.bind(this);
			this.unsetPointer = this.unsetPointer.bind(this);

			this.MS = PointerEvent === window.MSPointerEvent;

			this.element.addEventListener(this.MS ? 'MSPointerUp' : 'pointerup', this.setPointer);
			this.element.addEventListener(this.MS ? 'MSPointerDown' : 'pointerdown', this.setPointer);
			this.element.addEventListener(this.MS ? 'MSPointerMove' : 'pointermove', this.setPointer);
			this.element.addEventListener(this.MS ? 'MSPointerEnter' : 'pointerenter', this.setPointer);
			this.element.addEventListener(this.MS ? 'MSPointerLeave' : 'pointerleave', this.unsetPointer);
			this.element.addEventListener(this.MS ? 'MSPointerCancel' : 'pointercancel', this.unsetPointer);
		},

		remove: function () {
			this.element.removeEventListener(this.MS ? 'MSPointerUp' : 'pointerup', this.setPointer);
			this.element.removeEventListener(this.MS ? 'MSPointerDown' : 'pointerdown', this.setPointer);
			this.element.removeEventListener(this.MS ? 'MSPointerMove' : 'pointermove', this.setPointer);
			this.element.removeEventListener(this.MS ? 'MSPointerEnter' : 'pointerenter', this.setPointer);
			this.element.removeEventListener(this.MS ? 'MSPointerLeave' : 'pointerleave', this.unsetPointer);
			this.element.removeEventListener(this.MS ? 'MSPointerCancel' : 'pointercancel', this.unsetPointer);
			Util.prototype.remove.apply(this);
		},

		setPointer: function (event) {
			// check if this pointer is of the active type, change the type if no buttons are pressed
			if (this.activePointerType !== event.pointerType && !_.some(this.activeButtonCount)) {
				this.activePointerType = event.pointerType;
				this.activeButtonCount = [];
				this.activePointers = [];
			}

			// only process events for the active pointer type
			if (this.activePointerType !== event.pointerType) return;

			// find the stored pointer
			var pointer = this.copyPointer(event);
			var pointerIndex = this.getPointerIndex(pointer.pointerId);
			var previousPointer = pointerIndex > -1 ? this.activePointers[pointerIndex] : null;
			var previousButtons = previousPointer ? previousPointer.buttons : 0;

			if (previousPointer) {
				// update the stored pointer
				this.activePointers.splice(pointerIndex, 1, pointer);

				// trigger MOVE if the pointer position changed
				if (this.pointerMoved(pointer, previousPointer))
					this.trigger(this.EVENT.MOVE, this.activePointers);

			} else {
				// store the new pointer
				this.activePointers.push(pointer);

				// trigger CHANGE for the new pointer configuration
				this.trigger(this.EVENT.CHANGE, this.activePointers);
			}

			// trigger DOWN or UP when the pointer buttons changed
			if (pointer.buttons !== previousButtons)
				this.compareButtons(pointer.buttons, previousButtons, event.target);
		},

		unsetPointer: function (event) {
			// only process events for the active pointer type
			if (this.activePointerType !== event.pointerType) return;

			// find the stored pointer
			var pointerIndex = this.getPointerIndex(event.pointerId);

			// do nothing if pointer wasn't stored
			if (pointerIndex === -1) return;

			// remove the stored pointer
			var pointer = this.activePointers.splice(pointerIndex, 1)[0];

			// trigger UP for any pressed buttons
			if (pointer.buttons !== 0)
				this.compareButtons(0, pointer.buttons, event.target);

			// trigger CHANGE event
			this.trigger(this.EVENT.CHANGE, this.activePointers);
		},

		compareButtons: function (buttons, previousButtons, target) {
			// keep track of the bit we're checking
			var bit = 0;

			// iterate over the buttons bitmask
			while (buttons || previousButtons) {

				// get buttons states
				var isDown = buttons & 1,
					wasDown = previousButtons & 1,
					button = BIT_TO_BUTTON[bit++];

				// capture and release buttons according to states
				isDown && !wasDown && this.captureButton(button, target);
				!isDown && wasDown && this.releaseButton(button, target);

				// shift the bits
				buttons >>= 1;
				previousButtons >>= 1;
			}
		},

		captureButton: function (button, target) {
			// create counter for button type if not yet exists
			if (typeof this.activeButtonCount[button] === 'undefined')
				this.activeButtonCount[button] = 0;

			// increment counter for pressed button and trigger DOWN
			var first = this.activeButtonCount[button]++ === 0;
			this.trigger(this.EVENT.DOWN, button, target, first);
		},

		releaseButton: function (button, target) {
			// prevent releasing button if not registered as pressed
			if (typeof this.activeButtonCount[button] === 'undefined' || this.activeButtonCount[button] === 0)
				return;

			// decrement counter for released button and trigger UP
			var last = --this.activeButtonCount[button] === 0;
			this.trigger(this.EVENT.UP, button, target, last);
		},

		getPointerIndex: function (pointerId) {
			return _.findIndex(this.activePointers, function (pointer) {
				return pointer.pointerId === pointerId;
			});
		},

		copyPointer: function (pointer) {
			return {
				buttons: pointer.buttons,
				clientX: pointer.clientX,
				clientY: pointer.clientY,
				pointerId: pointer.pointerId
			}
		},

		pointerMoved: function (pointer, previousPointer) {
			return pointer.clientX !== previousPointer.clientX || pointer.clientY !== previousPointer.clientY;
		}

	}, {
		isSupported: !!(window.PointerEvent || window.MSPointerEvent)
	});
});
