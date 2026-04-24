import { defineState } from "@lwc/state";

export default defineState(({ atom, computed, setAtom }, initialItems = []) => {
	const items = atom(initialItems);

	const cartTotal = computed([items], (currentItems) => {
		return currentItems.reduce((acc, item) => acc + item.price, 0);
	});

	const addItem = (newItem) => {
		setAtom(items, [...items.value, newItem]);
	};

	return {
		items,
		cartTotal,
		addItem,
	};
});
