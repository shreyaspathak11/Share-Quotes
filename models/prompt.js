import { Schema, model, models } from 'mongoose';

const PromptSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  prompt: {
    type: String,
    required: [true, 'Prompt is required.'],
  },
  tag: {
    type: String,
    required: [true, 'Tag is required.'],
  },
  likes: [{
    type: Schema.Types.ObjectId,  // Array of user IDs who liked the post
    ref: 'User',
  }],
  dislikes: [{
    type: Schema.Types.ObjectId,  // Array of user IDs who disliked the post (if applicable)
    ref: 'User',
  }],
}, {
  timestamps: true, // Optional: Adds createdAt and updatedAt timestamps
});

const Prompt = models.Prompt || model('Prompt', PromptSchema);

export default Prompt;
