"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { logIn, logOut } from "@/redux/features/authSlice";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// let socket:any = null;
//let apiurl:string = process.env.NEXT_PUBLIC_API_URL

const Page = () => {
  const router = useRouter();
  const auth = useAppSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  const [file, setFile] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [filename, setFilename] = useState("");
  //const [s3url, setS3url] = useState('')

  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    console.log(acceptedFiles);
    setFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    {
      !auth.isAuth && router.push("/login");
    }
  }, []);

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

  const uploadToS3Url = async (url: any) => {
    const up = await axios
      .put(url, file, {
        headers: {
          "Content-Type": file.type,
          "Content-Length": file.size.toString(),
        },
        withCredentials: true,
      })
      .then(function (response: any) {
        console.log(response);
      })
      .catch(function (error: any) {
        console.log(error);
      });
  };

  const handleUpload = async () => {
    if (email == "" || file == null) {
      console.log("email and file required");
      return;
    }

    let fileType = "pdf";
    let filekey;

    const resUrl: any = await axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/file/generatepostobjecturl", {
        headers: { "content-type": "application/json" },
        withCredentials: true,
      })
      .then(function (response: any) {
        console.log(response);
        const s3Url = response.data?.data?.signedUrl;
        filekey = response.data.data.filekey;
        //console.log(s3Url,"test")
        uploadToS3Url(s3Url);
      })
      .catch(function (error: any) {
        console.log(error);
      });

    let res = axios
      .post(
        process.env.NEXT_PUBLIC_API_URL + "/file/sharefile",
        {
          receiveremail: email,
          filename: filename,
          filekey: filekey,
        },
        {
          headers: { "content-type": "application/json" },
          withCredentials: true,
        }
      )
      .then(function (response: any) {
        console.log(response);
      })
      .catch(function (error: any) {
        console.log(error);
      });

    router.push("/myfiles");
  };

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

  const getUserData = async () => {
    let res = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/auth/getuser",
      {
        headers: { "content-type": "application/json" },
        withCredentials: true,
      }
    );

    dispatch(logIn(res.data));
    return res.data;
    if (!res) {
      // dispatch(logOut());
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen bg-gray-300"
      style={{ backgroundColor: "#eecc88", color: "#ffffff" }}
    >
      <Card>
        <CardHeader>
          <CardTitle> Share Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-black font-semibold">
              Receiver email
            </label>
            <input
              className="border border-solid border-black p-2 rounded-md"
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </CardContent>
        <CardContent>
          <div className="flex flex-end gap-1 py-5 flex-col">
            <label htmlFor="filename" className="text-black font-semibold">
              Filename
            </label>
            <input
              className="border border-solid border-black p-2 rounded-md"
              type="filename"
              name="filename"
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
          </div>
        </CardContent>
        <CardContent>
          <div className="flex justify-center">
            <button
              type="button"
              className="bg-black rounded-2xl text-white text-xl font-semibold px-4 p-3 w-[150px]"
              onClick={handleUpload}
            >
              {" "}
              Share{" "}
            </button>
          </div>

          <div
            {...getRootProps()}
            className="p-25 my-5 bg-white h-40 rounded border-solid border-black border-2"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p className="mx-2 my-2">
                Drag n drop some files here, or click to select files
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
