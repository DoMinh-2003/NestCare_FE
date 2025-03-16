
export interface ServicePackageModel {
	id: string;
	name: string;
	description?: string
	services: Services[];
	image: string;
	link?: string;
	price: string;
}

export interface Services {
	id: string,
	slot: number,
	service: {
		id: string;
		name: string;
		price: number,
		description: string
	}
};


