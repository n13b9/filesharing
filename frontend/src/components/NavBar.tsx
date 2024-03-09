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

    let res:any = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/auth/checklogin',{
      headers: {'content-type': 'application/json'},
      withCredentials:true
    }).then(function (response:any) {
     // console.log(response);
              if(response.status===401){
                 dispatch(logOut())
              } else {
               // getUserData();
                }   
    })
    .catch(function (error:any) {
     // console.log(error);
    });
    
  }
      useEffect(()=>{
        checkLogin();
      },[])
  
  const getUserData = async ()=>{

    let res = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/auth/getuser',{
      headers: {'content-type': 'application/json'},
      withCredentials:true, 
    }).then(function (response:any) {
          console.log(response,"testing");
            dispatch(logIn(response.data.data))
            
            if(response.status===401){
             // dispatch(logOut());
            }
    })
    .catch(function (error:any) {
      //console.log(error);
    });



  }

  const handleLogout = async () => {
      let res = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/auth/logout')
      .then(function (response:any) {

              dispatch(logOut())
              router.push('/login')
        })
        .catch(function (error:any) {
          console.log(error);
        });

  }

  return (
    <div className='flex justify-end px-10 py-5 bg-green-300'>
      {!auth.isAuth ? (
          <div className='flex flex-row gap-10'>
              <Link href='/login'> <div> Login </div> </Link>
              <Link href='/signup'> <div> Sign Up </div> </Link>
          </div>

      ):(
          <div className='flex flex-row justify-end gap-10'>
              <Link href='/myfiles'> <div> My Files </div> </Link>
              <Link href='/share'> <div> Share </div> </Link>
              <div onClick={handleLogout} > logout </div>
          </div>

      )}

    </div>
  )
}

export default NavBar