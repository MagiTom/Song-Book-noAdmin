import React, { useContext, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { SongItem } from "../constans/songList";
import { useErrorContext } from "./ErrorContext";
import { SongListRight } from "../models/SongListRight.model";
import { db } from "../db/db";

export interface IndexedDbModel {
  songList: SongItem[] | undefined;
  handleInitDB: () => Promise<void>;
  addSong: (song: SongListRight, semitones: number) => Promise<void>;
  getSong: (id: string) => Promise<SongListRight | null>;
  deleteSong: (id: string) => Promise<void>;
  updateSongIndexed: (song: SongListRight, semitones: number) => Promise<void>;
  getSongList: () => Promise<SongListRight[]>;
}

const IndexedDbContext = React.createContext<IndexedDbModel>({
  songList: [],
  handleInitDB: () => Promise.resolve(),
  addSong: () => Promise.resolve(),
  deleteSong: () => Promise.resolve(),
  updateSongIndexed: () => Promise.resolve(),
  getSongList: () => Promise.resolve([]),
  getSong: () => Promise.resolve(null),
});

export const IndexedDbProvider: React.FC<any> = ({ children }) => {
  const { deleteRecord, update, getByID } = useIndexedDB("songs");
  const [songList] = useState<SongListRight[] | undefined>();
  const { addError } = useErrorContext();
  const handleInitDB = async () => {};
  

  const addSong = async (song: SongListRight, semitones: number) => {
      db.songs.add({...song, semitones}).then((res) => {
      }).catch((err: any) => {
        addError(err?.message);
        throw err;
      });
  };

  const getSong = async (id: string): Promise<SongListRight | null> => {
    try {
     return getByID(id).then((song) => {
        console.log(song);
        return song;
      });
    } catch (err: any) {
      addError(err?.message);
      throw err;
    }
  }

  const deleteSong = async (id: string) => {
    try {
      console.log(id);
      deleteRecord(id).then((event) => {
      });
    } catch (err: any) {
      addError(err?.message);
    }
  };

  const updateSongIndexed = async (song: SongListRight, semitones: number) => {
    try {
      update({song, semitones}).then((event) => {
        alert("Edited!");
      });
    } catch (err: any) {
      addError(err?.message);
    }
  };

  const getSongList = async (): Promise<SongListRight[]> => {
 
      return db.songs.toArray();
  
  };

  return (
    <IndexedDbContext.Provider
      value={{
        songList,
        getSong,
        handleInitDB,
        addSong,
        deleteSong,
        updateSongIndexed,
        getSongList,
      }}
    >
      {children}
    </IndexedDbContext.Provider>
  );
};

export const useIndexedDbContext = () => useContext(IndexedDbContext);
