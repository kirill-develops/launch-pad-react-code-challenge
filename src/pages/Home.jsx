import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAllPosts, getOne } from '../features/posts/postsSlice';
import { fetchPost, fetchPosts } from '../features/posts/postsActions';
import SearchBar from '../components/SearchBar/SearchBar';
import AddPostModal from '../components/AddPostModal/AddPostModal';
import Card from '../components/Card/Card';

const Home = () => {
  // localized dispatch caller of useDispatch hook
  const dispatch = useDispatch();

  const postSearchedFor = useSelector(getOne);

  // allPosts, postStatus & error copied from the posts slice in Redux
  const allPosts = useSelector(getAllPosts);
  const postStatus = useSelector(state => state.posts.status);
  const error = useSelector(state => state.posts.error);

  // when the page first loads, dispatch fetchPosts to populate our posts Redux state
  useEffect(() => {
    if (postStatus === 'idle') dispatch(fetchPosts())
  }, [postStatus, dispatch])

  // create content variable to transform based on API responses
  let content;

  if (postStatus === 'loading') {
    content = (
      <h1>Loading...</h1>
    )
  } else if (postSearchedFor === 404) {
    content = (
      <div className='card'>
        <h2>No such ID</h2>
      </div>
    )
  }
  else if (postSearchedFor.id) {
    content = <Card post={postSearchedFor} />
  }
  else if (postStatus === 'succeeded') {
    content = allPosts.slice()
      .map(post =>
        <Card key={post.id} post={post} />
      );
  }
  else if (postStatus === 'failed') {
    content = <div>{error}</div>
  }

  return (
    <main className='page-layout'>
      <SearchBar
        reduxAction={fetchPost}
        placeholder="search by ID..."
      />
      <AddPostModal />
      <section className='card-deck'>
        {content}
      </section>
    </main>
  )
};

export default Home;