import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import userReducer, { fetchUsers, reset } from "../../features/users/userSlice";
import { RootState } from "../../app/store";

describe("userSlice", () => {
  const initialState = {
    users: [],
    status: "idle",
    total_count: 0,
  };

  const mock = new MockAdapter(axios);
  let store: ReturnType<typeof configureStore<RootState>>;

  beforeEach(() => {
    store = configureStore({ reducer: { users: userReducer } });
    mock.reset();
  });

  it("should handle initial state", () => {
    expect(store.getState().users).toEqual(initialState);
  });

  it("should handle fetchUsers pending", async () => {
    const pendingAction = fetchUsers.pending("users/fetchUsers", {
      query: "test",
      page: 1,
      per_page: 10,
    });
    store.dispatch(pendingAction);
    expect(store.getState().users.status).toBe("loading");
  });

  it("should handle fetchUsers fulfilled", async () => {
    const responseData = {
      items: [
        {
          id: 1,
          avatar_url: "url",
          login: "testuser",
          type: "User",
          score: 100,
        },
      ],
      total_count: 1,
    };
    mock.onGet("https://api.github.com/search/users").reply(200, responseData);

    await store.dispatch(fetchUsers({ query: "test", page: 1, per_page: 10 }));

    expect(store.getState().users.status).toBe("idle");
    expect(store.getState().users.users).toEqual(responseData.items);
    expect(store.getState().users.total_count).toBe(responseData.total_count);
  });

  it("should handle fetchUsers rejected", async () => {
    mock.onGet("https://api.github.com/search/users").networkError();

    await store.dispatch(fetchUsers({ query: "test", page: 1, per_page: 10 }));

    expect(store.getState().users.status).toBe("failed");
    expect(store.getState().users.users).toEqual([]);
    expect(store.getState().users.total_count).toBe(0);
  });

  it("should handle reset action", () => {
    const responseData = {
      items: [
        {
          id: 1,
          avatar_url: "url",
          login: "testuser",
          type: "User",
          score: 100,
        },
      ],
      total_count: 1,
    };

    store.dispatch(
      fetchUsers.fulfilled(responseData, "users/fetchUsers", {
        query: "test",
        page: 1,
        per_page: 10,
      })
    );
    expect(store.getState().users.users).toEqual(responseData.items);

    store.dispatch(reset());
    expect(store.getState().users).toEqual(initialState);
  });
});
