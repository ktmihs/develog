import axios from 'axios';
import Masonry from 'masonry-layout';

const masonry = {
  itemSelector: '.main-post',
  columnWidth: '.main-post-sizer',
  percentPosition: true,
  gutter: 20,
};

const setPosts = posts =>
  posts
    .map(
      post =>
        `<li class="main-post" data-post-id="${post.postId}">
    <div class="user-info" data-user-id="${post.userId}">
      <button class="avatar-button avatar-button--main" style="background-image:url('${post.userProfile}')"></button>
      <a class="user-nickname">${post.nickname}</a>
    </div>
    <span class="main-post__title">${post.title}</span
    ><span class="main-post__desc">${post.content}</span>
  </li>`
    )
    .join('');

const getMorePostsForMain = async () => {
  try {
    const { data } = await axios.get('/posts');
    if (data.length === 0) {
      return;
    }
    if (data.length < 10) {
      document.querySelector('.see-more').classList.add('hidden');
      document.querySelector('.is-last-post').classList.remove('hidden');
    }
    document.querySelector('.posts-container').innerHTML += setPosts(data);
    new Masonry('.posts-container', masonry);
  } catch (e) {
    console.error(e);
  }
};

const mainPageInitialRender = async $postsContainer => {
  try {
    const { data } = await axios.get('/posts/init');
    const addedHtml = setPosts(data);
    $postsContainer.innerHTML = `<li class="main-post-sizer"></li>` + addedHtml;
    // masonry($postsContainer, document.querySelector('.main-post'), document.querySelector('.main-post-sizer'));
    new Masonry($postsContainer, masonry);
  } catch (e) {
    console.error(e);
  }
};

const addPopularPosts = posts =>
  posts
    .map(
      post =>
        `<li class="post" data-post-id="${post.postId}">
      <span class="post__title">${post.title}</span><span class="post__desc">${post.content}</span>
    </li>`
    )
    .join('');

const setPopularPosts = async ($populaPpostsContainer, userId) => {
  try {
    const { data } = await axios.get(`/develog/${userId}/popularposts`);
    const popularposts = addPopularPosts(data);
    $populaPpostsContainer.innerHTML = popularposts;
  } catch (e) {
    console.error(e);
  }
};

const addUserPosts = posts =>
  posts
    .map(
      post =>
        `<li class="post" data-post-id="${post.postId}">
           <span class="post__title">${post.title}</span>
        <span class="post__desc">${post.content}</span>
         </li>`
    )
    .join('');

const setUserPosts = async ($allPostContainer, userId) => {
  try {
    const { data } = await axios.get(`/develog/${userId}/posts`);

    if (data.length === 0) {
      document.querySelector('.see-more').classList.add('hidden');
      return;
    }
    if (data.length < 8) {
      document.querySelector('.see-more').classList.add('hidden');
    }
    const userPosts = addUserPosts(data);
    $allPostContainer.innerHTML += userPosts;
  } catch (e) {
    console.error(e);
  }
};

const develogPageInitialRender = ($populaPpostsContainer, $allPostContainer, userId) => {
  setPopularPosts($populaPpostsContainer, userId);
  setUserPosts($allPostContainer, userId);
};

const showSearchedPosts = async (searchTitle, $postsContainer) => {
  try {
    const { data } = await axios.get(`/search?title=${searchTitle}`);
    const addedHtml = setPosts(data);
    $postsContainer.innerHTML = `<li class="main-post-sizer"></li>` + addedHtml;
    new Masonry($postsContainer, masonry);
  } catch (e) {
    console.error(e);
  }
};

export default {
  mainPageInitialRender,
  getMorePostsForMain,
  develogPageInitialRender,
  setUserPosts,
  showSearchedPosts,
};