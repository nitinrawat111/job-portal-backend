/**
 * This module contains some common Sub-Schemas which are used in other higher order schemas
*/	

import mongoose from "mongoose";

export const addressSchema = new mongoose.Schema({
	blockOrStreet: { type: String },
	city: { type: String },
	state: { type: String },
	country: { type: String },
	zip: { type: String }
}, { _id: false });