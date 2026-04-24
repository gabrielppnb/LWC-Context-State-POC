import { LightningElement } from "lwc";
import { fromContext } from "@lwc/state";
import createShopStateManager from "c/smShop";

export default class ShopContextAdder extends LightningElement {
	shopState = fromContext(createShopStateManager);
	sequence = 0;

	get stateApi() {
		return this.shopState?.value ?? this.shopState;
	}

	handleAddItem() {
		this.sequence += 1;
		const randomPrice = Number((Math.random() * 100 + 1).toFixed(2));
		this.stateApi?.addItem?.({
			id: `generated-${this.sequence}`,
			name: `Item ${this.sequence}`,
			price: randomPrice,
		});
	}
}
