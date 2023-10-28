"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiArrowDownSFill } from "react-icons/ri";
import { Client, Wallet, xrpToDrops } from "xrpl";

export default function Profile({ display, wcp }) {
  const [refresh, setRefresh] = useState(false);
  const [loading, setloading] = useState(false);

  const [filterVerified, setFilterVerified] = useState(false);
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

    if (wcp?.id) getWasteData();
  }, [refresh, wcp?.id]);

  return (
    // <div
    //   className={
    //     (display ? "flex " : "hidden ") + "absolute w-full h-full left-0 top-0"
    //   }
    // >
    <div className="bg-black border p-4 justify-center my-auto flex flex-col gap-4">
      <div className="flex border p-4"> WCP details</div>
      <div className="flex border p-4">
        {loading ? (
          "loading..."
        ) : (
          <div>
            <div>
              <div className="flex w-full justify-between">
                <button
                  onClick={() => setFilterVerified(false)}
                  className={`${
                    !filterVerified ? "border-b-2 " : ""
                  } mb-2 py-4 px-8`}
                >
                  Unverified Submitions
                </button>
                <button
                  onClick={() => setFilterVerified(true)}
                  className={`${
                    filterVerified ? "border-b-2 " : ""
                  } mb-2  py-4 px-8`}
                >
                  Verified Submitions
                </button>
              </div>
              <ul>
                {submitionsList
                  .filter((submition) => submition.verified === filterVerified)
                  .map((submition, index, array) => {
                    return (
                      <li
                        key={submition.id}
                        className="flex p-4 justify-between border gap-6"
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
                            className="flex relative justify-between gap-2 pl-4 pr-2 h-8  bg-gray-300/20 rounded-full"
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
                              } flex-col bg-black top-10 left-0 z-50 absolute`}
                            >
                              {submition.images.map((image, index) => {
                                return (
                                  <li
                                    className="p-2 w-32 border "
                                    key={image.id}
                                  >
                                    <Link href={image.url}>
                                      Image {index + 1}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </button>
                          <button
                            disabled={filterVerified}
                            className={`${
                              filterVerified
                                ? "bg-green-500/20 text-green-500 "
                                : "bg-red-500/20 hover:bg-red-400/40 text-red-500 "
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
                            {filterVerified ? "verified" : "verify"}
                          </button>
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </div>
            <button onClick={() => setRefresh(!refresh)}>refresh list</button>
          </div>
        )}
      </div>
    </div>
    // </div>
  );
}
