"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logIn, logOut } from "@/redux/features/authSlice";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FormData {
  email: string;
  password: string;
}

const Page = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const test = useAppSelector((state) => state.authReducer);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    if (formData.email == "" || formData.password == "") {
      toast.error("Please fill all fields");
      return;
    }

    await axios
      .post(
        process.env.NEXT_PUBLIC_API_URL + "/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: { "content-type": "application/json" },
          withCredentials: true,
        }
      )
      .then(function (response: any) {
        console.log(response);
        router.push("/myfiles");
      })
      .catch(function (error: any) {
        console.log(error);
      });

    //getUserData()
  };

  // const getUserData = async ()=>{

  //   let res = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/auth/getuser',{
  //     headers: {'content-type': 'application/json'},
  //     withCredentials:true,
  //   })

  //   console.log(res,"data")

  //      dispatch(logIn(res.data))
  //     setLoading(!loading)
  //     router.push('/myfiles')
  // }

  return (
    <div className="flex flex-row  w-full min-h-svh">
      <div
        className="flex flex-col w-1/2 items-center justify-center p-8"
        style={{ backgroundColor: "#663a14", color: "#ffffff" }}
      >
        <h1 className="font-bold text-3xl text-center font-serif p-8">
          Send files, move ideas, safely
        </h1>
        <img src="https://auth-cdn.wetransfer.com/assets/images/transfer-general.png" />
      </div>
      <div className="flex justify-content items-center">
        <div className="items-align">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col p-5">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded-md mb-4"
                />
              </div>
            </CardContent>
            <CardContent>
              <div className="flex flex-col p-5">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded-md mb-4"
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col items-center">
                <button
                  className="text-xl bg-black text-white rounded-2xl w-[200px] p-2 mb-4"
                  type="button"
                  onClick={handleLogin}
                >
                  Login
                </button>
                <Link href="/forgotpassword">Forgot Password?</Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
