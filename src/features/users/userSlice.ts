import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  id: number;
  avatar_url: string;
  login: string;
  type: string;
  score: number;
}

interface UserState {
  users: User[];
  status: "idle" | "loading" | "failed";
  total_count: number;
}

const initialState: UserState = {
  users: [],
  status: "idle",
  total_count: 0,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({
    query,
    page,
    per_page,
  }: {
    query: string;
    page: number;
    per_page: number;
  }) => {
    const response = await axios.get(`https://api.github.com/search/users`, {
      params: {
        q: query,
        page,
        per_page,
      },
    });
    return response.data;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reset: (state) => {
      state.users = [];
      state.total_count = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "idle";
        state.users = action.payload.items;
        state.total_count = action.payload.total_count;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { reset } = userSlice.actions;

export default userSlice.reducer;
