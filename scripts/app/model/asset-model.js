define([
	'backbone',
	'three',
	'three-gltf-loader'
], function (Backbone, THREE) {

	var onLoad = function () {
			this.apply(this, arguments);
			decrease();
		},

		onProgress = function (xhr) {
			// console.log(xhr.loaded, xhr.total)
		},

		onError = function (xhr) {
			console.error(xhr);
			decrease();
		},

		increase = function () {
			assetModel.set({
				loading: true,
				total: assetModel.get('total') + 1
			});
		},

		decrease = function () {
			var total = assetModel.get('total'),
				loaded = assetModel.get('loaded') + 1,
				loading = loaded < total;
			assetModel.set({
				loading: loading,
				loaded: loading ? loaded : 0,
				total: loading ? total : 0
			});
		},

		AssetModel = Backbone.Model.extend({

			ANIMATION: { instance: null, CLASS: THREE.AnimationLoader },
			AUDIO: { instance: null, CLASS: THREE.AudioLoader },
			IMAGE: { instance: null, CLASS: THREE.ImageLoader },
			JSON: { instance: null, CLASS: THREE.JSONLoader },
			GLTF: { instance: null, CLASS: THREE.GLTFLoader },
			OBJECT: { instance: null, CLASS: THREE.ObjectLoader },
			TEXTURE: { instance: null, CLASS: THREE.TextureLoader },
			CUBE: { instance: null, CLASS: THREE.CubeTextureLoader },

			defaults: {
				loading: false,
				loaded: 0,
				total: 0
			},

			load: function (loader, url, callback) {
				if (!loader.instance)
					loader.instance = new loader.CLASS();
				loader.instance.load(url, onLoad.bind(callback), onProgress, onError);
				increase();
			}
		}),

		assetModel = new AssetModel();

	return assetModel;
});
