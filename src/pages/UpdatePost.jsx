import { Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from "axios"

import { useEffect, useState } from 'react';
import { useNavigate ,useParams} from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

export default function UpdatePost() {
    const [title,setTitle]=useState("");
    const [category,setCategory]=useState("");
    const [image,setImage]=useState(false)
    const [content,setContent]= useState("")
    const {postId} = useParams()
    const [publishError, setPublishError] = useState(null);
    const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  


  useEffect(() => {
    try {
      const fetchPost = async () => {
        
        const res = await axios.get(import.meta.env.VITE_BACKEND_URL+`/api/post/getposts?postId=${postId}`);
        const data = res.data;
        if(res.data.success){
          setPublishError(null);
          setFormData(data.posts[0]);
        }else{
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        
      };

      fetchPost();
      
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const formData1 = new FormData();

        

        formData1.append('title',formData.title)
        formData1.append('category',formData.category)
        formData1.append('content',formData.content)

        image && formData1.append('image',image);

        const response = await axios.put(import.meta.env.VITE_BACKEND_URL+`/api/post/updatepost/${formData._id}/${currentUser._id}`,formData1,{headers:{"Authorization":`Bearer ${currentUser.token}`,'Content-Type': 'application/json'}},{withCredentials:true})

        if(response.data?.unAuthorized && response.data.unAuthorized){
          toast.error(response.data.message)
        }
        if(!response.data.success){
            toast.error(response.data.message)
            
        }else{
            navigate(`/post/${response.data.slug}`);
            toast.success(response.data.message)
            
        }

    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
  };
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update a post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            
            required
            id='title'
            className='flex-1'
            onChange={(e)=> setFormData({ ...formData, title: e.target.value })}
            value={formData.title}
          />
          <Select
            onChange={(e)=> setFormData({ ...formData, category: e.target.value })}
            value={formData.category}
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
        
        {formData.image && (
          <img
            src={image ? URL.createObjectURL(image) : formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(e)=> setFormData({ ...formData, content: e.target.value })}
          value={formData.content}
        />
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Update
        </Button>
        
      </form>
    </div>
  );
}