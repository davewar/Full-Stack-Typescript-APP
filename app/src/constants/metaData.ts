type MetaDataProp = {
	id: number;
	page: string;
	image: string;
	title: string;
	description: string;
	name: string;
	type: string;
	url: string;
};

export const metaData: Array<MetaDataProp> = [
	{
		id: 1,
		page: '/',
		image: 'http://localhost:3000/images/sysadmin_03.jpg',
		title: 'DW-Serv provide low cost technology soloutions HOME',
		description: 'content="home desc test. HOME',
		name: 'DW-Serv H',
		type: 'website',
		url: 'https://www.test.com',
	},
	{
		id: 2,
		page: '/services',
		image: '',
		title: 'Srvices data S',
		description: 'content="services desc test. S',
		name: 'DW-Serv',
		type: 'website',
		url: 'https://www.test.com/services',
	},

	{
		id: 3,
		page: '/contact',
		image: '',
		title: 'contact page test C',
		description: 'content="contact desc test. C',
		name: 'DW-Serv',
		type: 'website',
		url: 'https://www.test.com/contact',
	},

	{
		id: 4,
		page: '/login',
		image: '',
		title: 'login',
		description: 'content="Login to website',
		name: 'DW-Serv',
		type: 'website',
		url: 'https://www.test.com/login',
	},
	{
		id: 5,
		page: '/register',
		image: '',
		title: 'Register',
		description: 'content="Join website',
		name: 'DW-Serv',
		type: 'website',
		url: 'https://www.test.com/register',
	},
];
