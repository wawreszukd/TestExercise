import { useDispatch } from "react-redux";
import { songsActions, updateSong } from "../store";
import style from "./Song.module.css";
import { useState } from "react";




export default function Song(props) {
    const [toggled, setToggled] = useState(false);
    const [input, setInput] = useState('');
    const dispatch = useDispatch();
    const { song } = props;

    
    const handleDelete = () => {
        dispatch(songsActions.removeSong(song));
    };

    const handleUpdate = () => {
        setToggled(!toggled);
    };

    const inputChange = (e) => {
        setInput(e.target.value);
    }

    const handleClick = () => {
        dispatch(updateSong({ oldName: song, song: input }));
        setInput('');
        setToggled(!toggled);
    };

    const handleEnter = (e) => {
        if (e.key === "Enter") {
            handleClick();
        }
    }

    return (
        <div>
            <li className={`${style.element} list-group-item`}>
            {song} <a rel="noopener noreferrer" target="_blank" href={`${props.link.slice(1,-1)}`}>Click</a>
                <button className={`btn btn-primary ${style.button}`} onClick={handleUpdate}>
                    UPDATE
                </button>
                <button className={`btn btn-danger ${style.button}`} onClick={handleDelete}>
                    X
                </button>
            </li>
            {toggled && <div> <input placeholder="New name..." onKeyDown={handleEnter} onChange={inputChange} /> <button onClick={handleClick}>OK</button></div>}
        </div>
    );
}