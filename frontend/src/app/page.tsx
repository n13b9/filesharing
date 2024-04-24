import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-row min-h-dvh">
      <div className="flex flex-col w-1/3 justify-center bg-black">
        <h1 className="text-5xl text-white font-bold font-mono mx-10 mb-3">
          {" "}
          Quick, Simple, Stress-free file sharing
        </h1>
        <h2 className="text text-white font-serif mx-10">
          Makes it easy to share files securely and effortlessly in real-time.
          Share a link to any file in your cloud storage and control who can
          view and edit shared files-all in one place and included as standard
          with your account
        </h2>
      </div>
      <div className="w-2/3 bg-blue-500 items-center flex justify-center">
        <img
          src="https://fjord.dropboxstatic.com/warp/conversion/dropbox/warp/en-us/Dropbox_DWG/fss-all-files-share-ui-transparent-1440x1440.png?id=5d004402-c723-4de8-9db1-ab3025f77446&width=414&output_type=webp"
          height={500}
          width={500}
        />
      </div>
    </div>
  );
}
