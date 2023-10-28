"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Client, Wallet, dropsToXrp } from "xrpl";

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
    <div className="flex w-1/2 flex-col gap-4 p-4">
      <div className="flex gap-4">
        <div className="p-4 flex border flex-col">
          <span>Total Bags Clenned</span>
          <span>10,749</span>
        </div>
        <div className="p-4 flex border flex-col">
          <span>Total Incentives Given</span>
          <span>$3,504.25</span>
        </div>
      </div>
      <div className="flex gap-4 flex-col ">
        <span>Recent Transactions</span>

        <ul className="flex gap-2 flex-col py-4 overflow-x-auto h-[21rem]">
          {transactionsList.map((transaction) => {
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
              <li className="border p-4 " key={transaction.tx.hash}>
                <span>
                  {transaction.tx.Destination} recorded {bags} wastes
                </span>
                <span>
                  <span>Recieved</span>
                  <span>{amount}</span>
                </span>
              </li>
            );
          })}
        </ul>
        <button onClick={() => setRefresh(!refresh)}>refresh list</button>
        <Link href={"/#"}>Your Clen-up History</Link>
      </div>
    </div>
  );
}
