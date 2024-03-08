"use client"
import React, { ChangeEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { AppDispatch, useAppSelector } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { logIn, logOut } from '@/redux/features/authSlice';
import axios from 'axios';



interface FormData {
  email:string;
  password:string
}

const page = () => {

  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const test = useAppSelector((state)=>state.authReducer) 
  const [formData,setFormData] = useState<FormData>({
    email:'',
    password:''
  })

  const [loading,setLoading] =useState(false)

  const handleInputChange = (e:ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = e.target
    setFormData({
          ...formData,
        [name]:value
    })
  }


  const handleLogin = async ()=>{

    if(formData.email=='' || formData.password==''){
        toast.error("Please fill all fields")
        return
    }

    await axios.post('http://localhost:8000/auth/login',{
          email:formData.email,
          password:formData.password
    },
    {headers: {'content-type': 'application/json'},
      withCredentials:true
    }, 
      ).then(function (response:any) {
        console.log(response);
      })
      .catch(function (error:any) {
        console.log(error);
      });

      getUserData()
  }

  const getUserData = async ()=>{

    let res = await axios.get('http://localhost:8000/auth/getuser',{
      headers: {'content-type': 'application/json'},
      withCredentials:true, 
    })
    
    console.log(res,"data")

       dispatch(logIn(res.data))
      setLoading(!loading)
      router.push('/myfiles')
  }

  useEffect(()=>{
    console.log(test,"testing")
  },[loading])

  return (
    <div className='flex min-h-screen items-center justify-center w-full max-h-full p-24'>
      <div className='flex flex-col'>
            <div className='flex flex-col p-5'>
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email"  onChange={handleInputChange} />
            </div>
            <div className='flex flex-col p-5'>
              <label htmlFor="password">Password</label>
              <input type="password" name="password" id="password" onChange={handleInputChange} />
            </div>

          <button className='text-xl bg-black text-white rounded w-[200px]' type='button' onClick={handleLogin}> Login </button>

            <Link href="/forgotpassword">
                Forgot Password?
            </Link>
       </div>
          
    </div>
  )
}

export default page