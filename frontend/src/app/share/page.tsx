"use client"
import React,{useState,useCallback, useMemo, useEffect} from 'react'
import { useDropzone } from 'react-dropzone'
import {toast} from 'react-toastify'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { io } from 'socket.io-client';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { logIn,logOut } from '@/redux/features/authSlice';


let socket:any = null;
//let apiurl:string = process.env.NEXT_PUBLIC_API_URL 


const  page = () => {

  const router = useRouter();
  const auth = useAppSelector(state=>state.authReducer)
  const dispatch = useDispatch();

  const [file,setFile] = useState<any>(null);
  const [email,setEmail] = useState('');
  const [filename,setFilename] = useState('')
  //const [s3url, setS3url] = useState('')

  const onDrop = useCallback((acceptedFiles:any) => {
    // Do something with the files
    console.log(acceptedFiles)
    setFile(acceptedFiles[0])
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  useEffect(()=>{
      {!auth.isAuth && router.push('/login')}
    },[])


  // const handleShare = ()=>{
  //   if(email=='' || file==null){
  //       toast.error("email and file required")
  //       return
  //   }

  //   let res = axios.post('http://localhost:8000/file/sharefile',{
  //         receiveremail:email,
  //         filename:filename,
  //         clientfile:file,
  //         fileurl:file.path
  //   }, {headers: {'content-type': 'application/json'},
  //       withCredentials:true
  //       }, 
  //         ).then(function (response:any) {
  //           console.log(response);
  //                 // socket.emit('uploaded',{
  //                 //   from: auth.user.email,
  //                 //   to: email,
  //                 // })
  //         })
  //         .catch(function (error:any) {
  //           console.log(error);
  //         });


  //       router.push('/myfiles')
  //   }

  const uploadToS3Url = async (url:any)=>{
    const up = await axios.put(url,file
      ,{withCredentials:true})
        .then(function (response:any) {
          console.log(response);
        })
        .catch(function (error:any) {
          console.log(error);
        });
  }

  const handleUpload = async () =>{
    if(email=='' || file==null){
      console.log("email and file required")
      return
      }  

      let fileType='pdf';
      let filekey;
    
    const resUrl:any = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/file/generatepostobjecturl',
          {headers: {'content-type': 'application/json'},
            withCredentials:true
            },).then(function (response:any) {
              console.log(response);
              const s3Url = response.data?.data?.signedUrl;
              filekey = response.data.data.filekey;
              //console.log(s3Url,"test")
              uploadToS3Url(s3Url);   
              
            })
            .catch(function (error:any) {
              console.log(error);
            });

          let res = axios.post(process.env.NEXT_PUBLIC_API_URL + '/file/sharefile',{
              receiveremail:email,
              filename:filename,
              filekey:filekey
        }, {headers: {'content-type': 'application/json'},
            withCredentials:true
            }, 
              ).then(function (response:any) {
                console.log(response);
              })
              .catch(function (error:any) {
                console.log(error);
              });
    
    
            router.push('/myfiles')
           
    }

  

    // const [socketId, setSocketId] = useState<string>("")
    // socket = useMemo(() => io(apiurl), [])

    // useEffect(() => {
    //     socket.on('connect', () => {
    //       console.log(socket.id)
    //       setSocketId(socket.id)
    //     })
    
    //     if (auth.user) { socket.emit('joinself', auth.user.email) }
    //     else {
    //       getUserData().then((user) => {
    //         socket.emit('joinself', user.data.email)
    //       })
    //     }
    
    //   }, [])

      const getUserData = async ()=>{

        let res = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/auth/getuser',{
          headers: {'content-type': 'application/json'},
          withCredentials:true, 
        })
    
          dispatch(logIn(res.data))
          return res.data
           if(!res){
            // dispatch(logOut());
           }
    
      }

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-gray-300'> 

      <div className='flex gap-1 flex-col'>
          <label htmlFor="email">Receiver email</label>
          <input className='rounded' type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className='flex flex-end gap-1 py-5 flex-col'>
          <label htmlFor="filename">Filename</label>
          <input className='rounded' type="filename" name="filename" id="filename" value={filename} onChange={(e) => setFilename(e.target.value)} />
         
        </div>
          <button type='button' className='bg-black rounded text-white px-4 p-3' onClick={handleUpload} > Send </button>
      
      <div {...getRootProps()} className='p-25 my-5 bg-white h-40 rounded border-solid border-black'>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </div>
    </div>
  )
}

export default page 