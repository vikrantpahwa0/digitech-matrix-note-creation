import axios from "axios";

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: "REGISTER_REQUEST" });

    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL_LOCAL}auth/register`,
      userData
    );

    dispatch({
      type: "REGISTER_SUCCESS",
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: "REGISTER_FAILURE",
      payload: error.response?.data?.message || "Registration failed",
    });
  }
};

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: "LOGIN_REQUEST" });

    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL_LOCAL}auth/login`,
      credentials
    );

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: response.data,
    });

    // Store the token in localStorage
    localStorage.setItem("token", response.data.user.token);
    localStorage.setItem("userId", response.data.user.user.id.toString());
    localStorage.setItem("userName", response.data.user.user.name.toString());

    // Store the roles array in localStorage
    if (response.data.user.user.rolesArray) {
      localStorage.setItem(
        "rolesArray",
        JSON.stringify(response.data.user.user.rolesArray)
      );
    }
  } catch (error) {
    dispatch({
      type: "LOGIN_FAILURE",
      payload: error.response?.data?.message || "Login failed",
    });
  }
};

export const getNotes = (token, roleId) => async (dispatch) => {
  dispatch({ type: "GET_NOTES_REQUEST" });

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL_LOCAL}note/get-notes`,
      {
        headers: { Authorization: `${token}` },
        params: { roleId },
      }
    );

    dispatch({ type: "GET_NOTES_SUCCESS", payload: response.data.notes });
  } catch (error) {
    dispatch({
      type: "GET_NOTES_FAILURE",
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getNoteDetails = (id, token, roleId) => async (dispatch) => {
  dispatch({ type: "FETCH_NOTE_DETAILS_REQUEST" });
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL_LOCAL}note/get-note/${id}`,
      { headers: { Authorization: `${token}` }, params: { roleId } }
    );
    dispatch({
      type: "FETCH_NOTE_DETAILS_SUCCESS",
      payload: response.data.note,
    });
  } catch (error) {
    dispatch({
      type: "FETCH_NOTE_DETAILS_FAILURE",
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const addNote = (noteData, token) => async (dispatch) => {
  dispatch({ type: "ADD_NOTE_REQUEST" });
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL_LOCAL}note/add-note`,
      noteData,
      { headers: { Authorization: `${token}` } }
    );
    dispatch({ type: "ADD_NOTE_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: "ADD_NOTE_FAILURE", payload: error.message });
  }
};

export const deleteNote = (id, token, roleId) => async (dispatch) => {
  dispatch({ type: "DELETE_NOTE_REQUEST" });
  try {
    await axios.delete(
      `${process.env.REACT_APP_BASE_URL_LOCAL}note/delete-note/${id}`,
      {
        headers: { Authorization: `${token}` },
        params: { roleId },
      }
    );
    dispatch({ type: "DELETE_NOTE_SUCCESS", payload: id });
  } catch (error) {
    dispatch({
      type: "DELETE_NOTE_FAILURE",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// UPDATE NOTE
export const updateNote = (id, noteData, token, roleId) => async (dispatch) => {
  dispatch({ type: "UPDATE_NOTE_REQUEST" });
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_BASE_URL_LOCAL}note/edit-note/${id}`,
      noteData,
      {
        headers: { Authorization: `${token}` },
        params: { roleId },
      }
    );
    dispatch({ type: "UPDATE_NOTE_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({
      type: "UPDATE_NOTE_FAILURE",
      payload: error.response?.data?.message || error.message,
    });
  }
};
