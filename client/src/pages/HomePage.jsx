import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Tooltip,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { getNotes, deleteNote } from "../redux/actions";
import NotificationsBell from "./NotificationBell";

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { notes, loading, error } = useSelector((state) => state.getNotes);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName"); // fetch stored name

  const storedRoles = JSON.parse(localStorage.getItem("rolesArray")) || [];
  const [selectedRole, setSelectedRole] = useState(
    storedRoles.length > 0 ? storedRoles[0] : null
  );

  // Function to fetch notes
  const fetchNotes = useCallback(() => {
    if (token && selectedRole) {
      dispatch(getNotes(token, selectedRole.id));
    }
  }, [dispatch, token, selectedRole]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleEdit = (id) => {
    navigate(`/note-form/${id}`, { state: { roleId: selectedRole?.id } });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      dispatch(deleteNote(id, token, selectedRole?.id));
    }
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
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" noWrap sx={{ fontWeight: "bold" }}>
              📝 Notes Dashboard
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {storedRoles.map((role) => (
                <Chip
                  key={role.id}
                  label={role.name}
                  color={selectedRole?.id === role.id ? "primary" : "default"}
                  variant={selectedRole?.id === role.id ? "filled" : "outlined"}
                  size="small"
                  clickable
                  onClick={() => setSelectedRole(role)}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Welcome message left of bell */}
            {userName && (
              <Typography variant="subtitle2" sx={{ color: "#fff" }}>
                Welcome, {userName}
              </Typography>
            )}

            {/* Pass fetchNotes as callback for notifications */}
            <NotificationsBell userId={userId} onNotification={fetchNotes} />

            <IconButton
              color="inherit"
              onClick={() => navigate("/note-form")}
              disabled={selectedRole?.id !== 1}
            >
              <Add />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />

      {loading && <CircularProgress sx={{ mt: 3 }} />}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && notes.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
            width: "100%",
          }}
        >
          <TableContainer
            component={Paper}
            sx={{ maxWidth: 900, borderRadius: 2, boxShadow: 3 }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#2196F3" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Title
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Content
                  </TableCell>
                  {selectedRole?.code !== "OW" && (
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Owner
                    </TableCell>
                  )}
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {notes.map((note) => (
                  <TableRow
                    key={note.id}
                    sx={{
                      "&:nth-of-type(even)": { backgroundColor: "#f9f9f9" },
                    }}
                  >
                    <TableCell>{note.id}</TableCell>
                    <TableCell>{note.title}</TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 300,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {note.content}
                    </TableCell>
                    {selectedRole?.code !== "OW" && (
                      <TableCell>
                        {note.owner ? note.owner.name : "Unknown"}
                      </TableCell>
                    )}
                    <TableCell sx={{ textAlign: "center" }}>
                      <Tooltip
                        title={selectedRole?.code === "VW" ? "View only" : ""}
                      >
                        <span>
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(note.id)}
                            disabled={selectedRole?.code === "VW"}
                          >
                            <Edit />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip
                        title={selectedRole?.code === "VW" ? "View only" : ""}
                      >
                        <span>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(note.id)}
                            disabled={selectedRole?.code === "VW"}
                          >
                            <Delete />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {!loading && !error && notes.length === 0 && (
        <Typography sx={{ mt: 3, color: "gray" }}>
          No notes available. Add one!
        </Typography>
      )}
    </Box>
  );
}
