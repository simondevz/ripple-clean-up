"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Client, Wallet, dropsToXrp } from "xrpl";
import { GetTimeAgo, ShorthenedAddress } from "./utils";

export default function Analytics() {
  const [transactionsList, setTransactionList] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const wallet = Wallet.fromSeed(process.env.NEXT_PUBLIC_COMPANY_SEED);
        const client = new Client(process.env.NEXT_PUBLIC_XRPL_URL);

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

  return (
    <div className="flex lg:w-1/2 w-full flex-col gap-4 mb-4">
      <div className="flex gap-4">
        <div className="p-4 flex w-full rounded-lg bg-primary flex-col">
          <span className="font-semibold">Waste Collected This Week</span>
          <span>10,749+</span>
        </div>
        <div className="p-4 flex w-full rounded-lg bg-primary flex-col">
          <span className="font-semibold">Amount Rewarded</span>
          <span>$3,504.25+</span>
        </div>
      </div>

      <div className="flex flex-col bg-primary rounded-lg px-6 ">
        <span className="mt-6 font-semibold">
          Recent Rewards for Recorded Wastes
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
                className="border-b border-[#a2a2a2] flex justify-between text-[0.875rem] pt-8 pb-2 mx-2"
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
        <button onClick={() => setRefresh(!refresh)}>refresh list</button>
      </div>

      <button className="w-full bg-primary rounded-lg p-8">
        <span className="mx-auto font-semibold">Personal Clean up History</span>
      </button>
    </div>
  );
}
