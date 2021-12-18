/**
 * Move an element to another position in array
 * @param {Array} array
 * @param {Number} from
 * @param {Number} to
 * @returns {Array}
 */
export const reorderArray = (array, from, to) => {
	if (from === to) return array;

	const newArray = [...array];
	const target = array[from];
	const step = (to - from) / Math.abs(to - from);

	for (let i = from; i !== to; i += step) {
		newArray[i] = newArray[i + step];
	}

	newArray[to] = target;
	return newArray;
};
