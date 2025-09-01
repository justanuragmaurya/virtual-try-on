"use client"
import axios from "axios";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Instrument_Serif } from "next/font/google";
import { ChangeEvent, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import GradientBackground from "@/components/background";
import Image from "next/image";

const font = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  const [modelImage , setModel] = useState<File>();
  const [clothImage , setCloth] = useState<File>();
  const [prompt,setPrompt] = useState<string>("");
  const [loading,setLoading]= useState<boolean>(false);

  const [resultImage , setResult ] = useState<string>();
  
  const modelRef = useRef<HTMLInputElement>(null)
  const clothRef = useRef<HTMLInputElement>(null)
  
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setModel(e.target.files[0])
  }

  const handleClothChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setCloth(e.target.files[0])
  }

  const handleClick = async()=>{
    setLoading(true)
    if (!modelImage || !clothImage) return;
    const formData = new FormData();
    formData.append("modelImage", modelImage);
    formData.append("clothImage", clothImage);
    if (prompt) formData.append("userPrompt", prompt);

    const response = await axios.post("/api/try", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    if(response.data.success){
      setResult(response.data.data)
    }else{
      alert("Error : " + response.data.message)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center text-center p-2">
      <div className="w-full md:max-w-1/2 p-5 mt-5 md:mt-24">
        <h1 className={`text-5xl ${font.className}`}>Try It On</h1>
        <p className="mx-auto text-sm">
          Upload a image of your and a image of cloths you want to try on and
          hit the Try button and see the magic on screen
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        
        {!modelImage?(<div onClick={()=>{modelRef.current?.click()}} className="bg-muted-foreground/20 h-48 w-4h-48 md:h-96  md:w-96 rounded-md flex flex-col items-center justify-center p-10">
          <Upload size={50} className="text-muted-foreground"/>
          <h2 className="text-xs text-muted-foreground">
            Upload a Picture of You
          </h2>
          <input type="file" ref={modelRef} accept="image/*" onChange={handleImageChange} className="hidden"/>
        </div>):<Image className=" h-48 w-4h-48 md:h-96  md:w-96 rounded-md mx-auto" src={URL.createObjectURL(modelImage)} alt="Selected model photo" width={384} height={384} unoptimized />}

        {!clothImage?(<div onClick={()=>{clothRef.current?.click()}} className="bg-muted-foreground/20 h-48 w-4h-48 md:h-96  md:w-96 rounded-md flex flex-col items-center justify-center p-10">
          <Upload size={50} className="text-muted-foreground"/>
          <h2 className="text-xs text-muted-foreground">
            Upload a Picture of the cloths you want to try
          </h2>
          <input type="file" ref={clothRef} accept="image/*" onChange={handleClothChange} className="hidden"/>
        </div>):<Image className=" h-48 w-4h-48 md:h-96  md:w-96 rounded-md mx-auto" src={URL.createObjectURL(clothImage)} alt="Selected garment photo" width={384} height={384} unoptimized />}
      </div>

      <div className="flex items-center p-5 w-full md:w-2/3 gap-2 text-xs">
        <Input placeholder="Enter any additional details (optional)" value={prompt} onChange={(e)=>setPrompt(e.target.value)} className="text-sm bg-white/80 dark:bg-black/50"/>
         <Button onClick={handleClick} className="text-xs"> {!loading?"Try on !":<Loader2 className="animate-spin"/>}</Button>
      </div>
      {resultImage&&<Image src={`${resultImage}`} alt="Generated try-on result" width={384} height={384} className="w-96 rounded-xl" unoptimized />}
      <GradientBackground/>
      </div>
  );
}
