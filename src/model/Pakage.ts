import { Services } from "./service";

export interface Package {
	id: string;
	name: string;
	price: string;
	description?: string;
	packageServices: Services[];
	image: string;
	isDeleted: number;
	createdAt: string;
	updatedAt: string;
}
