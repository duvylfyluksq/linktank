import mongoose, {Schema, models, model} from 'mongoose';


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
    agenda: [[{
        start_time: Date,
        end_time: Date,
        topic: String,
        brief_description: String,
        speakers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Speaker",
            }
        ]
    }]],
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
    is_date_range: {
        type: Boolean,
    },
    location: {
        type: String,
        required: true,
    },
    location_tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
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
    backlink: {
        type: String,
        unique: true,
        required: true
    },
    is_approved: { type: Boolean },
    is_rejected: { type: Boolean }
}, { strict: false });

const Event = models.Event || model("Event", EventSchema);

export default Event;
