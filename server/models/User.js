import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
  email: { type: String },  // Remove the unique constraint on email
});

const User = mongoose.model('User', userSchema);

export default User;
