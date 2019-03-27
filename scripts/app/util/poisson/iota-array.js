/*!
* iota-array
*
* @author   Mikola Lysenko
* @license  MIT
*/

define(function () {

	return function iota (n) {
		var result = new Array(n)
		for(var i = 0; i < n; ++i) {
			result[i] = i
		}
		return result
	}
});
