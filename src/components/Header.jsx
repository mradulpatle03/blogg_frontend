import { Button, Navbar, Dropdown, Avatar, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa6";
import { useSelector,useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from '../redux/user/userSlice';
import axios from "axios";
import { toast } from "react-toastify";

const Header = () => {
  const dispatch=useDispatch()
  const {theme} = useSelector(state=> state.theme)
  const navigate = useNavigate()
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm,setSearchTerm]=useState('')
  const location = useLocation()

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  },[location.search])
  const handleSignout = async () => {
    try { 
      
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL+'/api/user/signout',{currentUser},{withCredentials:true})
      const data = res.data;
      if(res.data.success){
        toast.success("Signout Success")
        dispatch(signoutSuccess());
      }
      else{
        toast.error(data.message)
        console.log(data.message);
      } 
    } catch (error) {
      toast.error(error.message)
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div>
      <Navbar className="border-b-2">
        <Link
          to={"/"}
          className="self-center whitespace-nowrap text-md sm:text-xl"
        >
          <span className="px-4 py-2 bg-gradient-to-r from-[#fb8500] via-[#457b9d] to-[#1d3557] rounded-lg text-white font-extrabold">
            BLOGG's
          </span>
        </Link>

        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            placeholder="search..."
            rightIcon={AiOutlineSearch}
            className="w-20 lg:inline"
            value={searchTerm}
            onChange={(e)=> setSearchTerm(e.target.value)}
          />
        </form>

        

        <div className="flex gap-2 md:order-2">
          <Button
          onClick={()=>dispatch(toggleTheme())}
            className=" hidden sm:inline "
            gradientDuoTone={`${theme!=='light' ? "pinkToOrange" : "purpleToBlue"}`}
            color="gray"
            pill
          >
            {theme!=='light' ? (
              <FaSun className="w-4 h-4" />
            ) : (
              <FaMoon className="w-4 h-4" />
            )}
          </Button>
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="user" img={currentUser.profilePicture} rounded />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout} >Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to={"/signin"}>
              <Button gradientDuoTone="greenToBlue" outline>
                Sign in
              </Button>
            </Link>
          )}
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={"div"}>
            <Link to="/">Home</Link>
          </Navbar.Link>

          <Navbar.Link active={path === "/about"} as={"div"}>
            <Link to="/about">About</Link>
          </Navbar.Link>

          <Navbar.Link active={path === "/projects"} as={"div"}>
            <Link to="/projects">Projects</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
