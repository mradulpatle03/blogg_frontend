import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from "axios"

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

export default function CreatePost() {
    const [title,setTitle]=useState("");
    const [category,setCategory]=useState("");
    const [image,setImage]=useState(false)
    const [content,setContent]= useState("")

  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const formData = new FormData();

        formData.append('title',title)
        formData.append('category',category)
        formData.append('content',content)

        image && formData.append('image',image);

        const response = await axios.post(import.meta.env.VITE_BACKEND_URL+"/api/post/create",formData,{headers:{"Authorization":`Bearer ${currentUser.token}`,'Content-Type': 'application/json'}},{withCredentials:true})
        if(response.data?.unAuthorized && response.data.unAuthorized){
          toast.error(response.data.message)
        }
        if(!response.data.success){
            toast.error(response.data.message)
        }else{
            setImage(false)
            toast.success(response.data.message)
            navigate(`/post/${response.data.savedPost.slug}`);
        }

    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
  };
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e)=> setTitle(e.target.value)}
            value={title}
          />
          <Select
            onChange={(e)=> setCategory(e.target.value)}
            value={category}
          >
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e)=> setImage(e.target.files[0])}
            
          />
          
        </div>
        
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setContent(value);
          }}
        />
        <Button type='submit' gradientDuoTone='greenToBlue'>
          Publish
        </Button>
        
      </form>
    </div>
  );
}