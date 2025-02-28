import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Headers from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import { refresh } from "./redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {ToastContainer} from "react-toastify"
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute"
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage"
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";

const App = () => {

  const { currentUser } = useSelector((state) => state.user);
  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(refresh())
  })
  
  return (
    <div>
      <ToastContainer/>
      <ScrollToTop/>
      <Headers />

      <Routes>
        <Route path="/" element={currentUser? <Home /> : <Signin />}  />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<Search />} />
        <Route path="/projects" element={<Projects />} />
        <Route element={<PrivateRoute/>}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<OnlyAdminPrivateRoute/>}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>

        <Route path='/post/:postSlug' element={<PostPage />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
