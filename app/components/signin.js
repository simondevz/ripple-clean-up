import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addWallet,
  toggleConnected,
  toggleShowAddWallet,
} from "../reduxState/slice";
import { Client, Wallet, isValidSecret } from "xrpl";
import Cryptr from "cryptr";

export const crypto = new Cryptr(process.env.NEXT_PUBLIC_ENCRYPT_SECRET);

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [secret, setSecret] = useState("");
  const { showAddWallet } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const Notification = () => {
    return <div></div>;
  };

  const saveTolocalhost = (seed) => {
    const encrypted_seed = crypto.encrypt(seed);
    localStorage.setItem("ripple_clen_up", encrypted_seed);
  };

  return (
    <div className="flex flex-col gap-4 p-8 border">
      {showAddWallet ? (
        <>
          <input
            onChange={(event) => setSecret(event.target.value)}
            className="p-4 border bg-transparent"
            placeholder="Account Secret"
            value={secret}
          />
          <button
            disabled={!isValidSecret(secret) ? true : false} // Style diffrently and show validation error
            onClick={async () => {
              // This function gets an existing wallet/account with a seed/secret
              setLoading(true);

              try {
                const client = new Client(process.env.NEXT_PUBLIC_XRPL_URL);
                await client.connect();

                // Create wallet and update the global state
                const wallet = Wallet.fromSeed(secret);
                dispatch(addWallet(JSON.parse(JSON.stringify(wallet)))); // To quiet a redux error, still works without it tho
                dispatch(toggleConnected());
                console.log(wallet);

                await client.disconnect();
              } catch (error) {
                console.log(error);
              }
              setLoading(false);
            }}
            className="flex p-4 border"
          >
            Add Wallet
          </button>
        </>
      ) : (
        <>
          <button
            disabled={loading ? true : false}
            onClick={async () => {
              // This function creates a new wallet/account
              setLoading(true);
              try {
                const client = new Client(
                  "wss://s.altnet.rippletest.net:51233"
                );
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
            className="flex p-4 border"
          >
            {loading ? "loading..." : "Create New Account"}
          </button>

          <button
            onClick={() => {
              dispatch(toggleShowAddWallet(true));
            }}
            className="flex p-4 border"
          >
            Add Existing Wallet
          </button>
        </>
      )}
    </div>
  );
}
