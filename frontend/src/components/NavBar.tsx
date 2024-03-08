"use client"
import { AppDispatch, useAppSelector } from '@/redux/store';
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { logIn,logOut } from '@/redux/features/authSlice';
import Link from 'next/link';

const NavBar = () => {

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>()

  const auth = useAppSelector((state)=>state.authReducer);

  const checkLogin = async ()=>{

    let res:any = await axios.get('http://localhost:8000/auth/checklogin',{
      headers: {'content-type': 'application/json'},
      withCredentials:true
    }).then(function (response:any) {
      console.log(response);
    })
    .catch(function (error:any) {
      console.log(error);
    });
    
       if(!res){
        // dispatch(logOut())
       } else {
         getUserData();
         }
      }

  // useEffect(()=>{
  //   checkLogin();
  // },[])
  
  const getUserData = async ()=>{

    let res = await axios.get('http://localhost:8000/auth/getuser',{
      headers: {'content-type': 'application/json'},
      withCredentials:true, 
    })

       dispatch(logIn(res.data))

       if(!res){
        // dispatch(logOut());
       }

  }

  const handleLogout = async () => {
      let res = await axios.get('http://localhost:8000/auth/logout')

      if(res){
        dispatch(logOut())
        router.push('/login')
      }
  }

  return (
    <div className='flex justify-end px-10 py-5 bg-green-300'>
      {!auth.isAuth ? (
          <div className='flex flex-row gap-10'>
              <Link href='/login'> <div> Login </div> </Link>
              <div> Sign Up </div>
          </div>

      ):(
          <div className='flex flex-row justify-end gap-10'>
              <div> my files </div>
              <Link href='/share'> <div> Share </div> </Link>
              <div onClick={handleLogout} > logout </div>
          </div>

      )}

    </div>
  )
}

export default NavBar