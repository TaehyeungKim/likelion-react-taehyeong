import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./routes/HomePage";
import SignUpPage from "./routes/SignUpPage";
import SignInPage from "./routes/SignInPage";
import PostCreatePage from "./routes/PostCreatePage";
import PostDetailPage from "./routes/PostDetailPage";
import PostEditPage from "./routes/PostEditPage";
import Footer from "./components/Footer";
import "./App.css";
import { getUser } from "./apis/api";
import { getCookie } from "./utils/cookie";

export const UserContext = createContext(null);

const AppInRouter = () => {
  const [user, setUser] = useState(null);

  const location = useLocation();

  useEffect(() => {
    if (getCookie("access_token")) {
      const getUserAPI = async () => {
        const user = await getUser();
        setUser(user);
      };
      getUserAPI();
    }
  }, [location]);
  return (
    <UserContext.Provider value={user}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/create" element={<PostCreatePage />} />
        <Route path="/:postId" element={<PostDetailPage />} />
        <Route path="/:postId/edit" element={<PostEditPage />} />
      </Routes>
      <Footer />
    </UserContext.Provider>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppInRouter></AppInRouter>
      </BrowserRouter>
    </div>
  );
}

export default App;
