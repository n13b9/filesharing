"use client"
import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { logIn,logOut } from '@/redux/features/authSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


interface File {
  createdAt: string;
  filename: string;
  fileurl: string;
  receiveremail: string;
  senderemail: string;
  sharedAt: string;
  updatedAt: string;
  _id: string;
}

let socket:any = null;
//let apiurl:string = process.env.NEXT_PUBLIC_API_URL;


const page = () => {

  const router = useRouter()
  const auth = useAppSelector(state=>state.authReducer)
  console.log(auth.isAuth,"monitor")
  const dispatch = useDispatch();
  const [allfiles,setAllfiles] = useState<File[]>([])

  const getAllFiles = async () =>{

    let res:any = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/file/getfiles',
    {withCredentials:true}
    )
    .then(function (response) {
      //console.log(response);
      setAllfiles(response.data.data)
    })
    .catch(function (error) {
      console.log(error);
    });

  }
  
  useEffect(()=>{
    getAllFiles()
  },[])

  useEffect(()=>{
    getUserData();
   
  },[])

  const getUserData = async ()=>{

    let res = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/auth/getuser',{
      headers: {'content-type': 'application/json'},
      withCredentials:true, 
    }).then(function (response) {
      //console.log(response);
      dispatch(logIn(response.data))
      
       if(!response){
        // dispatch(logOut());
       }
    })
    .catch(function (error) {
      console.log(error);
    });

  }

  // const [socketId, setSocketId] = useState<string>("")
  // socket = useMemo(() => io(apiurl), [])

  // useEffect(()=>{
  //   socket.on('connect',()=>{
  //     console.log(socket.id,"FT connected")
  //     setSocketId(socket.id)
  //   })

  //   if(auth.user){socket.emit('joinself',auth.user.email)}
  //   else {
  //     getUserData().then((user)=>{
  //         socket.emit('joinself',user.data.email)
  //             })
  //   }

  //   socket.on('notify',(data:any)=>{
  //     toast.info("new files shared with you"+ data.from)
  //     getAllFiles()
  //   })

  // },[])


  const handleGetFile = async(id:string) =>{
        try {
          console.log(id,"testing id")
          let res:any = await axios.get(process.env.NEXT_PUBLIC_API_URL + `/file/gets3url/${id}`)
          .then(function (response) {
            console.log(response);
            window.open(response.data.data.signedUrl,'_blank')
          })
          .catch(function (error) {
            console.log(error);
          });
        } catch (error) {
          
        }
  }

  return (
    <div className='flex min-h-screen justify-center w-full max-h-full p-10 overflow-x-auto'>
      
  <table className="min-w-full divide-y divide-gray-200 justify-items-start">
    <thead>
      <tr className="bg-gray-100 flex justify-between text-align-left p-5 border-b border-solid border-black">
        <th className="px-4 py-2">Filename</th>
        <th className="px-4 py-2 ">Sender Email</th>
        <th className="px-4 py-2 ">Receiver Email</th>
        <th className="px-4 py-2">Shared At</th>
        <th className="px-4 py-2">View</th>
      </tr>
    </thead>
    <tbody>
      {allfiles.map((file, index) => {
        return (
          <tr
            key={index}
            className={`${
              index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
            } flex justify-between text-align-left p-5 border-b border-solid border-black`}
          >
            <td className="px-4 py-2">{file.filename}</td>
            <td className="px-4 py-2 justify-start">{file.senderemail}</td>
            <td className="px-4 py-2 justify-start">{file.receiveremail}</td>
            <td className="px-4 py-2">
              {new Date(file.sharedAt).toLocaleString()}
            </td>
            <td className="px-4 py-2">
              <button
                className="bg-green-300 rounded p-1"
                onClick={() => handleGetFile(file.fileurl)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

  )
}

export default page