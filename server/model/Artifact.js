import mongoose from 'mongoose';

const artifactSchema = new mongoose.Schema({
    user: { type: String, required: true },
    name: { type: String, required: true },
    content: { type: String, required: true },
    type: { 
        type: String, 
        required: true,
        enum: ['html', 'mermaid', 'code', 'text', 'other', 'openscad']
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

artifactSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Artifact = mongoose.model('Artifact', artifactSchema);