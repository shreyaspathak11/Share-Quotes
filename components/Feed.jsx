"use client";

import { useState, useEffect } from "react";
import QuoteCard from "./QuoteCard";

const QuoteCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <QuoteCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  // Function to shuffle an array
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const fetchPosts = async () => {
    setLoading(true);
    const response = await fetch("/api/prompt");
    const data = await response.json();

    // Shuffle posts before setting them to state
    const shuffledData = shuffleArray(data);

    setAllPosts(shuffledData);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i");
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        setLoading(true);
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
        setLoading(false);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    setLoading(true);
    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
    setLoading(false);
  };

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>

      {loading && (
        <div className='w-full flex-center'>
          <img
            src='/assets/icons/loader.svg'
            width={50}
            height={50}
            alt='loader'
            className='object-contain'
          />
        </div>
      )}

      {!loading && (searchText ? (
        <QuoteCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <QuoteCardList data={allPosts} handleTagClick={handleTagClick} />
      ))}
    </section>
  );
};

export default Feed;
