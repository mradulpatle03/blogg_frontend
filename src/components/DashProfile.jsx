import { Alert, Button, Modal, ModalBody, TextInput } from "flowbite-react";
import {  useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from 'axios'
import {toast} from "react-toastify"

import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../redux/user/userSlice';
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showModal, setShowModal] = useState(false);
  

  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateStart());
      let formData = new FormData();
      username && formData.append("username", username || currentUser.username);
      email && formData.append("email", email);
      password && formData.append("password", password);

      imageFile && formData.append("imageFile", imageFile);
      

      const res = await axios.put(import.meta.env.VITE_BACKEND_URL+"/api/user/update/"+currentUser._id,formData,{headers:{"Authorization":`Bearer ${currentUser.token}`,'Content-Type': 'application/json'}},{withCredentials:true})
      

      const data = res.data
      
      if (res.statusText!=='OK') {
        toast.error('something went wrong')
        dispatch(updateFailure(data));
        
        
      } else {
        toast.success("Profile updated successfully")
        dispatch(updateSuccess(data));
        
      }
    } catch (error) {
      toast.error('something went wrong')
      dispatch(updateFailure(error.message));
      console.log(error)
    }
  };


  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      
      const res = await axios.delete(`/api/user/delete/${currentUser._id}`,{headers:{"Authorization":`Bearer ${currentUser.token}`,'Content-Type': 'application/json'}},{withCredentials:true})
      const data =  res.data;
      if(data?.unAuthorized && data.unAuthorized){
        toast.error(data.message)
      }
      if(res.data.success){
        toast.success(data.message)
        dispatch(deleteUserSuccess(data));
      }else{
        dispatch(deleteUserFailure(data.message));
      }
      
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      
      const res = await axios.post('/api/user/signout')
      const data = res.data;
      if(res.data.success){
        dispatch(signoutSuccess());
      }else{
        console.log(data.message);
      }
      
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]`}
          />
        </div>

        <TextInput
          type="text"
          id="username"
          value={username}
          placeholder={currentUser.username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextInput
          type="email"
          id="email"
          value={email}
          placeholder={currentUser.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          type="password"
          id="password"
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          gradientDuoTone="greenToBlue"
          outline
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>
        {currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button
              type='button'
              gradientDuoTone='greenToBlue'
              className='w-full'
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer">
          Sign Out
        </span>
      </div>

      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
