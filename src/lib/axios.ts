import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to skip baseURL for local API routes
axiosInstance.interceptors.request.use(
  (config) => {
    // If URL starts with /api/, don't use baseURL (it's a local Next.js API route)
    if (config.url?.startsWith('/api/')) {
      // For server-side requests, try to use full URL if available
      // During build time, API routes are not available via HTTP, so this will fail
      // and should be caught by try-catch in generateStaticParams
      if (typeof window === 'undefined') {
        // Try to use server URL, but fallback to empty if not available
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
        config.baseURL = serverUrl || '';
      } else {
        // Client-side: use relative URL
        config.baseURL = '';
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Optional: Add token (if using auth)
 *
 axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
*
*/

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // During build time, API routes are not available, so we get connection errors
    // Provide a more helpful error message
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.message?.includes('Invalid URL')) {
      const message = 'API route not available during build time';
      console.error('Axios error (build time):', message);
      return Promise.reject(new Error(message));
    }
    const message = error?.response?.data?.message || error?.message || 'Something went wrong!';
    console.error('Axios error:', message);
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async <T = unknown>(
  args: string | [string, AxiosRequestConfig]
): Promise<T> => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, {}];

    const res = await axiosInstance.get<T>(url, config);

    return res.data;
  } catch (error) {
    console.error('Fetcher failed:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
} as const;
