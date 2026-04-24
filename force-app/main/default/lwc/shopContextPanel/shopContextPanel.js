import { LightningElement } from "lwc";
import { fromContext } from "@lwc/state";
import createShopStateManager from "c/smShop";

export default class ShopContextPanel extends LightningElement {
	shopState = fromContext(createShopStateManager);

	get stateApi() {
		return this.shopState?.value ?? this.shopState;
	}

	get items() {
		const items = this.stateApi?.items?.value ?? this.stateApi?.items ?? [];
		return Array.isArray(items) ? items : [];
	}

	get total() {
		return this.stateApi?.cartTotal?.value ?? this.stateApi?.cartTotal ?? 0;
	}
}
