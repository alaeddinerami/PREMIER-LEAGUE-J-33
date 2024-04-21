import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${
  import.meta.env.VITE_API_URL
}/sport/football/scheduled-events/2024-04-14`;

export const fetchMatches = createAsyncThunk(
  "matches/fetchMatches",
  async () => {
    try {
      const response = await axios.get(API_URL, {
      timeout: 30000, // 30 seconds 
    });

      const filteredMatches = response.data.events.filter((match) => {
        return (
          match.tournament.name === "Premier League" &&
          match.roundInfo.round === 33
        );
      });
      console.log(filteredMatches);
      return filteredMatches;
    } catch (error) {
      throw Error("Failed to fetch matches.");
    }
  }
);

const initialState = {
  matches: [],
  loading: false,
  error: null,
};

const matchSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default matchSlice.reducer;
