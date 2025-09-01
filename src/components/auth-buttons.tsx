"use client"
import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { Button } from "./ui/button";

export default function AuthButtons({ session }: { session: Session | null }) {
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
