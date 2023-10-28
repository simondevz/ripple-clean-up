"use client";

import { useEffect, useState } from "react";
import Popup from "./popup";
import Wallet from "./wallet";
import Signup, { crypto } from "./signin";
import { useDispatch, useSelector } from "react-redux";
import {
  addWallet,
  toggleShowAddWallet,
  updateConnected,
  updateWCPdetails,
} from "../reduxState/slice";
import axios from "axios";
import { Client, Wallet as XrplWallet } from "xrpl";
import Image from "next/image";
import ripplelogo from "../../public/clenUpLogo.png";
import { RiArrowDownSLine } from "react-icons/ri";

// Idea: I could hash the users secret and save it on there localstorage
//   that way i can decode it later, or better yet use jwt for that.

export default function Navbar() {
  const [show, setShow] = useState(false);
  const { connected, wallet } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  useEffect(() => {
    const getWCPDetails = async () => {
      const { data } = await axios.get(
        `api/wcp?account=${wallet?.classicAddress}`
      );

      dispatch(updateWCPdetails(data));
    };

    if (wallet?.classicAddress) getWCPDetails();
  }, [dispatch, wallet?.classicAddress]);

  useEffect(() => {
    (async () => {
      const encrypted_seed = localStorage.getItem("ripple_clen_up");
      if (encrypted_seed) {
        const seed = crypto.decrypt(encrypted_seed);
        if (seed) {
          try {
            const client = new Client(process.env.NEXT_PUBLIC_XRPL_URL);
            await client.connect();

            // Create wallet and update the global state
            const wallet = XrplWallet.fromSeed(seed);
            dispatch(addWallet(JSON.parse(JSON.stringify(wallet)))); // To quiet a redux error, still works without it tho
            dispatch(updateConnected(true));

            // await client.disconnect();
          } catch (error) {
            console.log(error);
          }
        }
      }
    })();
  }, []);

  return (
    <div className="relative bg-milk flex flex-col">
      <nav className="flex justify-between p-4 ">
        <div className="flex justify-between gap-6">
          <div className="flex gap-2 justify-between">
            <Image src={ripplelogo} alt="cc" className="w-6 h-6 my-auto" />
            <span className="flex my-auto flex-col text-[0.75rem] font-semibold">
              <span className="leading-4">Ripple</span>
              <span className="leading-4">Clen Up</span>
            </span>
          </div>
          <button className="flex px-4 my-auto pt-[0.3rem] text-[#252045] text-[0.875rem] h-8 font-semibold bg-primary rounded-lg">
            Register as a WCP
          </button>
        </div>

        <span className="flex font-bold my-auto text-[1.5rem] relative left-[-5rem]">
          Dashboard
        </span>

        <button
          onClick={() => setShow(true)}
          className="flex  px-6 my-auto pt-[0.3rem] text-[0.875rem] h-8 font-semibold bg-primary rounded-lg"
        >
          {connected ? "Wallet" : "Connect Wallet"}
        </button>
      </nav>
      <Popup
        show={show}
        child={connected ? <Wallet /> : <Signup />}
        onclick={() => {
          setShow(false);
          dispatch(toggleShowAddWallet(false));
        }}
      />
    </div>
  );
}
