import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addWallet,
  toggleConnected,
  toggleShowAddWallet,
} from "../../reduxState/slice";
import { Client, Wallet, isValidSecret } from "xrpl";
import Cryptr from "cryptr";
import { useRouter } from "next/navigation";
import { RiCloseFill } from "react-icons/ri";

export const crypto = new Cryptr(process.env.NEXT_PUBLIC_ENCRYPT_SECRET);

export default function Signup({ onclick }) {
  const [loading, setLoading] = useState(false);
  const [secret, setSecret] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [locationHash, setLocationHash] = useState("#connectwallet");
  const { showAddWallet } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const router = useRouter();

  const Notification = () => {
    return <div></div>;
  };

  useEffect(() => {
    function handleHashChange() {
      if (window.location.hash !== "#connectwallet") {
        setLocationHash("");
        setErrMsg("");
        onclick();
      }
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [locationHash]);

  const saveTolocalhost = (seed) => {
    const encrypted_seed = crypto.encrypt(seed);
    localStorage.setItem("ripple_clen_up", encrypted_seed);
  };

  return (
    <div className="flex relative flex-col md:gap-8 gap-6 md:p-16 p-12 bg-white my-auto z-50 rounded-lg">
      <RiCloseFill
        onClick={() => {
          router.back();
          setErrMsg("");
          onclick();
        }}
        className="absolute right-2 top-2 text-btnText h-6 w-6"
      />
      <span className="md:text-[0.75rem] text-[0.65rem] text-error">
        {errMsg}
      </span>
      <>
        <button
          disabled={loading ? true : false}
          onClick={async () => {
            // This function creates a new wallet/account
            setLoading(true);
            try {
              const client = new Client("wss://s.altnet.rippletest.net:51233");
              await client.connect();

              // Create wallet and update the global state
              const wallet = Wallet.generate();
              dispatch(addWallet(JSON.parse(JSON.stringify(wallet)))); // To quiet a redux error, still works without it tho
              dispatch(toggleConnected());
              saveTolocalhost(wallet.seed);

              await client.disconnect();
            } catch (error) {
              console.log(error);
            }
            setLoading(false);
          }}
          className="flex md:p-8 p-6 font-semibold md:text-[0.875rem] text-[0.75rem] bg-primary rounded-lg text-btnText "
        >
          <span className="mx-auto">
            {loading ? "loading..." : "Create New Wallet!"}
          </span>
        </button>

        {showAddWallet ? (
          <>
            <input
              onChange={(event) => setSecret(event.target.value)}
              className="md:p-4 p-2 md:border-4 border-2 rounded-lg border-primary  md:text-[0.875rem] text-[0.75rem] bg-transparent focus:outline-none"
              placeholder="Enter Secret"
              value={secret}
            />
            <button
              disabled={!isValidSecret(secret) ? true : false} // Style diffrently and show validation error
              onClick={async () => {
                // This function gets an existing wallet/account with a seed/secret
                setLoading(true);

                try {
                  const client = new Client(process.env.NEXT_PUBLIC_XRPL_URL, {
                    connectionTimeout: 10000,
                  });
                  await client.connect();

                  // Create wallet and update the global state
                  const wallet = Wallet.fromSeed(secret);
                  dispatch(addWallet(JSON.parse(JSON.stringify(wallet)))); // To quiet a redux error, still works without it tho
                  dispatch(toggleConnected());
                  saveTolocalhost(secret);
                  router.replace("/dashboard#wallet");
                  console.log(wallet);

                  await client.disconnect();
                } catch (error) {
                  console.log(error);
                  const message = error?.message.includes("5000")
                    ? "Connection Timed out. Check your networt and try again..."
                    : "Something went Wrong. Please try again.";
                  setErrMsg(message);
                }
                setLoading(false);
              }}
              className="flex md:px-8 px-4 md:py-4 py-2 text-center font-semibold md:text-[0.875rem] text-[0.75rem] bg-primary rounded-lg text-btnText "
            >
              <span className="mx-auto">Connect Wallet</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              dispatch(toggleShowAddWallet(true));
            }}
            className="flex md:p-8 p-6 font-semibold md:text-[0.875rem] text-[0.75rem] bg-primary rounded-lg text-btnText "
          >
            Add Existing Wallet
          </button>
        )}
      </>
    </div>
  );
}
