import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface TickerDetail {
  // Define your ticker detail properties here
}

interface FetchTickerDetailState {
  tickerDetail: TickerDetail | null;
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
}

const initialState: FetchTickerDetailState = {
  tickerDetail: null,
  loading: 'idle',
  error: null,
};

export const fetchTickerDetail = createAsyncThunk(
  'tickerDetail',
  async (tickerId: string, { rejectWithValue, getState }) => {
    const state = getState();
    const hasReceivedResponse = state.tickerDetail.tickerDetail !== null; // Assuming this is how you track if a response has been received

    try {
      const response = await axios.get(`https://api.polygon.io/v3/reference/tickers/${tickerId}?apiKey=2tETzCaKCfgvP8zon3uHg1QiFh1cI9uH`);
      console.log('Detailssss response', response);
      return response?.data; // Only return serializable data
    } catch (error) {
      if (error.response && error.response.status === 429 && !hasReceivedResponse) {
        // Implement exponential backoff for retries
        const retryAfterSeconds = Math.pow(2, error.response.headers['retry-after']) || 5;
        await new Promise(resolve => setTimeout(resolve, retryAfterSeconds * 1000));
        // Retry the request by calling fetchTickerDetail again
        return fetchTickerDetail(tickerId);
      } else {
        // Return the error for handling by the rejected action
        return rejectWithValue(error.message);
      }
    }
  }
);

const fetchTickerDetailSlice = createSlice({
  name: 'tickerDetail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickerDetail.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchTickerDetail.fulfilled, (state, action) => {
        state.loading = 'fulfilled';
        state.tickerDetail = action.payload;
        state.error = null;
      })
      .addCase(fetchTickerDetail.rejected, (state, action) => {
        state.loading = 'rejected';
        state.error = action.error.message ?? 'An error occurred';
      });
  },
});

export default fetchTickerDetailSlice.reducer;
