import mongoose from 'mongoose';
import { STATUSES } from '../apiConfig.js';

// Define the job schema
const jobSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(STATUSES),
    default: STATUSES.NO_DATA
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  email:{
    type:String
  }
  // Other fields as needed for your job
});

// Create Job model
export const Job = mongoose.model('Job', jobSchema);


