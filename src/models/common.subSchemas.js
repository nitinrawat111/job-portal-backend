/**
 * This module contains some common Sub-Schemas which are used in other higher order schemas
*/	

import mongoose from "mongoose";

export const addressSchema = new mongoose.Schema({
	blockOrStreet: { type: String, trim: true },
	city: { type: String, trim: true },
	state: { type: String, trim: true },
	country: { type: String, trim: true },
	zip: { type: String, trim: true }
}, { _id: false });