import { createSlice, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Ticker {
    name: string;
    ticker: string;
    cik: string;
    composite_figi: string;
    share_class_figi: string;
    currency_name: string;
    tickers: {
        retryCount: number;
        // other properties...
      };
}

interface TickersState {
    tickers: Ticker[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    retryCount: number;
    
}

const initialState: TickersState = {
    tickers: [],
    status: 'idle',
    error: null,
    retryCount: 0, // Initialize retry count
};

export const fetchTickers: AsyncThunk<any, void, {}> = createAsyncThunk(
    'tickers',
    async (_, { getState }) => {
        const { retryCount } = (getState() as Ticker).tickers;
        try {
            const response = await axios.get('https://api.polygon.io/v3/reference/tickers?active=true&apiKey=2tETzCaKCfgvP8zon3uHg1QiFh1cI9uH');
            return response.data.results; // Return serializable data
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 429 && retryCount === 0) {
                // If it's the first retry, update retryCount and retry the request
                const retryAfterSeconds = Math.pow(2, error.response.headers['retry-after'] || 5);
                await new Promise(resolve => setTimeout(resolve, retryAfterSeconds * 1000));
                return fetchTickers();
            } else {
                throw error;
            }
        }
    }
);

const fetchTickersSlice = createSlice({
    name: 'tickers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTickers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tickers = action.payload;
            })
            .addCase(fetchTickers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export default fetchTickersSlice.reducer;
