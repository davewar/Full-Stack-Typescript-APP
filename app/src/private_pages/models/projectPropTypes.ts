// Projectlist compo > ProjectItem compo (edit button takes you to ProjectAmend compo)
//  create new project = Project compo

// Projectlist
export type CommentsTypes = {
	id: string;
	comments: string;
	dte: string;
	createdBy: string;
};

// Projectlist
export type Payments = {
	id: string;
	paidAmount: string;
	paymentDate: string;
	createdBy: string;
};

// Projectlist

export type ProjectProps = {
	assignedTo: string;
	comments: CommentsTypes[];
	createdAt: string;
	createdBy: string;
	customerID?: string;
	description: string;
	lastUpdatedBy: string;
	paid: boolean;
	payments: Payments[];
	price: string;
	projectCompleted: boolean;
	title: string;
	type: string[];
	updatedAt: string;
	_id: string;
};

// ProjectList > feeds > Projectitem
export type ProjectListItemProps = {
	obj: ProjectProps;
	deleteItem: () => Promise<void>;
	getIdDelete: (id: string) => void;
};

// Searchform

export type SearchFormProps = {
	search: string;
	setSearch: React.Dispatch<React.SetStateAction<string>>;
	radio: string;
	setRadio: React.Dispatch<React.SetStateAction<string>>;
	paidRadio: string;
	setPaidRadio: React.Dispatch<React.SetStateAction<string>>;
};
