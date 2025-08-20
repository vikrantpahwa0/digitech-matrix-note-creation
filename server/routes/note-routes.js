const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notes-controller.js");
const { validateNoteAddition } = require("../middlewares/validate-note.js");
const authenticateUser = require("../middlewares/auth-middleware");

router.post(
  "/add-note",
  authenticateUser,
  validateNoteAddition,
  notesController.addNote
);
router.put("/edit-note/:id", authenticateUser, notesController.editNote);
router.delete("/delete-note/:id", authenticateUser, notesController.deleteNote);
router.get("/get-note/:id", authenticateUser, notesController.getNote);
router.get("/get-notes", authenticateUser, notesController.getNotes);
router.get("/get-users", authenticateUser, notesController.getUsers);

module.exports = router;
