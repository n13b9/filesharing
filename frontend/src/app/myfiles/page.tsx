"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { logIn, logOut } from "@/redux/features/authSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

// let socket:any = null;
//let apiurl:string = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const router = useRouter();
  const auth = useAppSelector((state) => state.authReducer);
  console.log(auth.isAuth, "monitor");
  const dispatch = useDispatch();
  const [allfiles, setAllfiles] = useState<File[]>([]);

  const getAllFiles = async () => {
    let res: any = await axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/file/getfiles", {
        withCredentials: true,
      })
      .then(function (response) {
        //console.log(response);
        setAllfiles(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllFiles();
  }, []);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    let res = await axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/auth/getuser", {
        headers: { "content-type": "application/json" },
        withCredentials: true,
      })
      .then(function (response) {
        //console.log(response);
        dispatch(logIn(response.data));

        if (!response) {
          // dispatch(logOut());
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

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

  const handleGetFile = async (id: string) => {
    try {
      console.log(id, "testing id");
      let res: any = await axios
        .get(process.env.NEXT_PUBLIC_API_URL + `/file/gets3url/${id}`)
        .then(function (response) {
          console.log(response);
          window.open(response.data.data.signedUrl, "_blank");
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {}
  };

  return (
    <div className="flex flex-col justify-center w-full p-5">
      <div className="my-3">
        <h1 className="text-3xl font-semibold font-mono"> All Files </h1>
      </div>
      <div className="rounded-md borderoverflow-hidden flex justify-center">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2  w-[300px] font-bold">
                Filename{" "}
              </TableHead>
              <TableHead className="px-4 py-2 font-bold">Sender </TableHead>
              <TableHead className="px-4 py-2 font-bold">Shared With</TableHead>
              <TableHead className="px-4 py-2 font-bold">Shared At</TableHead>
              <TableHead className="px-4 py-2 font-bold">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allfiles.map((file, index) => (
              <TableRow
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}`}
              >
                <TableCell className="px-4 py-2">{file.filename}</TableCell>
                <TableCell className="px-4 py-2">{file.senderemail}</TableCell>
                <TableCell className="px-4 py-2">
                  {file.receiveremail}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {new Date(file.sharedAt).toLocaleDateString([], {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell className="px-4 py-2">
                  <button
                    className="rounded p-1"
                    onClick={() => handleGetFile(file.fileurl)}
                  >
                    <img
                      src="/open-in-new-svgrepo-com.svg"
                      alt="Open in New"
                      className="w-5 h-5"
                    />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Page;
