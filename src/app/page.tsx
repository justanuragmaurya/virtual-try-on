"use client"
import axios from "axios";
import { ClipboardIcon, Loader2, Paperclip, Upload } from "lucide-react";
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
  const [images , setImages] = useState<File[]>([])
  const [loading,setLoading]= useState<boolean>(false);

  const [resultImage , setResult ] = useState<string>();
  
  const modelRef = useRef<HTMLInputElement>(null)
  const clothRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const additionalImageRef = useRef<HTMLInputElement>(null)

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setImages(prev => e.target.files ? [...prev, e.target.files[0]] : prev)
  }

  const handleClothChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setImages(prev => e.target.files ? [...prev, e.target.files[0]] : prev)
  }

  const handleAdditionalImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setImages(prev => e.target.files ? [...prev, ...Array.from(e.target.files)] : prev)
  }

  const handleClick = async()=>{
    setLoading(true)
    if(images.length < 2 ){
      return
    }
    const formData = new FormData();
    images.forEach((file, idx) => {
      formData.append("images", file);
    });
    const prompt = inputRef.current?.value?.trim();
    if (prompt) {
      formData.append("userPrompt", prompt);
    }

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
        <h1 className={`text-5xl ${font.className}`}>Fit<span className="text-blue-400">Check</span></h1>
        <p className="mx-auto text-xs text-primary/50 ">
          Upload a image of your and a image of cloths you want to try on and
          hit the Try button and see the magic on screen
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        
        {!images[0]?(<div onClick={()=>{modelRef.current?.click()}} className="bg-muted-foreground/20 h-48 w-4h-48 md:h-96  md:w-96 rounded-md flex flex-col items-center justify-center p-10">
          <Upload size={50} className="text-muted-foreground"/>
          <h2 className="text-xs text-muted-foreground">
            Upload a Picture of You
          </h2>
          <input type="file" ref={modelRef} accept="image/*" onChange={handleImageChange} className="hidden"/>
        </div>):<Image className=" h-48 w-4h-48 md:h-96  md:w-96 rounded-md mx-auto" src={URL.createObjectURL(images[0])} alt="Selected model photo" width={384} height={384} unoptimized />}

        {!images[1]?(<div onClick={()=>{clothRef.current?.click()}} className="bg-muted-foreground/20 h-48 w-4h-48 md:h-96  md:w-96 rounded-md flex flex-col items-center justify-center p-10">
          <Upload size={50} className="text-muted-foreground"/>
          <h2 className="text-xs text-muted-foreground">
            Upload a Picture of the cloths you want to try
          </h2>
          <input type="file" ref={clothRef} accept="image/*" onChange={handleClothChange} className="hidden"/>
        </div>):<Image className=" h-48 w-4h-48 md:h-96  md:w-96 rounded-md mx-auto" src={URL.createObjectURL(images[1])} alt="Selected garment photo" width={384} height={384} unoptimized />}
      </div>

    <div className="flex-col items-center justify-center w-full px-5 py-2 md:w-2/3">
      <div className="flex-col items-center justify-center w-full">
        {images.length > 2 && <h1 className="text-xs text-primary/80">{images.length-2} additional images selected</h1>}
        <input type="file" ref={additionalImageRef} accept="image/*" multiple onChange={handleAdditionalImage} className="hidden"/>
        <Button className="w-full my-2" onClick={()=>{additionalImageRef.current?.click()}}> <Paperclip/> Add other accessories like sunglasses, shoes, caps, etc .</Button>
      </div>
      <div className="flex items-center justify-center w-full gap-2 text-xs mx-auto">
        <Input ref={inputRef} placeholder="Enter any additional details (optional)" className="text-sm bg-white/80 dark:bg-black/50"/>
        <Button onClick={handleClick} disabled={loading} className="text-xs bg-[#1093e5] text-white font-semibold shadow-md"> {!loading?"Create !":<Loader2 className="animate-spin"/>}</Button>
      </div>
    </div>
      {resultImage&&<Image src={`${resultImage}`} alt="Generated try-on result" width={384} height={384} className="w-96 rounded-xl" unoptimized />}
      <GradientBackground/>
      </div>
  );
}
