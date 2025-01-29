import mongoose from 'mongoose';

const WordSchema = new mongoose.Schema({
  text: { type: String, required: true },
  frequency: { type: Number, default: 1 },
});

const Word = mongoose.model('Word', WordSchema);
export default Word;
