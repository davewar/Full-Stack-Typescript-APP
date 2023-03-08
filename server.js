const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const connectDb = async () => {
	try {
		let db = process.env.MONGO_URI;
		if (process.env.NODE_ENV === 'test') {
			db = process.env.MONGO_URI_TEST;
		}

		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log('All good');
	} catch (err) {
		console.log('dw err desc', err);
		console.log('DW err with connection');
		process.exit(1);
	}
};

connectDb();

app.use('/test', (req, res) => {
	res.status(200).send({ message: 'Welcome' });
});

// login / password reset  / register / activate  = users
const userRouter = require('./routes/users');
app.use('/user', userRouter);

//emails from clients
const emailRouter = require('./routes/email');
app.use('/api/email', emailRouter);

// create/ amend / update / get  = clients
const customerRouter = require('./routes/customer');
app.use('/api/customer', customerRouter);

//create/ amend / update / get  = projects
const productRouter = require('./routes/product');
app.use('/api/product', productRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`);
});

module.exports = app;
