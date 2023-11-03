"use client";
import Image from "next/image";
import rippleLogo from "../../public/clenUpLogo.png";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="flex justify-between md:px-20 px-12 md:py-8 py-6">
      <div className="flex gap-2">
        <Image
          src={rippleLogo}
          alt="cc"
          className="md:w-8 w-6 md:h-8 h-6 my-auto"
        />
        <span className="md:text-[1.2rem] md:w-full w-[5rem] text-base my-auto font-semibold">
          Ripple Clean-Up
        </span>
      </div>

      <div className="lg:flex hidden gap-8">
        <span>Home</span>
        <span>Profile</span>
        <span>Dashboard</span>
        <span>Contact Us</span>
      </div>

      <div className="flex">
        {/* <button>Eng</button> */}
        <Link
          href={"/dashboard#openwallet"}
          className="rounded-xl bg-primary md:px-12 px-8 py-2 font-semibold md:text-[0.875rem] text-[0.75rem] my-auto"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
