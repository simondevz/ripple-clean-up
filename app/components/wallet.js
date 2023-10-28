import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Client,
  isValidClassicAddress,
  xrpToDrops,
  Wallet as XrplWallet,
} from "xrpl";

export default function Wallet() {
  const [hideWallet, setHideWallet] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [balance, setBalance] = useState(0);

  const [amount, setAmount] = useState("");
  const [sendTo, setSendTo] = useState("");
  const { wallet } = useSelector((state) => state.app);

  useEffect(() => {
    const fetchBalance = async () => {
      console.log("running.....");
      try {
        const client = new Client(process.env.NEXT_PUBLIC_XRPL_URL, {
          connectionTimeout: 10000,
        });
        await client.connect();

        const {
          result: { account_data },
        } = await client.request({
          command: "account_info",
          account: wallet.classicAddress,
          ledger_index: "validated",
        });

        setBalance(() => account_data.Balance);
        await client.disconnect();
      } catch (error) {
        console.log(error);
      }
    };
    fetchBalance();
  }, [wallet.classicAddress]);

  const AccountInfo = () => {
    return (
      <div className="flex flex-col">
        {/* // format balance to xrp */}
        <span>Balance: {balance}XRP</span>
        <span>Address: {wallet?.classicAddress}</span>
      </div>
    );
  };

  const TransactionList = () => {
    return <div>Transactions</div>;
  };

  const SwapUi = () => {
    return (
      <div
        className={`${
          hideWallet && !showSend ? "flex " : "hidden "
        } p-4 flex-col gap-4 border`}
      >
        <input className="p-4 border bg-transparent" placeholder="XPRL" />
        <input className="p-4 border bg-transparent" placeholder="USDT" />

        <div className="flex gap-4">
          <button className="flex p-4 border">Swap</button>
          <button
            className="flex p-4 border"
            onClick={() => {
              setHideWallet(false);
              setShowSend(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const SendUi = () => {
    return (
      <div
        className={`${
          hideWallet && showSend ? "flex " : "hidden "
        } p-4 flex-col gap-4 border`}
      >
        <input
          onChange={(event) => setSendTo(event.target.value)}
          className="p-4 border bg-transparent"
          placeholder="Account Address"
          value={sendTo}
        />
        <input
          onChange={(event) => setAmount(event.target.value)}
          className="p-4 border bg-transparent"
          placeholder="Amount"
          value={amount}
        />

        <div className="flex gap-4">
          <button
            disabled={
              isValidClassicAddress(sendTo) && Number(amount) ? false : true
            } // Style diffrently and add validation
            onClick={async () => {
              const client = new Client(process.env.NEXT_PUBLIC_XRPL_URL, {
                connectionTimeout: 10000,
              });
              await client.connect();
              const txWallet = XrplWallet.fromSeed(wallet.seed);

              const tx = {
                TransactionType: "Payment",
                Amount: xrpToDrops(amount),
                Destination: sendTo,
                Account: txWallet.classicAddress,
              };

              const response = await client.submit(tx, { wallet: txWallet });
              setHideWallet(false);
              setShowSend(false);
              console.log(response);
              await client.disconnect();
            }}
            className="flex p-4 border"
          >
            Send
          </button>
          <button
            className="flex p-4 border"
            onClick={() => {
              setHideWallet(false);
              setShowSend(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`${
          hideWallet ? "hidden " : "flex "
        } p-4 flex-col gap-4 border`}
      >
        <AccountInfo />
        <div className="flex gap-4">
          <button
            onClick={() => {
              setHideWallet(true);
            }}
            className="flex p-4 border"
          >
            Swap Token
          </button>

          <button
            onClick={() => {
              setHideWallet(true);
              setShowSend(true);
            }}
            className="flex p-4 border"
          >
            Send Token
          </button>
        </div>
        <TransactionList />
      </div>

      <SendUi />
      <SwapUi />
    </>
  );
}
