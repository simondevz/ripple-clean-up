import Image from "next/image";
import { useEffect } from "react";
import { useState } from "react";
import { RiArrowDownLine, RiArrowUpLine } from "react-icons/ri";
import { BiMoneyWithdraw } from "react-icons/bi";
import { LuMoreVertical } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import ripplelogo from "../../../public/clenUpLogo.png";
import {
  Client,
  isValidClassicAddress,
  xrpToDrops,
  Wallet as XrplWallet,
  dropsToXrp,
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
      <div className="flex flex-col gap-6">
        <div className="flex justify-between gap-44">
          <span className="flex text-[0.875rem] text-ash">
            <IoIosArrowBack className="my-auto font-semibold" />
            <span className="my-auto">COIN</span>
          </span>
          <span className="flex text-[0.75rem] gap-2">
            <span className="text-ash">$0.56</span>
            <span className="text-blue">+0.97%</span>
          </span>
        </div>
        <div className="flex mx-auto flex-col justify-center">
          <Image src={ripplelogo} alt="cc" className="w-12 h-12 my-2 mx-auto" />
          <span className="font-semibold text-[1.2rem]">
            {dropsToXrp(balance)} XRP
          </span>
        </div>
        <div className="flex gap-10 mx-16 text-[0.875rem]">
          <button
            onClick={() => {
              setHideWallet(true);
              setShowSend(true);
            }}
            className="flex flex-col mx-auto gap-2"
          >
            <RiArrowUpLine className="w-10 h-10 p-2 bg-primary rounded-full  mx-auto" />
            <span>Send</span>
          </button>
          <button className="flex flex-col mx-auto gap-2">
            <RiArrowDownLine className="w-10 h-10 p-2 bg-primary rounded-full  mx-auto" />
            <span>Recieve</span>
          </button>
          {/* <button className="flex flex-col mx-auto gap-2">
            <BiMoneyWithdraw className="w-10 h-10 p-2 bg-primary rounded-full  mx-auto" />
            <span>Withdraw</span>
          </button>
          <button className="flex flex-col mx-auto gap-2">
            <LuMoreVertical className="w-10 h-10 p-2 bg-primary rounded-full  mx-auto" />
            <span>More</span>
          </button> */}
        </div>
      </div>
    );
  };

  const TransactionList = () => {
    return <div className="h-[20rem]">Transactions</div>;
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
        } p-8 flex-col gap-8 bg-white rounded-lg my-auto`}
      >
        <input
          onChange={(event) => setSendTo(event.target.value)}
          className="p-4 border-4 border-primary rounded-lg focus:outline-none bg-transparent"
          placeholder="Account Address"
          value={sendTo}
        />
        <input
          onChange={(event) => setAmount(event.target.value)}
          className="p-4 border-4 border-primary rounded-lg focus:outline-none bg-transparent"
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
            className="flex p-4 rounded-lg bg-primary w-full"
          >
            <span className="mx-auto">Send</span>
          </button>
          <button
            className="flex p-4 rounded-lg bg-primary w-full"
            onClick={() => {
              setHideWallet(false);
              setShowSend(false);
            }}
          >
            <span className="mx-auto">Cancel</span>
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
        } p-4 flex-col my-auto rounded-lg bg-white gap-4`}
      >
        <AccountInfo />
        <div className="flex bg-[#A2A2A2] w-full h-[0.1rem]">
          {/* <button
            onClick={() => {
              setHideWallet(true);
            }}
            className="flex p-4 border"
          >
            Swap Token
          </button> */}
        </div>
        <TransactionList />
      </div>

      <SendUi />
      <SwapUi />
    </>
  );
}
