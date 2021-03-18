
function createBinder(instance) {
	return (function (a, ...p) {
		return this[a].bind(this, ...p);
	}).bind(instance);
}
module.exports = {createBinder}