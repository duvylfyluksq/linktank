import mongoose, { Schema, Document, models, model } from 'mongoose';

interface ISpeaker extends Document {
    name: string;
    title: string;
    photo_url: string;
    url: string;
    twitter: string;
}

const SpeakerSchema: Schema = new Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    photo_url: { type: String, required: false },
    url: { type: String, required: false },
    twitter: { type: String, required: false },
    linkedin: {type: String, required: false}
});

const Speaker = models.Speaker || model("Speaker", SpeakerSchema);

export default Speaker;