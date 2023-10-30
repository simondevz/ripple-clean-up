"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiArrowDownSFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Client, Wallet, xrpToDrops } from "xrpl";

export default function Profile({ wcp }) {
  const [refresh, setRefresh] = useState(false);
  const [loading, setloading] = useState(false);
  const { wallet } = useSelector((state) => state.app);

  const [filter, setFilter] = useState(false);
  const [displayImageList, setDisplayImageList] = useState(0);
  const [submitionsList, setSubmitionsList] = useState([]);

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

  return (
    <div className="bg-white rounded-lg py-4 px-8 justify-center my-auto flex flex-col gap-4">
      <h1 className="my-4 mx-auto font-semibold">
        Waste Collection Point Profile
      </h1>
      <div className="flex flex-col gap-4 rounded-lg bg-primary p-4 text-[0.875rem]">
        <div className="flex ">
          <span className="w-32 font-semibold">Name:</span>
          <span className="">{wcp?.name}</span>
        </div>
        <div className="flex ">
          <span className="w-32 font-semibold">Wallet Address:</span>
          <span className="">{wcp?.account}</span>
        </div>
        <div className="flex ">
          <span className="w-32 font-semibold">Location:</span>
          <span className="">{wcp?.address}</span>
        </div>
        <div className="flex ">
          <span className="w-32 font-semibold">Phone:</span>
          <span className="">{wcp?.phone}</span>
        </div>
        <div className="flex ">
          <span className="w-32 font-semibold">Email:</span>
          <span className="">{wcp?.email}</span>
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
                  } p-4 font-semibold bg-primary rounded-lg w-full`}
                >
                  Unverified Submitions
                </button>
                <button
                  onClick={() => setFilter("verified")}
                  className={`${
                    filter === "verified" ? "text-blue " : ""
                  } p-4 bg-primary font-semibold rounded-lg w-full`}
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
                        className="flex pt-10 pb-[.2rem] justify-between border-b border-[#a2a2a2] gap-6"
                      >
                        <span className="flex flex-col">
                          <span className="text-[0.875rem]">
                            Bags Submitted: {submition.number}
                          </span>
                          <span className="text-[0.75rem]">
                            Account: {submition.account}
                          </span>
                        </span>

                        <span className="flex gap-4 justify-between my-auto">
                          <button
                            onClick={() => {
                              if (displayImageList === Number(submition.id)) {
                                setDisplayImageList(0);
                                return;
                              }
                              setDisplayImageList(Number(submition.id));
                            }}
                            className="flex relative justify-between gap-2 pl-4 pr-2 h-8  bg-[#D9D9D9] rounded-full"
                          >
                            <span className="text-[0.875rem] my-auto">
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
                            } px-4 h-8 rounded-full text-[0.875rem]`}
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
