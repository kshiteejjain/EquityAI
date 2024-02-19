import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
    stockFinancial: [],
    status: 'idle',
    error: null,
};

export const fetchStockFinancial = createAsyncThunk(
    'stockFinancial',
    async () => {
      try {
        const response = await axios.get('https://api.polygon.io/vX/reference/financials?apiKey=2tETzCaKCfgvP8zon3uHg1QiFh1cI9uH');
        console.log('stock response', response);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 429) {
          const retryAfterSeconds = parseInt(error.response.headers['retry-after']) || 5;
          await new Promise(resolve => setTimeout(resolve, retryAfterSeconds * 1000));
          return fetchStockFinancial(); // Retry the request recursively
        } else {
          throw error;
        }
      }
    }
  );

const fetchStockFinancialSlice = createSlice({
    name: 'stockFinancial',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStockFinancial.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchStockFinancial.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.stockFinancial = action.payload;
            })
            .addCase(fetchStockFinancial.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export default fetchStockFinancialSlice.reducer;
