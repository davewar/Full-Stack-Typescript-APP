import mongoose, { InferSchemaType } from 'mongoose';

const emailSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter name'],
		},
		email: {
			type: String,
			required: [true, 'Please supply email'],
		},
		comment: {
			type: String,
			required: [true, 'Please supply brief description'],
		},
	},
	{
		timestamps: true,
	}
);
export type EMAIL = InferSchemaType<typeof emailSchema>;

const Email = mongoose.model<EMAIL>('Email', emailSchema);

export default Email;
