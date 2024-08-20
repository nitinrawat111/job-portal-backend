import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    name: {type: String, required: [true, 'Name is required'] }
});

export const Skill = mongoose.model('Skill', skillSchema);