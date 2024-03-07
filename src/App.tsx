import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Stream} from "./pages/Stream";
import {Upload} from "./pages/Upload";
import "./App.css";
import "material-symbols";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Upload />} />
          <Route path="stream" element={<Stream />} />
          <Route path="upload" element={<Upload />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
