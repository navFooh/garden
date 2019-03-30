define([
	'backbone-webgl',
	'three',
	'underscore',
	'model/asset-model',
	'model/state-model',
	'model/webgl-model',
	'util/poisson/poisson-disk-sampling',
	'text!shaders/flower.vert',
	'text!shaders/flower.frag'
], function (WebGL, THREE, _, AssetModel, StateModel, WebGLModel, PoissonDiskSampling, flowerVert, flowerFrag) {

	return WebGL.extend({

		initialize: function () {
			this.availableTextures = _.range(19);
			this.selectedTextures = _.sample(this.availableTextures, 3);

			this.geometry = new THREE.BufferGeometry();
			this.material = new THREE.ShaderMaterial({
				uniforms: {
					texture: 		{ value: null },
					textureCols: 	{ value: 4 },
					textureRows: 	{ value: 5 },
					fogColor: 		{ value: StateModel.get('fogColor') },
					fogNear: 		{ value: StateModel.get('fogNear') },
					fogFar: 		{ value: StateModel.get('fogFar') }
				},
				vertexShader:   flowerVert,
				fragmentShader: flowerFrag,
				depthTest:      false,
				transparent:    true
			});
			this.mesh = new THREE.Points(this.geometry, this.material);
			this.mesh.matrixAutoUpdate = false;
			this.mesh.updateMatrix();
			this.parent.add(this.mesh);

			this.createFlowers();
			this.loadTextures();

			this.listenTo(WebGLModel, 'update', this.update);
		},

		createFlowers: function () {
			var width = StateModel.get('width');
			var depth = StateModel.get('depth');
			var spacing = 5;
			var poisson = new PoissonDiskSampling([width, depth], spacing);
			var flowers = poisson.fill();

			flowers.sort(function (a, b) {
				return a[1] - b[1];
			});

			this.count = flowers.length
			this.sizes = new Float32Array(this.count);
			this.scales = new Float32Array(this.count);
			this.positions = new Float32Array(this.count * 3);
			this.rotations = new Float32Array(this.count);
			this.velocities = new Float32Array(this.count);
			this.textureIndexes = new Float32Array(this.count);

			for (var i = 0; i < this.count; i++) {
				this.sizes[i] = 75 + 50 * Math.random();
				this.scales[i] = 1;
				this.positions[i * 3] = flowers[i][0] - width * 0.5;
				this.positions[i * 3 + 1] = 0;
				this.positions[i * 3 + 2] = flowers[i][1] - depth;
				this.rotations[i] = Math.random() * Math.PI * 2;
				this.velocities[i] = 0;
				this.textureIndexes[i] = _.sample(this.selectedTextures);
			}

			this.geometry.addAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
			this.geometry.addAttribute('scale', new THREE.BufferAttribute(this.scales, 1).setDynamic(true));
			this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
			this.geometry.addAttribute('rotation', new THREE.BufferAttribute(this.rotations, 1).setDynamic(true));
			this.geometry.addAttribute('textureIndex', new THREE.BufferAttribute(this.textureIndexes, 1).setDynamic(true));

			console.log('Created ' + this.count + ' flowers');
		},

		loadTextures: function () {
			AssetModel.load(AssetModel.TEXTURE, 'img/flowers.png', this.onLoadTexture.bind(this));
		},

		onLoadTexture: function (texture) {
			texture.flipY = false;
			this.material.uniforms.texture.value = texture;
		},

		update: function (delta, elapsed) {
			var deltaX, deltaZ, distance, cross;
			var pointerPosition = StateModel.get('pointerPosition');
			var pointerDirection = StateModel.get('pointerDirection');
			var pointerMoving = StateModel.get('pointerMoving');
			var pointerRange = StateModel.get('pointerRange');
			var pointerSpeed = StateModel.get('pointerSpeed');
			var deltaClamped = Math.min(0.1, delta);

			for (var i = 0; i < this.count; i++) {
				deltaX = this.positions[i * 3] - pointerPosition.x;
				deltaZ = this.positions[i * 3 + 2] - pointerPosition.z;
				distance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
				if (pointerMoving && distance < pointerRange) {
					cross = pointerDirection.x * (deltaZ / distance) - pointerDirection.z * (deltaX / distance);
					this.velocities[i] += (1 - distance / pointerRange) * deltaClamped * 0.1 * pointerSpeed * cross;
				}
				this.velocities[i] -= this.velocities[i] * deltaClamped * 0.5;
				this.rotations[i] += this.velocities[i];
			}

			StateModel.set('pointerMoving', false);
			this.geometry.attributes.rotation.needsUpdate = true;
		}
	});
});
