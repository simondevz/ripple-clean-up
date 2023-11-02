import Image from "next/image";
import rippleLogo from "../../public/clenUpLogo.png";

export default function Header() {
  return (
    <nav className="flex justify-between px-20 py-8">
      <div className="flex gap-2">
        <Image src={rippleLogo} alt="cc" className="w-8 h-8" />
        <span className="text-[1.2rem] font-semibold">Ripple Clean-Up</span>
      </div>

      <div className="flex gap-8">
        <span>Home</span>
        <span>Profile</span>
        <span>Dashboard</span>
        <span>Contact Us</span>
      </div>

      <div className="flex">
        {/* <button>Eng</button> */}
        <button className="rounded-xl bg-primary px-12 py-2 font-semibold text-[0.875rem] my-auto">
          Get Started
        </button>
      </div>
    </nav>
  );
}
