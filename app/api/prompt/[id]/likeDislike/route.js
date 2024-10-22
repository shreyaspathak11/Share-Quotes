import Prompt from "@models/prompt";
import User from "@models/user";
import { connectToDB } from "@utils/database";

// API to handle likes and dislikes for a prompt
export const PATCH = async (request, { params }) => {
  const { userId, action } = await request.json();  // 'action' can be 'like' or 'dislike'

  try {
    await connectToDB();

    // Find the existing prompt by ID
    const prompt = await Prompt.findById(params.id);
    const user = await User.findById(userId);

    if (!prompt || !user) {
      return new Response("Prompt or User not found", { status: 404 });
    }

    if (action === "like") {
      const alreadyLiked = prompt.likes.includes(userId);
      const alreadyDisliked = prompt.dislikes.includes(userId);

      if (alreadyLiked) {
        // If already liked, remove the like
        prompt.likes.pull(userId);
        user.likedQuotes.pull(params.id);
      } else {
        // Add the like
        prompt.likes.push(userId);
        user.likedQuotes.push(params.id);

        // If previously disliked, remove the dislike
        if (alreadyDisliked) {
          prompt.dislikes.pull(userId);
          user.dislikedQuotes.pull(params.id);
        }
      }
    } else if (action === "dislike") {
      const alreadyLiked = prompt.likes.includes(userId);
      const alreadyDisliked = prompt.dislikes.includes(userId);

      if (alreadyDisliked) {
        // If already disliked, remove the dislike
        prompt.dislikes.pull(userId);
        user.dislikedQuotes.pull(params.id);
      } else {
        // Add the dislike
        prompt.dislikes.push(userId);
        user.dislikedQuotes.push(params.id);

        // If previously liked, remove the like
        if (alreadyLiked) {
          prompt.likes.pull(userId);
          user.likedQuotes.pull(params.id);
        }
      }
    }

    // Save the changes in the database
    await prompt.save();
    await user.save();

    // Return updated counts for likes and dislikes
    return new Response(JSON.stringify({
      likes: prompt.likes.length,
      dislikes: prompt.dislikes.length,
    }), { status: 200 });
  } catch (error) {
    return new Response("Error updating like/dislike", { status: 500 });
  }
};
