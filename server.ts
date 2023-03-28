import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose, { ConnectOptions } from 'mongoose';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

const app: Express = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const connectDb = async () => {
	try {
		let db = process.env.MONGO_URI as string;

		if (process.env.NODE_ENV === 'test') {
			db = process.env.MONGO_URI_TEST as string;
		}

		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		} as ConnectOptions);

		console.log('All good');
	} catch (err) {
		if (err instanceof Error) {
			console.log('dw err desc', err);
			console.log('DW err with connection');
			process.exit(1);
		}
	}
};

connectDb();

app.use('/test', (req: Request, res: Response) => {
	res.status(200).send({ message: 'Welcome' });
});

// login / password reset  / register / activate  = users
import userRouter from './routes/users';
app.use('/user', userRouter);

//emails from clients
import emailRouter from './routes/email';
app.use('/api/email', emailRouter);

// create/ amend / update / get  = clients
import customerRouter from './routes/customer';
app.use('/api/customer', customerRouter);

//create/ amend / update / get  = projects
import productRouter from './routes/product';
app.use('/api/product', productRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`);
});

module.exports = app;
