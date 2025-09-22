import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { system_prompt } from "@/lib/utils";
import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if(!session){
        return NextResponse.json({
            success:false,
            message:"Not Logged in , please login to continue"
        })
    }

    const sessionUserId = session.user?.id
    if (!sessionUserId) {
      return NextResponse.json({
        success: false,
        message: "Not Logged in , please login to continue"
      })
    }

    const user = await prisma.user.findFirst({ where: { id: sessionUserId } })
    if(user){
        if(user.credits <= 0){
            return NextResponse.json({
                success:false,
                message:"Not Enough Credits"
            })
        }
    }else{
        return NextResponse.json({
            success:false,
            message:"Not Logged in , please login to continue"
        })
    }

    const form = await req.formData();
    const userPrompt = form.get("userPrompt");
    const images = form.getAll("images");
    const imageFiles = images.filter((v): v is File => v instanceof File);

    if (imageFiles.length < 2) {
      return NextResponse.json(
        { success: false, message: "Please upload at least 2 images" },
        { status: 400 }
      );
    }

    fal.config({ credentials: process.env.FAL_API_KEY });

    console.log("Uploading images");
    const uploadedUrls = await Promise.all(
      imageFiles.map(async (file) => await fal.storage.upload(file))
    );
    console.log(`uploaded ${uploadedUrls.length} file(s)`);

    let final_prompt = system_prompt;
    if (userPrompt) {
      final_prompt =
        system_prompt +
        "Here are some other requiremnets from the user , keep these in mind too: " +
        userPrompt;
    }

    console.log("Generating Images with the prompt " + final_prompt);
    const result = await fal.subscribe("fal-ai/bytedance/seedream/v4/edit", {
      input: {
        prompt: final_prompt,
        image_urls: uploadedUrls,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    console.log("done");

    await prisma.images.create({
        data:{
            link:result.data.images[0].url,
            creatorId: sessionUserId
        }
    })
    
    await prisma.user.update({
        where:{
            id: sessionUserId
        },
        data:{
            credits: user.credits - 1
        }
    })

    prisma.$disconnect()

    return NextResponse.json({
      success: true,
      data: result.data.images[0].url,
    });
  } catch (err: unknown) {
    console.error(err);
    prisma.$disconnect()
    const message = err instanceof Error ? err.message : "Internal error"
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
