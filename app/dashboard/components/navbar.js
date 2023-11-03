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
} from "../../reduxState/slice";
import axios from "axios";
import { Client, Wallet as XrplWallet } from "xrpl";
import Image from "next/image";
import ripplelogo from "../../../public/clenUpLogo.png";
import WcpForm from "./wcpForm";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

// Idea: I could hash the users secret and save it on there localstorage
//   that way i can decode it later, or better yet use jwt for that.

export default function Navbar() {
  const [show, setShow] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { connected, wallet } = useSelector((state) => state.app);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.hash === "#openwallet") {
      setShow(true);
      router.replace("/dashboard");
      router.push(connected ? "/dashboard#wallet" : "/dashboard#connectwallet");
    }
  }, []);

  useEffect(() => {
    const getWCPDetails = async () => {
      const { data } = await axios.get(
        `api/wcp?account=${wallet?.classicAddress}`
      );

      dispatch(updateWCPdetails(data));
    };

    if (wallet?.classicAddress) getWCPDetails();
  }, [dispatch, wallet?.classicAddress]);

  // The implementation of the above idea, but i did not use hash or jwt for obvious reasons
  useEffect(() => {
    (async () => {
      const encrypted_seed = localStorage.getItem("ripple_clen_up");
      if (encrypted_seed) {
        const seed = crypto.decrypt(encrypted_seed);
        if (seed) {
          try {
            const client = new Client(process.env.NEXT_PUBLIC_XRPL_URL, {
              connectionTimeout: 20000,
            });
            await client.connect();

            // Create wallet and update the global state
            const wallet = XrplWallet.fromSeed(seed);
            dispatch(addWallet(JSON.parse(JSON.stringify(wallet)))); // To quiet a redux error, still works without it tho
            dispatch(updateConnected(true));
            console.log(wallet);

            // await client.disconnect();
          } catch (error) {
            console.log(error);
          }
        }
      }
    })();
  }, []);

  const onclick = () => {
    setShow(false);
    dispatch(toggleShowAddWallet(false));
  };

  return (
    <>
      <div className="relative bg-milk flex flex-col">
        <nav className="flex justify-between p-4 ">
          <div className="flex justify-between gap-6">
            <div className="flex gap-2 justify-between">
              <Image src={ripplelogo} alt="cc" className="w-6 h-6 my-auto" />
              <span className="flex my-auto flex-col text-[0.75rem] font-semibold">
                <span className="leading-4">Ripple</span>
                <span className="leading-4">Clean Up</span>
              </span>
            </div>
            <button
              onClick={() => setShow("wcpform")}
              className="md:flex hidden px-4 my-auto pt-[0.3rem] text-[#252045] text-[0.875rem] h-8 font-semibold bg-primary rounded-lg"
            >
              Register as a WCP
            </button>
          </div>

          <span className="md:flex hidden font-bold my-auto text-[1.5rem] relative left-[-5rem]">
            Dashboard
          </span>

          <div className="flex gap-2 relative">
            <button
              onClick={() => {
                setShow(true);
                router.push(`/dashboard#connectwallet`);
              }}
              className="flex  px-6 my-auto md:pt-[0.3rem] pt-[0.4rem] md:text-[0.875rem] text-[0.75rem] h-8 font-semibold bg-primary rounded-lg"
            >
              {connected ? "Wallet" : "Connect Wallet"}
            </button>
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="flex relative gap-[0.3rem] my-auto bg-primary rounded-lg py-2 pl-2 pr-[0.3rem]"
            >
              <Image src={ripplelogo} alt="cc" className="w-4 h-4" />
              {openMenu ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
            </button>
            <ul
              className={
                (openMenu ? "flex " : "hidden ") +
                "absolute flex-col top-[2.5rem] right-[0.2rem] bg-white p-2 gap-2 rounded-lg z-50 shadow-2xl"
              }
            >
              <li className="flex md:hidden w-full rounded-lg hover:bg-milk p-2">
                <span
                  onClick={() => {
                    setShow("wcpform");
                    setOpenMenu(!openMenu);
                  }}
                  className="flex my-auto whitespace-nowrap text-[#252045] text-[0.75rem] font-semibold"
                >
                  Register as a WCP
                </span>
              </li>
              <li className="flex w-full rounded-lg hover:bg-milk p-2">
                <span
                  onClick={() => {
                    localStorage.removeItem("ripple_clen_up");
                    dispatch(updateConnected(false));
                    dispatch(addWallet(null));
                    setOpenMenu(!openMenu);
                  }}
                  className="flex whitespace-nowrap my-auto text-[#252045] text-[0.75rem] font-semibold "
                >
                  Disconnect Wallet
                </span>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <Popup
        show={show}
        child={
          show === "wcpform" ? (
            <WcpForm onclick={onclick} wallet={wallet} />
          ) : connected ? (
            <Wallet onclick={onclick} />
          ) : (
            <Signup onclick={onclick} />
          )
        }
        onclick={onclick}
      />
    </>
  );
}
