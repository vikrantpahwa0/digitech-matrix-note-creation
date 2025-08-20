import React, { useEffect, useState } from "react";
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Notifications } from "@mui/icons-material";
import { initSocket, getSocket } from "../configs/socket";

export default function NotificationsBell({ userId, onNotification }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    if (!userId) return;

    initSocket(userId);
    const socket = getSocket();

    const handleNotification = (data) => {
      console.log("event Captured", data);
      const { fromUserId, message } = data;

      if (fromUserId === userId) return; // skip self notifications

      // Add to notifications list
      setNotifications((prev) => [{ message }, ...prev]);
      setHasNewNotification(true);

      // Trigger callback to refresh notes list
      if (typeof onNotification === "function") {
        onNotification();
      }
    };

    socket.on("notify", handleNotification);

    return () => {
      socket.off("notify", handleNotification);
    };
  }, [userId, onNotification]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setHasNewNotification(false); // clear badge when popover opens
  };

  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge color="error" variant="dot" invisible={!hasNewNotification}>
          <Notifications />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ width: 300, p: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Notifications
          </Typography>

          {notifications.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              No notifications
            </Typography>
          ) : (
            <List dense>
              {notifications.map((notif, index) => (
                <ListItem key={index} button>
                  <ListItemText primary={notif.message} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
}
