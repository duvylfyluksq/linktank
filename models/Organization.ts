import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const OrganizationSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 200,
    },
    url: {
        type: String,
        required: true,
    },
    logo_url: {
        type: String,
    },
    events_url: {
        type: String,
        required: true
    },
}, { strict: false });

export default models.Organization || model("Organization", OrganizationSchema);
