import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import QuoteCard from "./QuoteCard";

const Profile = ({ name, desc, data, handleEdit, handleDelete }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if not logged in
    if (status === "unauthenticated") {
      router.push('/');
    }
  }, [status, router]);

  // If still loading, you might want to show a loading state here
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <section className='w-full'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>{name} Profile</span>
      </h1>
      <p className='desc text-left'>{desc}</p>

      <div className='mt-10 prompt_layout'>
        {data.map((post) => (
          <QuoteCard
            key={post._id}
            post={post}
            handleEdit={() => handleEdit && handleEdit(post)}
            handleDelete={() => handleDelete && handleDelete(post)}
          />
        ))}
      </div>
    </section>
  );
};

export default Profile;
