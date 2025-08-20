import { combineReducers } from "redux";
import {
  getNotesReducer,
  authReducer,
  authLoginReducer,
  addNoteReducer,
  noteDetailsReducer,
  notesDeleteReducer,
  notesUpdateReducer,
} from "./reducer";

const rootReducer = combineReducers({
  getNotes: getNotesReducer,
  auth: authReducer,
  login: authLoginReducer,
  addNote: addNoteReducer,
  noteDetails: noteDetailsReducer,
  deleteNote: notesDeleteReducer,
  updateNote: notesUpdateReducer,
});

export default rootReducer;
