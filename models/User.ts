import mongoose, {Schema, models, model} from 'mongoose';

const UserSchema = new Schema({
    clerk_id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    saved_events: { type: [{type: mongoose.Schema.Types.ObjectId, ref: "Event"}] },
    created_at: { type: Date },
    updated_at: { type: Date },
    last_sign_in_at: { type: Date }
  });

  const User = models.User || model("User", UserSchema);
  
  export default User;