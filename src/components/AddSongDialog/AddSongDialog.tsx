import DeleteIcon from "@mui/icons-material/Delete";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useEffect } from "react";
import { Category } from "../../constans/categories";
import { useSongListContext } from "../../context/SongListContext";
import { useSongsDbContext } from "../../context/firebaseContext";
import { SongToAddLeft } from "../../models/SongListLeft.model";
import { SongListRight } from "../../models/SongListRight.model";
import AlertDialog from "../AlertDialog/AlertDialog";
import "./style.scss";

export type SongProps = {
  song?: SongListRight;
  semitones: number;
};

const AddSongDialog: React.FC<SongProps> = (prop) => {
  const [open, setOpen] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [title, setTitle] = React.useState<string>("");
  const [text, setText] = React.useState<string>("");
  const [link, setLink] = React.useState<string | undefined>("");
  const [category, setCategory] = React.useState<string>("");
  const [newCategory, setNewCategory] = React.useState<string>("");
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const {
    addSongListLeft,
    editSong
  } = useSongListContext();
  const { categoriesDb, deleteCategoryDb, addCategoryDb } = useSongsDbContext();

  useEffect(() => {
    if (prop.song) {
      setEditMode(true);
      setTitle(prop.song?.title);
      setText(prop.song.text);
      setLink(prop.song.link)
      setCategory(prop.song.category);
    }
  }, [prop.song]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddSong = async () => {
    setSubmitted(true);
    if (title && category && text) {
      const songToAdd: SongToAddLeft = {
        title,
        category,
        text,
        semitones: prop.semitones,
        link
      };
      addSongListLeft(songToAdd);
      clearData();
      handleClose();
    }
  };

  const handleEditSong = async () => {
    const songToAdd: SongListRight = {
      title,
      category,
      text,
      link,
      id: prop.song?.id || ''
    };
    editSong(songToAdd, prop.semitones);
    clearData();
    handleClose();
  };

  const handleChangeCategory = (event: SelectChangeEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setCategory(event.target.value);
  };
  const addCategory = async () => {
    if(newCategory){
      const categororyItem: Category = {
        name: newCategory,
      };
      await addCategoryDb(categororyItem);
      setCategory(categororyItem.name);
      setNewCategory("");
    }
  };
  const deleteCategory = async (categoryItem: Category) => {
    await deleteCategoryDb(categoryItem);
    console.log(category);
    if (categoryItem.name === category) {
      setCategory("");
    } else {
      setCategory(category);
    }
  };
  const clearData = () => {
    setTitle("");
    setText("");
    setCategory("");
    setSubmitted(false);
  };

  return (
    <React.Fragment>
      {!editMode && (
        <Button variant="outlined" onClick={handleClickOpen}>
          Dodaj utwór
        </Button>
      )}

      {editMode && (
        <Button variant="outlined" onClick={handleClickOpen}>
          Edytuj
        </Button>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>DODAJ UTWÓR</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p className="example">
              <span>Przykład:</span> <br />
              G C Em D <br />
              Mabuhay kayong mga di pangkaraniwan <br />
            </p>
          </DialogContentText>

          <div className="category">
            <FormControl fullWidth error={submitted && !category}>
              <InputLabel id="demo-simple-select-label">kategoria*</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                label="kategoria"
                onChange={(event) => handleChangeCategory(event)}
              >
                {categoriesDb?.map((category) => (
                  <MenuItem value={category.name} key={category.id}>
                    <div className="category__item">
                      <p>{category.name}</p>

                      <AlertDialog
                        confirmAction={() => deleteCategory(category)}
                        button={
                          <IconButton aria-label="delete">
                            <DeleteIcon />
                          </IconButton>
                        }
                      ></AlertDialog>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="category__add">
              <TextField
                fullWidth
                variant="filled"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNewCategory(event.target.value);
                }}
                value={newCategory}
                label="nowa kategoria"
                margin="dense"
                id="category"
              />
              <Button variant="contained" color="success" onClick={addCategory}>
                Dodaj Kategorię
              </Button>
            </div>
          </div>
          <TextField
            className="inputText"
            fullWidth
            variant="standard"
            label="tytuł*"
            margin="dense"
            id="title"
            value={title}
            error={submitted && !title}
            helperText={submitted && !title ? "Podaj Tytuł!" : ""}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTitle(event.target.value);
            }}
          />
          <TextField
            className="inputText"
            margin="dense"
            id="text"
            label="tekst*"
            error={submitted && !text}
            helperText={submitted && !text ? "Podaj tekst!" : ""}
            value={text}
            multiline
            fullWidth
            variant="standard"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setText(event.target.value);
            }}
          />
            <TextField
            className="inputText"
            fullWidth
            variant="standard"
            label="link"
            margin="dense"
            id="link"
            value={link}
            helperText={"(opcjonalnie)"}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setLink(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Anuluj</Button>
          {!editMode && <Button onClick={handleAddSong}>Zapisz</Button>}
          {editMode && <Button onClick={handleEditSong}>Zapisz</Button>}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AddSongDialog;
