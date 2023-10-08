import {
  createSlice,
  configureStore,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { fetchAuth } from "./getAuth";
import axios from "axios";

const initialState = {
  songs: [],
  link: [],
  auth: null,
};

export const addSong = createAsyncThunk(
  "songs/addSong",
  async (songName, { getState }) => {
    try {
      const state = getState();
      const apiUrl = `https://api.spotify.com/v1/search?q=${songName}&type=track`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${state.auth}`,
        },
      });
      return {
        songName,
        link: response.data.tracks.items[0].album.external_urls.spotify,
      };
    } catch (error) {
      console.error(error);
    }
  }
);

export const updateSong = createAsyncThunk(
  "songs/updateSong",
  async (songData, { getState }) => {
    try {
      const state = getState();
      const index = state.songs.findIndex(
        (songName) => songName === songData.oldSongName
      );
      if (index === -1) {
        return;
      }
      const apiUrl = `https://api.spotify.com/v1/search?q=${songData.songName}&type=track`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${state.auth}`,
        },
      });
      return {
        songName: songData.songName,
        index: index,
        link: response.data.tracks.items[0].album.external_urls.spotify,
      };
    } catch (error) {
      console.error(error);
    }
  }
);

const songsSlice = createSlice({
  name: "songs",
  initialState: initialState,
  reducers: {
    removeSong(state, action) {
      const index = state.songs.indexOf(action.payload);
      if (index > -1) {
        state.songs.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuth.fulfilled, (state, action) => {
        state.auth = action.payload;
      })
      .addCase(addSong.fulfilled, (state, action) => {
        state.songs.push(action.payload.songName);
        state.link.push(action.payload.link);
      })
      .addCase(updateSong.fulfilled, (state, action) => {
        state.songs[action.payload.index] = action.payload.songName;
        state.link[action.payload.index] = action.payload.link;
      });
  },
});

const store = configureStore({
  reducer: songsSlice.reducer,
});

export const songsActions = songsSlice.actions;

export default store;
