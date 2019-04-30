define([
	'backbone',
	'stats',
	'three'
], function (Backbone, Stats, THREE) {

	var clock = new THREE.Clock(false),
		requestId = null,
		WebGLModel = Backbone.Model.extend({

			defaults: {
				scene: null,
				camera: null
			},

			initialize: function () {
				this.loop = this.loop.bind(this);
				this.stats = null;
			},

			createStats: function () {
				this.stats = new Stats();
				this.stats.showPanel(1);
				return this.stats.dom;
			},

			start: function () {
				if (requestId) return;
				clock.start();
				this.loop();
			},

			stop: function () {
				if (!requestId) return;
				cancelAnimationFrame(requestId);
				requestId = null;
				clock.stop();
			},

			loop: function () {
				// request next loop
				requestId = requestAnimationFrame(this.loop);

				// begin measuring stats
				this.stats && this.stats.begin();

				// trigger update event
				var delta = clock.getDelta(),
					elapsed = clock.elapsedTime;
				this.trigger('update', delta, elapsed);

				// trigger render event
				var scene = this.get('scene'),
					camera = this.get('camera');
				if (!scene || !camera) return;
				this.trigger('render', scene.scene, camera.camera);

				// end measuring stats
				this.stats && this.stats.end();
			}
		});

	return new WebGLModel();
});
