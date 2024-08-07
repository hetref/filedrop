import { SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-4">
      <Link href="/">
        <h1 className="font-bold text-xl">FileDrop</h1>
      </Link>

      <div className="p-5 flex space-x-4 items-center">
        {/* Theme Toggler */}
        <ModeToggle />

        {/* Pricing button */}
        <Button variant="outline" className="hidden md:block" asChild>
          <Link href="/pricing">Pricing</Link>
        </Button>

        {/* Dashboard Button */}
        <SignedIn>
          <Button className="hidden sm:block" variant="outline" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </SignedIn>

        {/* User Button */}
        <UserButton afterSignOutUrl="/" />

        <SignedOut>
          {/* <SignInButton afterSignInUrl="/dashboard" mode="modal" /> */}
          <Button variant="outline" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </SignedOut>
      </div>
    </header>
  );
};

export default Header;
