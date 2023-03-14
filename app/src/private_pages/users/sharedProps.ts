export type updateUserProp = {
	role: number;
	active: string;
	validated: string;
};

export type UserProps = {
	IncorrectPW: number;
	active: string;
	createdAt: string;
	email: string;
	name: string;
	role: number;
	updatedAt: string;
	validated: string;
	_id: string;
};

export type SingleUserProps = UserProps & {
	deleteItem: () => void;
	getIdDelete: (id: string) => void;
	handleEditUser: (id: string, updateUser: updateUserProp) => void;
	setErrors: React.Dispatch<React.SetStateAction<string>>;
	setFail: React.Dispatch<React.SetStateAction<string>>;
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
	setSuccess: React.Dispatch<React.SetStateAction<string>>;
	show: boolean;
};
