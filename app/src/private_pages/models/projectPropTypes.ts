// Projectlist compo > ProjectItem compo (edit button takes you to ProjectAmend compo)
//  create new project = Project compo

// Projectlist
export type CommentsTypes = {
	id: number;
	comments: string;
	dte: string;
	createdBy: string;
};

// Projectlist
export type productItem =
	| [0, 'Excel']
	| [1, 'Access']
	| [2, 'Website']
	| [3, 'BI'];

// Projectlist
export type ProjectTypes = productItem[];

// Projectlist
export type Payments = {
	id: number;
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
	customerID: string;
	description: string;
	lastUpdatedBy: string;
	paid: boolean;
	payments: Payments[];
	price: string;
	projectCompleted: string;
	title: string;
	type: ProjectTypes;
	updatedAt: string;
	_id: string;
};

// ProjectList > feeds > Projectitem
export type ProductListItemProps = {
	obj: ProjectProps;
	deleteItem: () => Promise<void>;
	getIdDelete: (id: string) => void;
};

// Project
