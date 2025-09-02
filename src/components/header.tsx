import { Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { ModeToggle } from "./toogle";
import { auth } from "@/lib/auth";
import AuthButtons from "./auth-buttons";

const font = Instrument_Serif({
    subsets: ["latin"],
    weight: ["400"],
});

export default async function Header() {
  const session = await auth();

  return (
    <div className="border-b py-2">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div>
          <Link href={"/"}>
          <h1 className={`text-2xl ${font.className}`}>👕 Fit<span className="text-blue-400">Check</span></h1>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {session&&<Link href={"/images"} className="text-xs px-5">My Images</Link>}
          <AuthButtons session={session}/>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
