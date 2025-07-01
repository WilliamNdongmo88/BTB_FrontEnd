import { InterfaceProduct } from "../interface/product.interface";
import { MyFile } from "./myfile.model";
import { User } from "./user.model";

export class Product implements InterfaceProduct{
  id: number = -1;
  name: string = '';
  price: number = 0;
  description: string = '';
  productImage!: MyFile;
  mainImage!: MyFile;
  images!: MyFile[];
  //length: any;


  // static fromJson(productData: InterfaceProduct) {
	// 	return Object.assign(new Product(), productData);
	// }

	// toJson(): InterfaceProduct {
	// 	const jsonObject: InterfaceProduct = Object.assign({}, this);
	// 	// delete jsonObject.id;
	// 	return jsonObject;
	// }
}