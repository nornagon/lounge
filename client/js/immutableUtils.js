// Update `list` by replacing the element `el` with `el.id == targetId` by `f(el)`.
export function updateId(list, targetId, f) {
	return list.map(el => el.id === targetId ? f(el) : el);
}

export function setIn(obj, selectors, value) {
	return updateIn(obj, selectors, () => value);
}

export function updateIn(obj, [selector, ...rest], fn) {
	return {
		...obj,
		[selector]:
			rest.length
				? updateIn(obj[selector], rest, fn)
				: fn(obj[selector])
	};
}
