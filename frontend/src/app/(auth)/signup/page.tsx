"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios';
import { toast } from 'react-toastify'


interface FormData {
  name: string,
  email: string,
  password: string,
}


const page = () => {
  const router = useRouter();


  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  } as FormData)
  const [otp, setOtp] = React.useState('')
  const [loading, setLoading] = useState(false);

  const handleOTP = async () => {
      setLoading(true);
    
      await axios.post(process.env.NEXT_PUBLIC_API_URL + '/auth/sendotp',{
        email:formData.email
      },
      {headers: {'content-type': 'application/json'},
        withCredentials:true }
      )
      .then(function (response:any) {
        toast.success("otp sent")
        console.log(response);
      })
      .catch(function (error:any) {
        // handle error
        console.log(error);
      })

      setLoading(false);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })

  }

  const handleSignUp = async ()=>{
    console.log("clicked")
    if (formData.name == "" || formData.email == '' || formData.password == '' || otp == '') {
      console.log('Please fill all the fields')
      return
    }
      
    let res:any = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/auth/register',{
        name:formData.name,
        password:formData.password,
        otp:otp,
        email:formData.email
      },
      {headers: {'content-type': 'application/json'}, withCredentials:true}
      ).then(function (response:any) {
        toast.success("registration success")
        console.log(response);
      })
      .catch(function (error:any) {
        console.log(error);
      });

      router.push('/login')

    }
    

  return (
    <div className='flex min-h-screen items-center justify-center w-full max-h-full p-24'>
      <div className='flex flex-col'>
          <div className='flex flex-col p-3'>
              <label htmlFor="email">Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className='flex flex-col p-3'>
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} />
              {
                !loading ? 
                <button className=' bg-black text-white rounded w-[200px]' type='button' onClick={handleOTP}> Send OTP </button>
                :
                <button className=' bg-gray-400 text-black rounded w-[200px]' type='button' onClick={handleOTP}> Sending... </button>
              }
            </div>
            <div className='flex flex-col p-3'>
              <label htmlFor="otp">OTP</label>
              <input type="text" name="otp" id="opt" value={otp} onChange={(e)=>setOtp(e.target.value)} />
            </div>
            <div className='flex flex-col p-3'>
              <label htmlFor="password">Password</label>
              <input type="password" name="password" id="password" value={formData.password} onChange={handleInputChange} />
            </div>

          <button className='text-xl bg-black text-white rounded w-[200px]' type='button' onClick={handleSignUp}> Sign Up </button>

            <Link href="/login">
                Already Signed Up ..login
            </Link>
       </div>
          
    </div>
  )
}

export default page