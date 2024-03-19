import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface News {
    name?: string;
    logo_url?: string;
    title?: string;
    description?: string,
    keywords?: string,
    author?: string;
    published_utc: string;
    article_url?: string;
    image_url?: string
}

interface NewsState {
    news: News[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: NewsState = {
    news: [],
    status: 'idle',
    error: null,
};

export const fetchNews: any = createAsyncThunk(
    'news',
    async () => {
      try {
        const response = await axios.get(`https://api.polygon.io/v2/reference/news?limit=100&apiKey=${import.meta.env.VITE_POLYGON_API_KEY}`);
        console.log(response)
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 429) {
          const retryAfterSeconds = parseInt(error.response.headers['retry-after']) || 5;
          await new Promise(resolve => setTimeout(resolve, retryAfterSeconds * 1000));
          return fetchNews(); // Retry the request recursively
        } else {
          throw error;
        }
      }
    }
  );

const fetchNewsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNews.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNews.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.news = action.payload;
            })
            .addCase(fetchNews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export default fetchNewsSlice.reducer;
