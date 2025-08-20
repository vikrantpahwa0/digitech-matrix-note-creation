import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import NoteForm from "./pages/NoteForm";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/note-form" element={<NoteForm />} />
        <Route path="/note-form/:id" element={<NoteForm />} />{" "}
        {/* Route for editing */}
      </Routes>
    </div>
  );
}

export default App;
