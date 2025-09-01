import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function ImagesPage() {
    const session = await auth()
    if(!session){
        return<>Please signIn to continue</>   
    }
    
    const images = await prisma.images.findMany({where:{
        creatorId:session.user?.id
    }})

    return(
        <div className="p-5">
            {images.map((image,index)=>{
                return(
                    <div key={index}>
                        <img src={image.link} className="w-96 rounded-xl"></img>
                    </div>
                )
            })}
        </div>
    )
}