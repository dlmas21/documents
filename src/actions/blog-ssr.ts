import axios, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

export async function getPosts() {
  const res = await axios.get(endpoints.post.list);

  return res.data;
}

// ----------------------------------------------------------------------

export async function getPost(title: string) {
  if (!title) {
    throw new Error('Title is required');
  }

  const URL = `${endpoints.post.details}?title=${encodeURIComponent(title)}`;

  const res = await axios.get(URL);

  return res.data;
}

// ----------------------------------------------------------------------

export async function getLatestPosts(title: string) {
  if (!title) {
    throw new Error('Title is required');
  }

  const URL = `${endpoints.post.latest}?title=${encodeURIComponent(title)}`;

  const res = await axios.get(URL);

  return res.data;
}
