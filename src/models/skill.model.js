import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    name: {type: String, required: [true, 'Name is required'], trim: true }
});

skillSchema.index({ name: 1 }, { unique: true });

export const Skill = mongoose.model('Skill', skillSchema);