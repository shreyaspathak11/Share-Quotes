import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const QuoteCard = ({ post, handleEdit, handleDelete, handleTagClick }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const cardRef = useRef(null);

  const [copied, setCopied] = useState("");
  const [likes, setLikes] = useState(post.likes.length); // Initialize likes count
  const [dislikes, setDislikes] = useState(post.dislikes.length); // Initialize dislikes count
  const [liked, setLiked] = useState(post.likes.includes(session?.user.id)); // Check if user liked the post
  const [disliked, setDisliked] = useState(post.dislikes.includes(session?.user.id)); // Check if user disliked the post
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const handleProfileClick = () => {
    if (post.creator._id === session?.user.id) return router.push("/profile");
    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  };

  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleLike = async () => {
    // Optimistically update the UI
    const newLikesCount = liked ? likes - 1 : likes + 1;
    const newDislikesCount = disliked ? dislikes - 1 : dislikes;

    setLikes(newLikesCount);
    setDislikes(newDislikesCount);
    setLiked(!liked);
    if (disliked) setDisliked(false); // Reset disliked if liked

    try {
      setLoading(true); // Set loading state to true
      const response = await fetch(`/api/prompt/${post._id}/likeDislike`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user.id,
          action: liked ? "unlike" : "like", // Toggle action
        }),
      });

      if (!response.ok) {
        // If there's an error, revert the optimistic update
        setLikes(likes);
        setDislikes(dislikes);
        setLiked(liked);
        if (disliked) setDisliked(true); // Reset disliked if needed
      }
    } catch (error) {
      console.error("Error updating like:", error);
      // If error occurs, revert the optimistic update
      setLikes(likes);
      setDislikes(dislikes);
      setLiked(liked);
      if (disliked) setDisliked(true); // Reset disliked if needed
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleDislike = async () => {
    // Optimistically update the UI
    const newDislikesCount = disliked ? dislikes - 1 : dislikes + 1;
    const newLikesCount = liked ? likes - 1 : likes;

    setDislikes(newDislikesCount);
    setLikes(newLikesCount);
    setDisliked(!disliked);
    if (liked) setLiked(false); // Reset liked if disliked

    try {
      setLoading(true); // Set loading state to true
      const response = await fetch(`/api/prompt/${post._id}/likeDislike`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user.id,
          action: disliked ? "undislike" : "dislike", // Toggle action
        }),
      });

      if (!response.ok) {
        // If there's an error, revert the optimistic update
        setDislikes(dislikes);
        setLikes(likes);
        setDisliked(disliked);
        if (liked) setLiked(true); // Reset liked if needed
      }
    } catch (error) {
      console.error("Error updating dislike:", error);
      // If error occurs, revert the optimistic update
      setDislikes(dislikes);
      setLikes(likes);
      setDisliked(disliked);
      if (liked) setLiked(true); // Reset liked if needed
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div ref={cardRef} className={`prompt_card ${visible ? 'visible' : ''}`}>
      <div className='flex justify-between items-start gap-5'>
        <div
          className='flex-1 flex justify-start items-center gap-3 cursor-pointer'
          onClick={handleProfileClick}
        >
          <Image
            src={post.creator?.image || '/logo.svg'}
            alt='user_image'
            width={40}
            height={40}
            className='rounded-full object-contain'
          />

          <div className='flex flex-col'>
            <h3 className='font-satoshi font-semibold text-gray-900'>
              {post.creator?.username}
            </h3>
            <p className='font-inter text-sm text-gray-500'>
              {post.creator?.email}
            </p>
          </div>
        </div>

        <div className='copy_btn' onClick={handleCopy}>
          <Image
            src={copied === post.prompt ? "/assets/icons/tick.svg" : "/assets/icons/copy.svg"}
            alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
            width={12}
            height={12}
          />
        </div>
      </div>

      <p className='my-4 font-satoshi text-sm text-gray-700'>{post.prompt}</p>
      <p
        className='font-inter text-sm blue_gradient cursor-pointer'
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        {post.tag}
      </p>

      {/* Like and Dislike Buttons */}
      <div className='flex justify-between items-center mt-4'>
        <div className='flex items-center'>
          <button
            onClick={handleLike}
            className={`like_btn ${liked ? 'active' : ''}`}
            disabled={loading} // Disable button while loading
          >
            <Image
              src="/assets/icons/like.svg" // Adjust the path if needed
              alt="Like"
              width={20} // Adjust size as needed
              height={20} // Adjust size as needed
            />
          </button>
          {likes > 0 && <span className="ml-2">{likes}</span>} {/* Only show likes count if greater than 0 */}
        </div>

        <div className='flex items-center'>
          <button
            onClick={handleDislike}
            className={`dislike_btn ${disliked ? 'active' : ''}`}
            disabled={loading} // Disable button while loading
          >
            <Image
              src="/assets/icons/dislike.svg" // Adjust the path if needed
              alt="Dislike"
              width={20} // Adjust size as needed
              height={20} // Adjust size as needed
            />
          </button>
          {dislikes > 0 && <span className="ml-2">{dislikes}</span>} {/* Only show dislikes count if greater than 0 */}
        </div>
      </div>

      {session?.user.id === post.creator?._id && pathName === "/profile" && (
        <div className='mt-5 flex-center gap-4 border-t border-gray-100 pt-3'>
          <p
            className='font-inter text-sm green_gradient cursor-pointer'
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className='font-inter text-sm orange_gradient cursor-pointer'
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default QuoteCard;
