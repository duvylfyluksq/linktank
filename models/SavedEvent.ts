import mongoose from "mongoose";

const SavedEventSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	eventId: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.models.SavedEvent ||
	mongoose.model("SavedEvent", SavedEventSchema);
