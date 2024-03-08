"use client"
import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { logIn,logOut } from '@/redux/features/authSlice';
import { toast } from 'react-toastify';


interface File {
  createdAt: string;
  filename: string;
  fileurl: string;
  fileType: string | null;
  receiveremail: string;
  senderemail: string;
  shareAt: string;
  updatedAt: string;
  _id: string;
}

let socket:any = null;
let apiurl:string = 'http://localhost:8000'


const page = () => {


  const auth = useAppSelector(state=>state.authReducer)
  const dispatch = useDispatch();
  const [allfiles,setAllfiles] = useState<File[]>([])

  const getAllFiles = async () =>{

    let res:any = await axios.get('http://localhost:8000/file/getfiles',
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

  const getUserData = async ()=>{

    let res = await axios.get('http://localhost:8000/auth/getuser',{
      headers: {'content-type': 'application/json'},
      withCredentials:true, 
    })

      dispatch(logIn(res.data))
      return res.data
       if(!res){
        // dispatch(logOut());
       }

  }

  const [socketId, setSocketId] = useState<string>("")
  socket = useMemo(() => io(apiurl), [])

  useEffect(()=>{
    socket.on('connect',()=>{
      console.log(socket.id,"FT connected")
      setSocketId(socket.id)
    })

    if(auth.user){socket.emit('joinself',auth.user.email)}
    else {
      getUserData().then((user)=>{
          socket.emit('joinself',user.data.email)
              })
    }

    socket.on('notify',(data:any)=>{
      toast.info("new files shared with you"+ data.from)
      getAllFiles()
    })

  },[])


  return (
    <div className='flex min-h-screen items-center justify-center w-full max-h-full p-24'>
      
       <table className='w-full'>
          <thead>
            <tr className='flex justify-between text-align-left p-5 border-solid border-black'>
              <th>Filename</th>
              <th>File Type</th>
              <th>Sender Email</th>
              <th>Receiver Email</th>
              <th>Shared At</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
              {allfiles.map((file,index)=>{
                return (
                  <tr key={index} className='flex justify-between text-align-left p-5 border-solid border-black'  >
                    <td>{file.filename}</td>
                    <td>
                      {file.fileType}
                    </td>

                    <td>{file.senderemail}</td>
                    <td>{file.receiveremail}</td>
                    <td>{new Date(file.shareAt).toLocaleString()}</td>
                    <td> Icon </td>
                  </tr>
                )
              })}
          </tbody>
       </table>
    </div>
  )
}

export default page