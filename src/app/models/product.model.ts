import { InterfaceProduct } from "../interface/product.interface";

export class Product implements InterfaceProduct{
  id: number = -1;
  name: string = '';
  imageUrl: string = '';
  price: number = 0;
  description: string = '';

  static fromJson(productData: InterfaceProduct) {
		return Object.assign(new Product(), productData);
	}

	toJson(): InterfaceProduct {
		const jsonObject: InterfaceProduct = Object.assign({}, this);
		// delete jsonObject.id;
		return jsonObject;
	}
}
