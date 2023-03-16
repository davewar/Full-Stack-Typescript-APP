// create Customer = ClientCreate compo
// Amend Customer = ClientEdit > Customer compo

//Customer component props
export type Address = {
	addressLine1: string;
	addressLine2: string;
	addressLine3: string;
	town: string;
	county: string;
	postcode: string;
};

//Customer + CustomerEdit component props
export type CustomerProps = {
	name: string;
	businessName: string;
	email: string;
	telephone: string;
	address: Address;
	createdAt: string;
	updatedAt: string;
	_id: string;
};

//Customer + CustomerEdit component props
export type updateCustomerProps = {
	name: string;
	email: string;
	address: Address;
	telephone: string;
	businessName: string;
};

//Customer component props
export type CustomerEditProps = {
	key: string;
	customer: CustomerProps[];
	handleUpdateCustomer: (
		e: React.FormEvent<HTMLFormElement>,
		id: string,
		updateCustomer: updateCustomerProps
	) => Promise<void>;
	setSuccess: React.Dispatch<React.SetStateAction<string>>;
	setSignInErr: React.Dispatch<React.SetStateAction<string>>;
	handleDeleteCustomer: (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		id: string
	) => Promise<void>;
};
