"use client";

import { FiHelpCircle } from "react-icons/fi";
import {
  RiFacebookBoxFill,
  RiInstagramFill,
  RiLinkedinBoxFill,
  RiTwitterXFill,
} from "react-icons/ri";
import { BiLogoPlayStore } from "react-icons/bi";
import { BsApple } from "react-icons/bs";

export default function Footer() {
  return (
    <footer className="flex lg:flex-row flex-col-reverse gap-8 md:p-20 p-6 justify-between bg-primary">
      <div className="flex flex-col justify-between gap-10">
        <div>
          <h4 className="md:text-[2.8rem] text-[2rem] font-semibold">
            Ripple Clean-Up
          </h4>
          <span className="flex gap-2">
            <FiHelpCircle className="my-auto" />
            <span className="md:text-[0.75rem] text-[0.65rem]">
              Help Center
            </span>
          </span>
        </div>

        <div className="flex flex-col gap-6">
          <button className="flex gap-2 py-2 px-6 rounded w-[13rem] bg-[#191919] ">
            <BsApple className="my-auto w-6 h-6 text-white" />
            <div className="flex flex-col my-auto text-white ">
              <span className="text-[0.65rem] flex">Download on the</span>
              <span className="flex font-semibold">App Store</span>
            </div>
          </button>
          <button className="flex gap-2 py-2 px-6 rounded w-[13rem] bg-[#191919] ">
            <BiLogoPlayStore className="my-auto w-6 h-6" />
            <div className="flex flex-col my-auto text-white ">
              <span className="text-[0.65rem] flex">Get it on</span>
              <span className="flex font-semibold">Google Play</span>
            </div>
          </button>
          <span className="md:text-[0.875rem] text-[0.75rem]">
            Download the Ripple Clean-Up App
          </span>
        </div>

        <div className="flex gap-4">
          <span>
            <RiInstagramFill className="text-[#545454] h-6 w-6" />
          </span>
          <span>
            <RiTwitterXFill className="text-[#545454] h-6 w-6" />
          </span>
          <span>
            <RiFacebookBoxFill className="text-[#545454] h-6 w-6" />
          </span>
          <span>
            <RiLinkedinBoxFill className="text-[#545454] h-6 w-6" />
          </span>
        </div>
      </div>

      <div className="flex gap-8 mx-auto lg:pr-56">
        <div className="flex flex-col justify-between gap-8 ">
          <div className="flex flex-col gap-4">
            <h6 className="flex font-semibold md:text-[0.875rem] text-[0.75rem]">
              About Ripple Clean-Up
            </h6>
            <div className="flex flex-col md:text-[0.875rem] text-[0.75rem]">
              <span>About WCP</span>
              <span>Trust and safety</span>
              <span>Do not share my info</span>
              <span>Community guidelines</span>
              <span>WCP Partners</span>
              <span>Blog</span>
              <span>Careers</span>
              <span>Become a Waste Collection Point</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h6 className="flex font-semibold md:text-[0.875rem] text-[0.75rem]">
              Top WCP States
            </h6>
            <div className="flex flex-col md:text-[0.875rem] text-[0.75rem]">
              <span>Enugu</span>
              <span>Abuja</span>
              <span>Lagos</span>
              <span>Port Harcourt</span>
              <span>Bayelsa</span>
              <span>Ebonyi</span>
              <span>Anambra</span>
              <span>Imo</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-4">
            <h6 className="flex font-semibold md:text-[0.875rem] text-[0.75rem]">
              Resources
            </h6>
            <div className="flex flex-col md:text-[0.875rem] text-[0.75rem]">
              <span>WCP Training</span>
              <span>WCP Grooming</span>
              <span>WCP Activities</span>
              <span>WCP Requirements</span>
              <span>WCP Agreement</span>
              <span>WCP Merits</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h6 className="flex font-semibold md:text-[0.875rem] text-[0.75rem]">
              Focus Areas
            </h6>
            <div className="flex flex-col md:text-[0.875rem] text-[0.75rem]">
              <span>Schools</span>
              <span>Universities</span>
              <span>Health Centers</span>
              <span>Recreation Centers</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h6 className="flex font-semibold md:text-[0.875rem] text-[0.75rem]">
              Security
            </h6>
            <div className="flex flex-col md:text-[0.875rem] text-[0.75rem]">
              <span>Responsible Disclosure</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
