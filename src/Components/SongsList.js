import Song from "./Song";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAuth } from "../store/getAuth";
import style from "./SongsList.module.css";

import { addSong } from "../store";
export default function SongsList() {
  const dispatch = useDispatch();
  const [songInput, setSongInput] = useState("");
  const songs = useSelector((state) => state.songs);
  const links = useSelector((state) => state.link);


  useEffect(()=>{
    dispatch(fetchAuth());
  },[dispatch]);
  const inputHandler = (e) => {
    setSongInput(e.target.value);
  };
  const clickHandler = () => {
    dispatch(addSong(songInput));
    setSongInput("");
  };
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      clickHandler();
    }
  };
  return (
    <div className="centered">
      <ul className={`${style.list} list-group`}>
        {songs && links  && songs.map((song, index) => {
          return (
            <div key={index}>
              <Song song={song} link={links[index]} />
            </div>
          );
        })}
      </ul>
      <div className={`input-group mb-3 ${style.inputField}`}>
        <input
          type="text"
          className="form-control"
          placeholder="Enter song name"
          aria-label="enter name"
          aria-describedby="basic-addon2"
          onChange={inputHandler}
          onKeyDown={handleEnter}
          value={songInput}
        />
        <div className="input-group-append">
          <button onClick={clickHandler} className="btn btn-outline-secondary" type="button">
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
