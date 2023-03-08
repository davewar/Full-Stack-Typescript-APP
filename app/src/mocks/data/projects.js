import { TESTUSERS } from './users';

let customerOne = {
	name: 'cust1',
	businessName: 'bus1',
	email: 'customer1@gmail.com',
	telephone: '01322123456',
	address: {
		addressLine1: '1 street road',
		addressLine2: '',
		addressLine3: '',
		town: 'Erith',
		county: 'Kent',
		postcode: 'DA1',
	},
};

let customerTwo = {
	name: 'cust2',
	businessName: 'bus2',
	email: 'customer2@gmail.com',
	telephone: '01322987654321',
	address: {
		addressLine1: '2 street road',
		addressLine2: '',
		addressLine3: '',
		town: 'Erith',
		county: 'Kent',
		postcode: 'DA2',
	},
};

let customerThree = {
	name: 'cust3',
	businessName: 'bus3',
	email: 'customer3@gmail.com',
	telephone: '01322987654321',
	address: {
		addressLine1: '3 street road',
		addressLine2: '',
		addressLine3: '',
		town: 'Erith',
		county: 'Kent',
		postcode: 'DA2',
	},
};

// let projectOne = {
// 	customerID: 'customer1@gmail.com',
// 	title: 'Title project1...',
// 	type: ['Excel', 'Access', 'Website', 'BI'],
// 	price: '100',
// 	description: 'Description....',
// 	projectCompleted: 'false',
// };

let products = [
	{
		_id: 1,
		customerID: 'customer1@gmail.com',
		title: 'Title project1... CHANGED',
		type: ['Excel'],
		price: '1000',
		description: 'Description....CHANGED',
		projectCompleted: 'true',
		comments: [
			{
				id: 1,
				comments: 'blah..',
				dte: '17/01/2023 16:52:58',
				createdBy: TESTUSERS[1].email,
			},
			{
				id: 2,
				comments: 'blah..2',
				dte: '18/01/2023 17:52:58',
				createdBy: TESTUSERS[1].email,
			},
		],
		paid: 'true',
		payments: [
			{
				id: 'ecbd9e7e-ce33-4402-b1a5-65521728d4f1',
				paidAmount: '5',
				paymentDate: '03/01/2023',
				createdBy: TESTUSERS[1].email,
			},
		],
		assignedTo: TESTUSERS[1].email,
		createdBy: TESTUSERS[1].email,
		lastUpdatedBy: TESTUSERS[1].email,
	},

	{
		_id: 2,
		customerID: 'customer1@gmai2.com',
		title: 'Title project2... CHANGED',
		type: ['Excel'],
		price: '2000',
		description: 'Description....CHANGED',
		projectCompleted: 'true',
		comments: [
			{
				id: 1,
				comments: 'blah..',
				dte: '19/01/2023 16:52:58',
				createdBy: TESTUSERS[1].email,
			},
			{
				id: 2,
				comments: 'blah..2',
				dte: '20/01/2023 17:52:58',
				createdBy: TESTUSERS[1].email,
			},
		],
		paid: 'true',
		payments: [
			{
				id: 'ecbd9e7e-ce33-4402-b1a5-65521728d4f1',
				paidAmount: '2000',
				paymentDate: '04/01/2023',
				createdBy: TESTUSERS[1].email,
			},
		],
		assignedTo: TESTUSERS[1].email,
		createdBy: TESTUSERS[1].email,
		lastUpdatedBy: TESTUSERS[1].email,
	},
];

let projectNew = {
	_id: 1,
	customerID: 'customer1@gmail.com',
	title: 'Title project1... CHANGED',
	type: ['Excel'],
	price: 1000,
	description: 'Description....CHANGED',
	projectCompleted: 'true',
	comments: [
		{
			id: 1,
			comments: 'blah..',
			dte: '17/01/2023 16:52:58',
			createdBy: TESTUSERS[1].email,
		},
		{
			id: 2,
			comments: 'blah..2',
			dte: '18/01/2023 17:52:58',
			createdBy: TESTUSERS[1].email,
		},
	],
	paid: 'true',
	payments: [
		{
			id: 'ecbd9e7e-ce33-4402-b1a5-65521728d4f1',
			paidAmount: '5',
			paymentDate: '03/01/2023',
			createdBy: TESTUSERS[1].email,
		},
	],
	assignedTo: TESTUSERS[1].email,
	createdBy: TESTUSERS[1].email,
	lastUpdatedBy: TESTUSERS[1].email,
};

module.exports = {
	customerOne,
	customerTwo,
	customerThree,
	products,
	projectNew,
};
