import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  status: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
});

const gateSchema = new mongoose.Schema({
  gateName: { type: String, required: true },
  gateAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Optional field
  gatelord: { type: String, default: null }, // Stores the current Gatelord team name
  gatelordExpiresAt: { type: Date, default: null }, // Stores the expiration time for Gatelord
  time: { type: Number, default: 120000 }, // Default 2 minutes in milliseconds
  teams: [teamSchema],
}, {
  timestamps: true,
});

// Middleware to auto-clear Gatelord when it expires
gateSchema.pre('save', function (next) {
  if (this.gatelord && this.gatelordExpiresAt && new Date() > this.gatelordExpiresAt) {
    this.gatelord = null;
    this.gatelordExpiresAt = null;
  }
  next();
});

const Gate = mongoose.model('Gate', gateSchema);

export default Gate;
