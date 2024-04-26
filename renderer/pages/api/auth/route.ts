import React from "react";
import { NextApiResponse, NextApiRequest } from 'next';
import mongoose from "mongoose";
import MongoDBConnection from '../../../kernel/utils/connection';

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
	const MONGODB_URI = MongoDBConnection.url;

	let client;

	try {
		client = await mongoose.connect(MONGODB_URI);
		console.log("DB connected");
		res.send(
			{ message: "Message sent" }
		);
	} catch (error) {
		console.log("There was an error connection to the DB", error);
		res.send(
			{ message: error }
		);
	}
}