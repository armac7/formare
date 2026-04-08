import mongoose from 'mongoose';

const bodyStatusSchema = new mongoose.Schema({
    date: { type: String, required: true },
    username: { type: String, required: true },
    basilBodyTemp: { type: Number, required: false },
    mucusSensations: { type: String, required: false },
    mucusCharacteristics: { type: String, required: false },
    secondaryBiomarkers: { type: [String], required: false },
    notes: { type: String, required: false }
});

bodyStatusSchema.index({ username: 1, date: 1 }, { unique: true });

export const BodyStatus = mongoose.model('BodyStatus', bodyStatusSchema);