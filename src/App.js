import "./App.css";
import Home from "./pages/Home/home";
import Editor from "./pages/Editor/editor";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar/navbar";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/editor/:roomId" element={<Editor />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
