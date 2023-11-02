"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RiArrowDownSFill, RiCloseFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Client, Wallet, xrpToDrops } from "xrpl";
import { ShorthenedAddress } from "./utils";

export default function Profile({ wcp, onclick }) {
  const [refresh, setRefresh] = useState(false);
  const [loading, setloading] = useState(false);
  const { wallet } = useSelector((state) => state.app);

  const [filter, setFilter] = useState(false);
  const [displayImageList, setDisplayImageList] = useState(0);
  const [submitionsList, setSubmitionsList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // only runs if wallet address === wcp address
    const getWasteData = async () => {
      setloading(true);
      try {
        const { data } = await axios.get(`/api/wastedata/?id=${wcp?.id}`);
        console.log(data.data);
        setSubmitionsList(data.data);
      } catch (error) {
        console.log(error);
      }
      setloading(false);
    };

    if (wcp?.account === wallet?.classicAddress) {
      getWasteData();
    } else {
      setSubmitionsList(null);
    }
  }, [refresh, wcp?.account, wallet?.classicAddress]);

  useEffect(() => {
    function handleHashChange() {
      if (window.location.hash !== "#profile") {
        onclick();
      }
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div className="bg-white relative rounded-lg md:py-4 py-2 md:px-8 px-2 justify-center my-auto flex flex-col gap-4">
      <RiCloseFill
        onClick={() => {
          router.replace("/dashboard#submittionpage");
          onclick();
        }}
        className="absolute right-2 top-2 text-btnText h-6 w-6"
      />
      <h1 className="md:my-4 md:text-base text-[0.875rem] mt-2 mx-auto font-semibold">
        Waste Collection Point Profile
      </h1>
      <div className="flex flex-col md:gap-4 gap-2 rounded-lg bg-primary md:p-4 p-2 md:text-[0.875rem] text-[0.65rem]">
        <div className="flex ">
          <span className="md:w-32 w-24  font-semibold">Name:</span>
          <span className="text-[0.65rem]">{wcp?.name}</span>
        </div>
        <div className="flex ">
          <span className="md:w-32 w-24 font-semibold">Wallet Address:</span>
          <span className="text-[0.65rem]">{wcp?.account}</span>
        </div>
        <div className="flex ">
          <span className="md:w-32 w-24  font-semibold">Location:</span>
          <span className="text-[0.65rem]">{wcp?.address}</span>
        </div>
        <div className="flex ">
          <span className="md:w-32 w-24  font-semibold">Phone:</span>
          <span className="text-[0.65rem]">{wcp?.phone}</span>
        </div>
        <div className="flex ">
          <span className="md:w-32 w-24  font-semibold">Email:</span>
          <span className="text-[0.65rem]">{wcp?.email}</span>
        </div>
      </div>

      {submitionsList && (
        <div className="flex">
          {loading ? (
            "loading..."
          ) : (
            <div className="w-full">
              <div className="flex w-full gap-2 justify-between">
                <button
                  onClick={() => setFilter("unverified")}
                  className={`${
                    filter === "unverified" ? "text-error " : ""
                  } p-4 md:text-base text-[0.75rem] font-semibold bg-primary rounded-lg w-full`}
                >
                  Unverified Submitions
                </button>
                <button
                  onClick={() => setFilter("verified")}
                  className={`${
                    filter === "verified" ? "text-blue " : ""
                  } p-4  md:text-base text-[0.75rem] bg-primary font-semibold rounded-lg w-full`}
                >
                  Verified Submitions
                </button>
              </div>
              <ul>
                {submitionsList
                  .filter((submition) => {
                    if (!filter) return submition;
                    if (filter === "unverified")
                      return submition.verified === false;
                    if (filter === "verified")
                      return submition.verified === true;
                  })
                  .map((submition, index, array) => {
                    return (
                      <li
                        key={submition.id}
                        className="flex md:pt-10 pt-6 pb-[.2rem] justify-between border-b border-[#a2a2a2] md:gap-6 gap-2"
                      >
                        <span className="flex flex-col">
                          <span className="text-[0.65rem] ">
                            <span className="font-semibold">
                              Bags Submitted:
                            </span>
                            <span> {submition.number}</span>
                          </span>
                          <span className="text-[0.65rem]">
                            <span className="font-semibold">Account:</span>{" "}
                            <ShorthenedAddress address={submition.account} />
                          </span>
                        </span>

                        <span className="flex nd:gap-4 gap-2 justify-between my-auto">
                          <button
                            onClick={() => {
                              if (displayImageList === Number(submition.id)) {
                                setDisplayImageList(0);
                                return;
                              }
                              setDisplayImageList(Number(submition.id));
                            }}
                            className="flex relative justify-between gap-2 md:pl-4 pl-2 pr-2 md:h-8 h-4  bg-[#D9D9D9] rounded-full"
                          >
                            <span className="text-[0.65rem] my-auto">
                              images
                            </span>
                            <RiArrowDownSFill className="my-auto" />

                            <ul
                              className={`${
                                displayImageList === Number(submition.id)
                                  ? "flex "
                                  : "hidden "
                              } flex-col bg-milk rounded-lg top-10 left-0 z-50 absolute`}
                            >
                              {submition.images.map((image, index) => {
                                return (
                                  <li
                                    className="p-2 w-32 hover:underline"
                                    key={image.id}
                                  >
                                    <Link href={image.url} target="_blank">
                                      Image {index + 1}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </button>
                          <button
                            disabled={submition.verified}
                            className={`${
                              submition.verified
                                ? " text-blue "
                                : " text-error hover:bg-error/20 "
                            } px-4 md:h-8 rounded-full mb-4 text-[0.65rem]`}
                            onClick={async () => {
                              // Amount we send for each bag collected
                              const perBag = Number(
                                process.env.NEXT_PUBLIC_PAY_PER_BAG
                              );
                              const client = new Client(
                                process.env.NEXT_PUBLIC_XRPL_URL
                              );
                              await client.connect();

                              try {
                                // Wallet where the price comes from
                                const company_wallet = Wallet.fromSeed(
                                  process.env.NEXT_PUBLIC_COMPANY_SEED
                                );
                                const tx = {
                                  TransactionType: "Payment",
                                  Amount: xrpToDrops(
                                    Number(submition.number) * perBag
                                  ),
                                  Destination: submition.account,
                                  Account: company_wallet.classicAddress,
                                };

                                const response = await client.submit(tx, {
                                  wallet: company_wallet,
                                });
                                console.log(response);

                                // Get update the database and update the state
                                const { data } = await axios.put(
                                  `/api/wastedata?id=${submition.id}`
                                );
                                array[index] = data.data;
                                setSubmitionsList(array);

                                console.log(data);
                              } catch (error) {
                                console.log(error);
                              }
                              await client.disconnect();
                            }}
                          >
                            {submition.verified ? "verified" : "verify"}
                          </button>
                        </span>
                      </li>
                    );
                  })}
              </ul>
              <button
                className="text-[0.75rem] hover:text-blue hover:underline"
                onClick={() => setRefresh(!refresh)}
              >
                refresh list
              </button>
              <button
                className="text-[0.75rem] hover:text-blue hover:underline mx-2"
                onClick={() => setFilter(null)}
              >
                back
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
