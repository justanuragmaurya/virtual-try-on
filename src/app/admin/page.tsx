import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import React from 'react'

async function AdminPage() {
    const session = await auth()
    if(!session){
        return <div className='flex-1 items-center justify-center'> NOT LOGGED iN </div>
    }else{
        if(session.user?.email != "justanuragmaurya@gmail.com"){
            return <div className='flex-1 items-center justify-center'> NOT A ADMIN </div>
        }
    }
    
    const images = await prisma.images.findMany()
    
    return(
        <div className='grid grid-cols-6 gap-2 p-4'>
            {images.map((data,index)=>{
                return(
                    <div key={index} className='relative w-full h-80'>
                        <Image
                            src={data.link}
                            alt='Not Found'
                            fill
                            className='object-cover rounded-md'
                            sizes="(max-width: 768px) 100vw, 25vw"
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default AdminPage
