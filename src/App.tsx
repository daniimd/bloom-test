import { BrowserRouter, Routes, Route } from "react-router-dom";
import Genre from "./pages/Genre";
import Books from "./pages/Books";
import { FavoriteProvider } from './context/FavoriteContext'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  return (
    <FavoriteProvider>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Genre />} />
            <Route path="/books/:genre" element={<Books />} />
          </Routes>
          <ToastContainer />
      </BrowserRouter>
    </FavoriteProvider>

  );
};

export default App;