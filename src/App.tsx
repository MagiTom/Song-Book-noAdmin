import { Route, Routes } from "react-router-dom";
import { CategoryPage } from "./pages/CategoryPage/CategoryPage";
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import MainScreenPage from "./pages/MainScreenPage/MainScreenPage";
import SongPage from "./pages/SongPage/SongPage";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/"  element={<MainScreenPage />}>
          <Route path="/" element={<HomePage />}>
            <Route path="/" element={<CategoryPage />} />
            <Route path="/:category" element={<CategoryPage />} />
          </Route>
          <Route path="/song/:id" element={<SongPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
