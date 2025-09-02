import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1]; 
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });

export const system_prompt = `Generate a realistic image of the person from Image 1 (the model) wearing the clothing item from Image 2. 
Preserve the model’s body, face, pose, and background exactly as in Image 1. 
Replace only the clothing with the garment from Image 2, ensuring correct fit, proportions, and natural fabric draping. 
Match lighting, shadows, and textures so the result looks like an authentic photo of the model actually wearing the garment. 
Do not alter the model’s identity, hairstyle, or accessories unless required for garment realism.
Given a screenshot or photo of a dress, analyze the garment’s shape, colors, and fabric details. Seamlessly add this dress onto the provided model’s full-body photo, ensuring realistic fit, natural shadows, proper draping, and fabric texture conformity. Adjust for body pose, lighting, and perspective so the final image appears as if the model is naturally wearing the captured dress.
`