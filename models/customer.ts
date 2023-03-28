import mongoose, { InferSchemaType } from 'mongoose';

const customerSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		businessName: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},

		telephone: {
			type: String,
			required: true,
		},
		address: {
			type: Object,
			required: true,
		},
		createdBy: {
			type: String,
			trim: true,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export type CUSTOMER = InferSchemaType<typeof customerSchema>;

const Customer = mongoose.model<CUSTOMER>('Customer', customerSchema);
export default Customer;
