import { LightningElement } from "lwc";
import createShopStateManager from "c/smShop";

const INITIAL_ITEMS = [
	{ id: "starter-1", name: "Caderno", price: 29.9 },
	{ id: "starter-2", name: "Caneta", price: 7.5 },
];

export default class ShopContextPoc extends LightningElement {
	// O provider precisa expor a instância em uma propriedade enumerável.
	shopState = createShopStateManager(INITIAL_ITEMS);

	get stateApi() {
		return this.shopState?.value ?? this.shopState;
	}

	get itemCount() {
		const items = this.stateApi?.items?.value ?? this.stateApi?.items ?? [];
		return Array.isArray(items) ? items.length : 0;
	}

	get cartTotal() {
		return this.stateApi?.cartTotal?.value ?? this.stateApi?.cartTotal ?? 0;
	}
}
