// db.ts
import Dexie, { Table } from 'dexie';
import { SongListRight } from '../models/SongListRight.model';

export class MySubClassedDexie extends Dexie {
  songs!: Table<SongListRight>;
  constructor() {
    super('SongList');
    this.version(1).stores({
      songs: '++id, title, category, text, semitones' // Primary key and indexed props
    });
  }
}


export const db = new MySubClassedDexie();