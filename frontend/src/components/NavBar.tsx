"use client";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { logIn, logOut } from "@/redux/features/authSlice";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const auth = useAppSelector((state) => state.authReducer);

  const checkLogin = async () => {
    let res: any = await axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/auth/checklogin", {
        headers: { "content-type": "application/json" },
        withCredentials: true,
      })
      .then(function (response: any) {
        // console.log(response);
        if (response.status === 401) {
          dispatch(logOut());
        } else {
          // getUserData();
        }
      })
      .catch(function (error: any) {
        // console.log(error);
      });
  };
  useEffect(() => {
    checkLogin();
  }, []);

  const getUserData = async () => {
    let res = await axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/auth/getuser", {
        headers: { "content-type": "application/json" },
        withCredentials: true,
      })
      .then(function (response: any) {
        console.log(response, "testing");
        dispatch(logIn(response.data.data));

        if (response.status === 401) {
          // dispatch(logOut());
        }
      })
      .catch(function (error: any) {
        //console.log(error);
      });
  };

  const handleLogout = async () => {
    let res = await axios
      .post(process.env.NEXT_PUBLIC_API_URL + "/auth/logout")
      .then(function (response: any) {
        dispatch(logOut());
        router.push("/login");
      })
      .catch(function (error: any) {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-row justify-between pr-10 pl-5 py-1 bg-gray-200">
      <div className="flex flex-row bg-gray-200">
        <img
          className="bg-gray-200"
          src="https://store-images.s-microsoft.com/image/apps.8374.14162947098762775.bea66d8b-2f14-49d3-b715-31559d6483bd.8387b69a-e758-4c32-8acd-7a00e7476f5b?h=464"
          width={50}
          height={50}
        />
        <div className="flex flex-row items-center gap-5 pl-5">
          <Link href="/login">
            <div className="font-bold font-serif"> Product </div>{" "}
          </Link>
          <Link href="/myfiles">
            {" "}
            <div className="font-bold font-serif"> Share </div>{" "}
          </Link>
          <Link href="/login">
            <div className="font-bold font-serif"> Security </div>{" "}
          </Link>
          <Link href="/myfiles">
            {" "}
            <div className="font-bold font-serif"> Enterprise </div>{" "}
          </Link>
        </div>
      </div>

      <div className="flex justify-end items-center ">
        {!auth.isAuth ? (
          <div className="flex flex-row gap-10">
            <Link href="/login">
              {" "}
              <div className="font-bold font-mono"> Login </div>{" "}
            </Link>
            <Link href="/signup">
              {" "}
              <div className="font-bold font-mono"> SignUp </div>{" "}
            </Link>
          </div>
        ) : (
          <div className="flex flex-row justify-end gap-10">
            <Link href="/myfiles">
              {" "}
              <div className="font-bold font-mono"> My Files </div>{" "}
            </Link>
            <Link href="/share">
              {" "}
              <div className="font-bold font-mono"> Share </div>{" "}
            </Link>
            <div className="font-bold font-mono" onClick={handleLogout}>
              {" "}
              logout{" "}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
