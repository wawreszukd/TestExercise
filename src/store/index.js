import { createSlice, configureStore, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, fetchAuth } from "./getAuth";
import axios from "axios";
import qs from 'qs';
const initialState = {
    songs: [],
    link: []
}
export const addSong = createAsyncThunk(
    'songs/addSong',
    async (songName, { getState }) => {
      const auth = await getAuth();
      const apiUrl = `https://api.spotify.com/v1/search?q=${songName}&type=track`;
      const response = await axios.get(apiUrl, {
        headers:{
          'Authorization': `Bearer ${auth}`
        }
      });
      return {
        songName,
        link: JSON.stringify(response.data.tracks.items[0].album.external_urls.spotify)
      };
    }
  );
  export const updateSong = createAsyncThunk(
    'songs/updateSong',
    async (songData, { getState }) => {
      const state = getState();
      const auth = await getAuth();
      const index = state.songs.findIndex(song => song === songData.oldName);
      if (index !== -1) {
        const apiUrl = `https://api.spotify.com/v1/search?q=${songData.song}&type=track`;
        const response = await axios.get(apiUrl, {
          headers:{
            'Authorization': `Bearer ${auth}`
          }
        });
        console.log(songData.song)
        return {
          songName: songData.song,
          index: index,
          link: JSON.stringify(response.data.tracks.items[0].album.external_urls.spotify)
        };
      }
    }
  );


const songsSlice = createSlice({
    name: 'songs',
    initialState: initialState,
    reducers:{
        removeSong(state, action){
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
          .addCase(updateSong.fulfilled,(state, action)=>{
            state.songs[action.payload.index] = action.payload.songName
            state.link[action.payload.index] = action.payload.link;
          })
      }
})

const store = configureStore({
    reducer: songsSlice.reducer
})

export const songsActions = songsSlice.actions;

export default store;