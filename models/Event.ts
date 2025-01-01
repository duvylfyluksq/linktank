import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const EventSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 200,
    },
    date_from: {
        type: Date,
        required: true,
    },
    date_to: {
        type: Date,
    },
    url: {
        type: String,
        required: true,
        unique: true,
    },
    ticket_url: {
        type: String,
    },
    brief_description: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    agenda: {
        type: String,
    },
    speakers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Speaker",
        },
    ],
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
    },
    photo_url: {
        type: String,
    },
    is_virtual: {
        type: Boolean,
    },
    is_in_person: {
        type: Boolean,
    },
    location: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        default: null,
    },
    room: {
        type: String,
        default: null,
    },
    city: {
        type: String,
        default: null,
    },
    state: {
        type: String,
        default: null,
    },
    zip_code: {
        type: String,
        default: null,
        validate: {
            validator: function (value: any) {
                return /^\d{5}$/.test(value);
            },
            message: (props: any) => `${props.value} is not a valid 5-digit zip code!`,
        },
    },
    country: {
        type: String,
    },
    keywords: [
        {
            type: String,
        },
    ],
    contact_name: {
        type: String,
    },
    contact_phone: {
        type: String,
    },
    contact_email: {
        type: String,
    },
}, { strict: false });

export default models.Event || model("Event", EventSchema);
