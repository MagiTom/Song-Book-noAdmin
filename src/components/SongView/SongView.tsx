import { useEffect, useState } from "react";
import { SongItem, SongPageItem } from "../../constans/songList";
import { Chords } from "../Chords/Chords";
import Lyrics from "../Lyrics/Lyrics";
import { useTransposeContext } from "../../context/TransposeContext";
import { TransposeControl } from "../TranponseControl/TransposeControl";
import SongTitle from "../SongTitle/SongTitle";
import "./style.scss";

export const SongView: React.FC<{song: SongPageItem, isPrintMode?: boolean}> = (props, isPrintMode = false) => {
    const [songArr, setSongArr] = useState<string[] | undefined>([]);
    const [songItem, setSongItem] = useState<SongPageItem>();
    const { semitones } = useTransposeContext();

    useEffect(() => {
        const songItemEl = props.song;
        setSongItem(songItemEl);
        const pre = songItemEl?.text;
        let arr: string[] | undefined = pre?.split("\n");
        console.log('text', arr)
        setSongArr(arr);
      }, [props])
    const changeSemiTones = (ev: number)=>{
        console.log(ev)
    }
    return (
        <div className="song page-break">
        <div className="song__title">
        { !props.isPrintMode && <TransposeControl semitones={semitones} onSemitonesChange={changeSemiTones}></TransposeControl> }
         {songItem && <SongTitle goToPage={()=> {}} key={songItem?.id} addSongToList={()=>{}} song={songItem} />}

          </div>
        <div className="song__items">
          {songArr && songArr.map((songEl, index) => (
            <div key={songEl + index}>
             {index % 2 === 0 && <Chords>{songEl}</Chords> }
             {index % 2 !== 0 &&  <Lyrics>{songEl}</Lyrics> }
            </div>
          ))}
        </div>
        </div>
    );
}