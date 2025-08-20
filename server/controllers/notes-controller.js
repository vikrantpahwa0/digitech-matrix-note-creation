const noteService = require("../services/notes-service");

const editNote = async (req, res) => {
  try {
    const note = await noteService.editNote(
      req.body,
      req.user.id,
      req.params.id,
      req.query.roleId,
      req.io
    );
    res.status(201).json({ message: "Note Updated Successfully", note });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addNote = async (req, res) => {
  try {
    const { title, content, viewers, editors } = req.body;
    const note = await noteService.addNote(
      title,
      content,
      req.user.id,
      viewers,
      editors,
      req.io
    );
    res.status(201).json({ message: "Note Added Successfully", note });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await noteService.deleteNote(
      id,
      req.user.id,
      req.query.roleId
    );
    res.status(201).json({ message: "note Deleted Successfully", note });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await noteService.getNote(id, req.user.id, req.query.roleId);
    res.status(201).json({ message: "Note fetched Successfully", note });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await noteService.getNotes(req.user.id, req.query.roleId);
    res.status(201).json({ message: "Notes Fetched Successfully", notes });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await noteService.listRoleBasedUsers(
      req.query.roleCode,
      req.user.id
    );
    res.status(201).json({ message: "Users Fetched Successfully", users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addNote, editNote, deleteNote, getNote, getNotes, getUsers };
