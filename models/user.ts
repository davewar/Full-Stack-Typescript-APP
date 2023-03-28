import mongoose, { InferSchemaType } from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		validated: {
			type: Boolean,
			default: false,
		},
		IncorrectPW: {
			type: Number,
			default: 0,
		},
		role: {
			type: Number,
			default: 0,
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

export type USER = InferSchemaType<typeof userSchema>;

const User = mongoose.model<USER>('User', userSchema);

export default User;
