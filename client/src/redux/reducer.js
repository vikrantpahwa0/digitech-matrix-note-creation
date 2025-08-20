const initialUserState = {
  loading: false,
  user: null,
  error: null,
};

export const authReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case "REGISTER_REQUEST":
      return { ...state, loading: true };
    case "REGISTER_SUCCESS":
      return { ...state, loading: false, user: action.payload };
    case "REGISTER_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const initialLoginState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

export const authLoginReducer = (state = initialLoginState, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return { ...state, loading: true, error: null };

    case "LOGIN_SUCCESS": // Debugging log
      return {
        ...state,
        loading: false,
        user: action.payload.user.user, // Extracting the user object
        token: action.payload.user.token, // Extracting the token correctly
      };

    case "LOGIN_FAILURE":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const getNotesInitialState = {
  notes: [],
  loading: false,
  error: null,
};

export const getNotesReducer = (state = getNotesInitialState, action) => {
  switch (action.type) {
    case "GET_NOTES_REQUEST":
      return { ...state, loading: true, error: null };

    case "GET_NOTES_SUCCESS":
      return { ...state, loading: false, notes: action.payload };

    case "GET_NOTES_FAILURE":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const addNoteInitialState = {
  loading: false,
  notes: [],
  error: null,
};

export const addNoteReducer = (state = addNoteInitialState, action) => {
  switch (action.type) {
    case "ADD_NOTE_REQUEST":
      return { ...state, loading: true, error: null };

    case "ADD_NOTE_SUCCESS":
      return {
        ...state,
        loading: false,
        notes: [...state.notes, action.payload],
      };

    case "ADD_NOTE_FAILURE":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const initialDeleteState = {
  notes: [],
  loading: false,
  error: null,
};

export const notesDeleteReducer = (state = initialDeleteState, action) => {
  switch (action.type) {
    case "DELETE_NOTE_REQUEST":
      return { ...state, loading: true, error: null };
    case "DELETE_NOTE_SUCCESS":
      return {
        ...state,
        loading: false,
        notes: state.notes.filter((note) => note.id !== action.payload),
      };
    case "DELETE_NOTE_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const initialUpdateState = {
  notes: [],
  loading: false,
  error: null,
};

export const notesUpdateReducer = (state = initialUpdateState, action) => {
  switch (action.type) {
    case "UPDATE_NOTE_REQUEST":
      return { ...state, loading: true, error: null };

    case "UPDATE_NOTE_SUCCESS":
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id ? action.payload : note
        ),
      };

    case "UPDATE_NOTE_FAILURE":
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

const initialState = {
  loading: false,
  note: null,
  error: null,
};

export const noteDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_NOTE_DETAILS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_NOTE_DETAILS_SUCCESS":
      return { ...state, loading: false, note: action.payload };
    case "FETCH_NOTE_DETAILS_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
