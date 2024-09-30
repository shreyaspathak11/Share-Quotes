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
  const [loading, setLoading] = useState(false); // Loader state
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPosts = async () => {
    setLoading(true); // Start loader before fetching
    const response = await fetch("/api/prompt");
    const data = await response.json();
    setAllPosts(data);
    setLoading(false); // Stop loader after fetching
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
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

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        setLoading(true); // Start loader during search
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
        setLoading(false); // Stop loader after search results
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    setLoading(true); // Start loader for tag search
    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
    setLoading(false); // Stop loader after filtering by tag
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

      {/* Loader */}
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

      {/* All Prompts or Search Results */}
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
