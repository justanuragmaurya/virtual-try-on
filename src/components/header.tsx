import Link from "next/link";
import { ModeToggle } from "./toogle";
import { auth } from "@/lib/auth";
import AuthButtons from "./auth-buttons";

export default async function Header() {
  const session = await auth();
  
  return (
    <div className="border-b py-2">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div>
          <Link href={"/"}>
            <h1 className="font-bold text-xl ">👕 TryItOn </h1>
          </Link>
        </div>
        <div className="flex items-center gap-2">
            <AuthButtons session={session}/>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
