"use client"
import { signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function AuthButtons({ session }: { session: any }) {
  return (
    <>
      {!session?(
        <Button
          onClick={() => {
            signIn("google");
          }}
        >
          Login
        </Button>
      ) : (
        <Button
          onClick={() => {
            signOut();
          }}
        >
          Sign Out
        </Button>
      )}
    </>
  );
}
