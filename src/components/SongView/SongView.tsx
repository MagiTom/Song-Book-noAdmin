import { useEffect, useRef, useState } from "react";
import { useTransposeContext } from "../../context/TransposeContext";
import { Chords } from "../Chords/Chords";
import Lyrics from "../Lyrics/Lyrics";
import { TransposeControl } from "../TranponseControl/TransposeControl";
import "./style.scss";
import { useSongListContext } from "../../context/SongListContext";
import { SongListRight } from "../../models/SongListRight.model";
import { IconButton, Tooltip } from "@mui/material";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import AddIcon from "@mui/icons-material/Add";
import { SongViewItem } from "../../pages/SongPage/SongPage";

export const SongView: React.FC<{
  song: SongViewItem;
  id: string;
  isPrintMode?: boolean;
}> = (props) => {
  const [songArr, setSongArr] = useState<string[] | undefined>([]);
  const [songItem, setSongItem] = useState<SongListRight>();
  const { updateSong, addSongRight } = useSongListContext();
  const { semitones } = useTransposeContext();
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<any>(null);

  const columnCountStyle = isOverflowing
    ? { columnCount: 2 }
    : { columnCount: 1 };

  useEffect(() => {
    const songItemEl: any = { ...props.song };
    delete songItemEl.added;
    setSongItem(songItemEl);
    const pre = props.song?.text;
    let arr: string[] | undefined = pre?.split("\n");
    for (let i = 0; i < arr?.length - 1; i++) {
      if (
        arr[i].trim() === "" &&
        arr[i + 1].trim() !== "" &&
        arr[i - 1].trim() !== ""
      ) {
        arr.splice(i + 1, 0, "");
        i++;
      }
    }
    setSongArr(arr);
  }, [props.song.id]);
  const changeSemiTones = (ev: number) => {
    updateSong(props.song, ev);
  };

  const addToList = (ev: React.MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    addSongRight(songItem);
  };

  return (
    <div className="song page-break" ref={textRef}>
      <div className="song__title">
        {!props.isPrintMode && (
          <TransposeControl
            semitones={semitones}
            onSemitonesChange={changeSemiTones}
          ></TransposeControl>
        )}
        {songItem && <h3>{songItem.title}</h3>}
        {!props.isPrintMode && (
          <Tooltip title="Podziel na dwie kolumny" arrow>
            <IconButton
              onClick={() => setIsOverflowing(!isOverflowing)}
              aria-label="split"
              color="primary"
            >
              <VerticalSplitIcon />
            </IconButton>
          </Tooltip>
        )}
        <IconButton
          sx={{ padding: 0.5 }}
          className={props.song.added ? "hidden" : ""}
          onClick={addToList}
          color="secondary"
          aria-label="add an alarm"
        >
          <AddIcon />
        </IconButton>
      </div>
      <div className="song__items" style={columnCountStyle}>
        {songArr &&
          songArr.map((songEl, index) => (
            <div className="song__item" key={songEl + index}>
              {(index % 2 === 0 || songEl.includes("/")) && (
                <Chords>{songEl}</Chords>
              )}
              {/* {songEl.trim() === "" && index % 2 !== 0 && <br />} */}
              {index % 2 !== 0 && !songEl.includes("/") && (
                <Lyrics>{songEl}</Lyrics>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
