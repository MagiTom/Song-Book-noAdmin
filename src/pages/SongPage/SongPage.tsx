import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddSongDialog from "../../components/AddSongDialog/AddSongDialog";
import AlertDialog from "../../components/AlertDialog/AlertDialog";
import { SongView } from "../../components/SongView/SongView";
import { useSongListContext } from "../../context/SongListContext";
import { useTransposeContext } from "../../context/TransposeContext";
import { auth } from "../../firebase-config";
import "./style.scss";
import { useSongsDbContext } from "../../context/firebaseContext";
import { SongListLeft, SongTextItem } from "../../models/SongListLeft.model";
import { SongListRight } from "../../models/SongListRight.model";
import { useIndexedDbContext } from "../../context/IndexedDbContext";
import { db } from "../../db/db";

export interface SongViewItem extends SongListRight{
  added: boolean;
}

export const SongPage = () => {
  const { id } = useParams();
  const { getSongDb } = useSongsDbContext();
  const [songDB, setSongDB] = useState<SongListLeft>();
  const [song, setSong] = useState<SongViewItem>();
  const {
    songListLeft,
    removeSong,
    setSelectedIndex
  } = useSongListContext();
  const {getSong} = useIndexedDbContext();
  const { setValue } = useTransposeContext();
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    setSelectedIndex(id);
        getSongDb(id || '').then(async (songEl: SongTextItem) => {
          let songItem = songListLeft?.find((song: SongListLeft) => song?.id === id);
          let semitones; 
          if (user) {
            semitones = songItem?.semitones
          } else {
            const songFromIndexed = await db.songs.get(id || '');
            semitones = songFromIndexed ? songFromIndexed.semitones : songItem?.semitones;
          }
          const fullSong: SongViewItem = {...songEl, id: id || '', added: songItem?.added};
          setSongDB(songItem);
          setValue(+semitones);
          let songToShow = fullSong;
          if(!songEl?.text) {
            songToShow = songListLeft?.find((song: SongListLeft) => song?.id === id);
          }
          setSong(songToShow);
        });

     
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, songListLeft]);

  const handleRemove = async () => {
    if(id && song)
   await removeSong(song, songDB?.semitones);
    navigate("/");
  };

  return (
    <div className="song">
      {song && <SongView id={id || ""} song={song}></SongView>}
      {user && (
        <div className="song__actions">
          <AlertDialog
            confirmAction={handleRemove}
            button={
              <Button variant="outlined" color="error">
                Usuń
              </Button>
            }
          ></AlertDialog>
          <AddSongDialog song={song} semitones={songDB?.semitones || 0}></AddSongDialog>
        </div>
      )}
    </div>
  );
};

export default SongPage;
