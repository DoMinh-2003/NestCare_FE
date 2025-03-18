import { Services } from "./service";

export interface Package {
	id: string;
	name: string;
	price: string;
	description?: string;
	packageServices: Services[];
	image: string;
	delivery_included: number;
	alerts_included: number;
	period: string;
	isDeleted: number;
	createdAt: string;
	updatedAt: string;
}
