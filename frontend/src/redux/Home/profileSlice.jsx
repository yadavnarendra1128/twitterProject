import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchProfile = createAsyncThunk(
  "accounts/fetchProfile",
  async (username, { rejectWithValue }) => {
    try {
      const response = await axiosInstance(`/api/users/profile/${username}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTweets = createAsyncThunk(
  "accounts/fetchTweets",
  async (username, { rejectWithValue }) => {
    try {
      const response = await axiosInstance(`/api/posts/user/${username}`);
      return response.data?.posts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLikedPosts = createAsyncThunk(
  "accounts/fetchLikedPosts",
  async (username, { rejectWithValue }) => {
    try {
      const response = await axiosInstance(`/api/posts/liked/${username}`);
      return response.data?.likedPosts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    tweets: [],
    likedPosts: [],
    loading: false,
    error: null,
  },
  reducers: {
    handleProfileFollowingStatus: (state, action) => {
      state.loading = true;
      const profileId = action.payload;
      state.profile.following.includes(profileId)
        ? (state.profile.following = state.profile.following.filter(
            (followerId) => followerId !== profileId
          ))
        : (state.profile.following = [...state.profile.following, profileId]);
      state.loading = false;
    },

    handleProfileFollowersStatus: (state, action) => {
      const userId = action.payload;
      state.profile.followers.includes(userId)
        ? (state.profile.followers = state.profile.followers.filter(
            (followerId) => followerId !== userId
          ))
        : (state.profile.followers = [...state.profile.followers, userId]);
    },

    deletePostFromTweets: (state, action) => {
      state.tweets = state.tweets.filter((post, index) => {
        if (post._id !== action.payload) {
          return post;
        }
      });
    },

    deletePostFromLikedPosts: (state, action) => {
      state.likedPosts = state.likedPosts.filter((post, index) => {
        if (post._id !== action.payload) {
          return post;
        }
      });
    },

    updateProfileLike: (state, action) => {
      const { postId, userId } = action.payload;
      state.tweets = state.tweets.map((p) => {
        if (p._id === postId) {
          const updatedLikes = p.likes.includes(userId)
            ? p.likes.filter((id) => id !== userId) // Unlike
            : [...p.likes, userId]; // Like
          return { ...p, likes: updatedLikes };
        }
        return p;
      });

      state.likedPosts = state.likedPosts.map((p) => {
        if (p._id === postId) {
          const updatedLikes = p.likes.includes(userId)
            ? p.likes.filter((id) => id !== userId) // Unlike
            : [...p.likes, userId]; // Like
          return { ...p, likes: updatedLikes };
        }
        return p;
      });
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTweets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTweets.fulfilled, (state, action) => {
        state.loading = false;
        state.tweets = action.payload;
      })
      .addCase(fetchTweets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchLikedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.likedPosts = action.payload;
      })
      .addCase(fetchLikedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {handleProfileFollowingStatus,handleProfileFollowersStatus,deletePostFromLikedPosts,deletePostFromTweets,updateProfileLike} = profileSlice.actions;
export default profileSlice.reducer;
