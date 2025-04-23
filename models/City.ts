import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const CitySchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, { strict: false });

export default models.City || model("City", CitySchema);
