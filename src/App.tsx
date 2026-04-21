import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Demo from "./pages/Demo";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
