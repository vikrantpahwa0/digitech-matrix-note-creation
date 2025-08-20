import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { addNote, getNoteDetails, updateNote } from "../redux/actions";

export default function NoteForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const roleIdFromState = location.state?.roleId;

  const token =
    useSelector((state) => state.login?.token) || localStorage.getItem("token");

  const { note, loading, error } = useSelector(
    (state) => state.noteDetails || {}
  );

  const [formData, setFormData] = useState({ title: "", content: "" });
  const [viewers, setViewers] = useState([]);
  const [editors, setEditors] = useState([]);
  const [selectedViewers, setSelectedViewers] = useState([]);
  const [selectedEditors, setSelectedEditors] = useState([]);

  const isEditing = !!id;

  // Determine if dropdowns should be shown
  const showDropdowns = !isEditing || roleIdFromState === 1;

  // Fetch note details if editing
  useEffect(() => {
    if (isEditing && token) {
      dispatch(getNoteDetails(id, token, roleIdFromState));
    }
  }, [dispatch, id, isEditing, token, roleIdFromState]);

  // Prefill formData when note details arrive
  useEffect(() => {
    if (note && isEditing) {
      setFormData({ title: note.title || "", content: note.content || "" });
      setSelectedViewers(note.viewers || []);
      setSelectedEditors(note.editors || []);
    }
  }, [note, isEditing]);

  // Fetch users for viewers and editors dropdowns (only if dropdowns should be shown)
  useEffect(() => {
    const fetchRoleUsers = async (roleCode, setUsers) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL_LOCAL}note/get-users`,
          {
            params: { roleCode },
            headers: { Authorization: token },
          }
        );
        setUsers(response.data.users); // expects [{id,name},...]
      } catch (err) {
        console.error(`Error fetching ${roleCode} users:`, err);
      }
    };

    if (token && showDropdowns) {
      fetchRoleUsers("VW", setViewers);
      fetchRoleUsers("ED", setEditors);
    }
  }, [token, showDropdowns]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      ...formData,
      viewers: selectedViewers,
      editors: selectedEditors,
    };

    if (isEditing) {
      dispatch(updateNote(id, payload, token, roleIdFromState));
    } else {
      dispatch(addNote(payload, token));
    }

    navigate("/");
  };

  const MenuProps = {
    PaperProps: { style: { maxHeight: 200 } },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        p: 3,
      }}
    >
      <AppBar
        position="fixed"
        sx={{ width: "100%", backgroundColor: "#1976D2" }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h6" noWrap sx={{ fontWeight: "bold" }}>
            📝 {isEditing ? "Edit Note" : "Add a New Note"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />

      <Paper sx={{ p: 3, mt: 5, maxWidth: 500, borderRadius: 2, boxShadow: 3 }}>
        {loading && <CircularProgress />}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && (
          <form onSubmit={handleSubmit}>
            <TextField
              margin="dense"
              label="Title *"
              fullWidth
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              label="Content *"
              fullWidth
              multiline
              rows={4}
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />

            {/* Viewers and Editors Multi-Select */}
            {showDropdowns && (
              <>
                {/* Viewers Multi-Select */}
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Viewers</InputLabel>
                  <Select
                    multiple
                    value={selectedViewers}
                    onChange={(e) => setSelectedViewers(e.target.value)}
                    input={<OutlinedInput label="Viewers" />}
                    renderValue={(selected) =>
                      selected
                        .map((id) => viewers.find((v) => v.id === id)?.name)
                        .join(", ")
                    }
                    MenuProps={MenuProps}
                  >
                    {viewers.map((v) => (
                      <MenuItem key={v.id} value={v.id}>
                        <Checkbox checked={selectedViewers.includes(v.id)} />
                        <ListItemText primary={v.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Editors Multi-Select */}
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Editors</InputLabel>
                  <Select
                    multiple
                    value={selectedEditors}
                    onChange={(e) => setSelectedEditors(e.target.value)}
                    input={<OutlinedInput label="Editors" />}
                    renderValue={(selected) =>
                      selected
                        .map((id) => editors.find((e) => e.id === id)?.name)
                        .join(", ")
                    }
                    MenuProps={MenuProps}
                  >
                    {editors.map((e) => (
                      <MenuItem key={e.id} value={e.id}>
                        <Checkbox checked={selectedEditors.includes(e.id)} />
                        <ListItemText primary={e.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button type="submit" variant="contained" color="primary">
                {isEditing ? "Update" : "Submit"}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
}
