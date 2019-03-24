define([
	'backbone-webgl',
	'three',
	'model/asset-model',
	'model/webgl-model'
], function (WebGL, THREE, AssetModel, WebGLModel) {

	return WebGL.extend({

		initialize: function () {
			this.geometry = new THREE.BoxGeometry(100, 100, 100);
			this.material = new THREE.MeshLambertMaterial();
			this.mesh = new THREE.Mesh(this.geometry, this.material);
			this.parent.add(this.mesh);

			AssetModel.load(AssetModel.TEXTURE, 'img/og-image.jpg', this.onLoad.bind(this));

			this.listenTo(WebGLModel, 'update', this.update);
		},

		onLoad: function (texture) {
			this.material.map = texture;
		},

		update: function (delta, elapsed) {
			this.mesh.rotation.y = Math.sin(elapsed * 0.5) * Math.PI * 0.5;
		}
	});
});
