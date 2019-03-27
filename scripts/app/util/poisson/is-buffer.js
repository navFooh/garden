/*!
* Determine if an object is a Buffer
*
* @author   Feross Aboukhadijeh <https://feross.org>
* @license  MIT
*/

define(function () {

	return function isBuffer (obj) {
		return obj != null
			&& obj.constructor != null
			&& typeof obj.constructor.isBuffer === 'function'
			&& obj.constructor.isBuffer(obj);
	}
});
