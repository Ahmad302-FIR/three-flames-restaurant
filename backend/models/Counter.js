import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  seqName: {
    type: String,
    required: true,
    unique: true
  },
  seq: {
    type: Number,
    default: 1000
  }
});

export const Counter = mongoose.model('Counter', counterSchema);

export const getNextSequence = async (seqName, defaultStart = 1000) => {
  const counter = await Counter.findOneAndUpdate(
    { seqName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return counter.seq;
};
