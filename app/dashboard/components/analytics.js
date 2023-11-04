"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Client, Wallet, dropsToXrp } from "xrpl";
import { GetTimeAgo, ShorthenedAddress } from "./utils";
import { TbReload } from "react-icons/tb";
import Popup from "./popup";
import SubmitionHistory from "./submittionHistory";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Analytics() {
  const [transactionsList, setTransactionList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [show, setShow] = useState(false);
  const [refreshClicked, setRefreshClicked] = useState(false);
  const router = useRouter();
  const [analytics, setAnalytics] = useState({ bags: 0, amount: 0 });

  useEffect(() => {
    // gets the number of bags and amount paid in the past week
    const getAnalytics = async () => {
      try {
        const {
          data: { data },
        } = await axios.get("/api/analytics");
        setAnalytics(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAnalytics();
  }, []);

  useEffect(() => {
    // gets transactions from the ledgrer
    const getTransactions = async () => {
      try {
        const wallet = Wallet.fromSeed(process.env.NEXT_PUBLIC_COMPANY_SEED);
        const client = new Client(process.env.NEXT_PUBLIC_XRPL_URL, {
          connectionTimeout: 20000,
        });

        // Wait for the client to connect
        await client.connect();

        // Get the transaction history
        const payload = {
          command: "account_tx",
          account: wallet.address,
          limit: 20,
        };

        const { result } = await client.request(payload);
        setTransactionList(result.transactions);

        await client.disconnect();
      } catch (error) {
        console.log(error);
      }
    };
    getTransactions();
  }, [refresh]);

  // tobe passed into a popup component
  const onclick = () => {
    setShow(false);
  };

  return (
    <>
      <div className="flex w-full flex-col relative gap-4 mb-4">
        <div className="flex gap-4">
          <div className="p-4 flex md:text-base text-[0.75rem] w-full rounded-lg bg-primary flex-col">
            <span className="font-semibold">Waste Collected This Week</span>
            <span>{analytics.bags}+</span>
          </div>
          <div className="p-4 flex w-full md:text-base text-[0.75rem] rounded-lg bg-primary flex-col">
            <span className="font-semibold">Amount Rewarded</span>
            <span>{analytics.amount}xrp+</span>
          </div>
        </div>

        <div className="flex flex-col bg-primary rounded-lg px-6 ">
          <span className="mt-6 md:text-base text-[0.75rem] justify-between flex font-semibold">
            <span>Recent Rewards for Recorded Wastes</span>
            <button
              className={refreshClicked ? "animate-spin-once" : ""}
              onClick={() => {
                setRefreshClicked(true);
                setRefresh(!refresh);
                setTimeout(() => {
                  setRefreshClicked(false);
                }, 1000);
              }}
            >
              <TbReload />
            </button>
          </span>

          <ul className="flex gap-2 flex-col py-4 overflow-x-auto h-[19rem]">
            {transactionsList.map((transaction) => {
              // still need to check that the destination is not its address
              if (transaction.tx.TransactionType !== "Payment") return;

              // Returns the amount recieved in xrp and no of bags the person gave
              const toBagsNAmount = (drops) => {
                const amount = dropsToXrp(Number(drops));
                const bags =
                  Number(amount) / Number(process.env.NEXT_PUBLIC_PAY_PER_BAG);
                return [amount, bags];
              };
              const [amount, bags] = toBagsNAmount(transaction.tx.Amount);

              return (
                <li
                  className="border-b border-[#a2a2a2] min-w-[30rem] flex justify-between md:text-[0.875rem] text-[0.75rem] pt-8 pb-2 mx-2"
                  key={transaction.tx.hash}
                >
                  <span className="flex gap-2">
                    <ShorthenedAddress address={transaction.tx.Destination} />
                    recorded {bags} wastes
                  </span>
                  <span className="flex gap-4">
                    <span>Recieved</span>
                    <span className="text-blue">+{amount}xrp</span>
                    {/* <span className="text-btnText text-[0.75rem]">
                    {<GetTimeAgo time={transaction.tx.date} />}
                  </span> */}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          onClick={() => {
            router.push("/dashboard#history");
            setShow(true);
          }}
          className="w-full bg-primary rounded-lg md:p-8 p-6 md:text-base text-[0.875rem]"
        >
          <span className="mx-auto font-semibold">
            Personal Clean up History
          </span>
        </button>
      </div>
      <Popup
        show={show}
        onclick={onclick}
        child={<SubmitionHistory onclick={onclick} />}
      />
    </>
  );
}
