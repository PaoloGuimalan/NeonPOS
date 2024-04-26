import mongoose from "mongoose";
import MongoDBConnection from './connection';

export default async () => {
    const MONGODB_URI = MongoDBConnection.url;

	let client;

	try {
		client = await mongoose.connect(MONGODB_URI);
        return true;
	} catch (error) {
        throw new Error(error);
	}
}