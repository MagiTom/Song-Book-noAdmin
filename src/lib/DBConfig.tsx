export const DBConfig = {
    name: "SongList",
    version: 1,
    objectStoresMeta: [
      {
        store: "songs",
        storeConfig: { keyPath: "id", autoIncrement: true },
        storeSchema: [
          { name: "title", keypath: "title", options: { unique: false } },
          { name: "text", keypath: "text", options: { unique: false } },
          { name: "semitones", keypath: "semitones", options: { unique: false } },
          { name: "id", keypath: "id", options: { unique: false } },
          { name: "link", keypath: "link", options: { unique: false } },
          { name: "category", keypath: "category", options: { unique: false } },
        ],
      },
    ],
  };