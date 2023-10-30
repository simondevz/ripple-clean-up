"use client";

import { useState } from "react";
import validator from "validator";
import { VscLoading } from "react-icons/vsc";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateWCPList2 } from "../reduxState/slice";

const WcpForm = ({ onclick, wallet }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [location, setLocation] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col gap-4 bg-white rounded-lg px-12 pt-16 pb-8 my-auto">
      <span className="text-[0.75rem] text-error">{errMsg}</span>
      <input
        onChange={(event) => setName(event.target.value)}
        className="border-4 border-primary focus:outline-none rounded-lg bg-transparent p-4"
        placeholder="Name"
        value={name}
      />
      {/* TODO: implement google api here */}
      <input
        onChange={(event) => setLocation(event.target.value)}
        className="border-4 border-primary focus:outline-none rounded-lg bg-transparent p-4"
        placeholder="Address"
        value={location}
      />
      {/* // show validatione error */}
      <input
        onChange={(event) => setEmail(event.target.value)}
        className={
          (validator.isEmail(email) || !email
            ? "border-primary "
            : "border-error/70 ") +
          "border-4 focus:outline-none rounded-lg bg-transparent p-4"
        }
        placeholder="Email"
        value={email}
      />
      <input
        onChange={(event) => setPhone(event.target.value)}
        className={
          "border-primary border-4 focus:outline-none rounded-lg bg-transparent p-4"
        }
        placeholder="Phone Number"
        value={phone}
      />
      {/* Consider adding open from when to when */}
      <button
        disabled={loading}
        onClick={async () => {
          try {
            if (email && phone && location && name) {
              if (!validator.isEmail(email)) {
                setErrMsg("invalid Email");
                return;
              }

              setLoading(true);
              // Creates a waste collection point
              const { data } = await axios.post("/api/wcp", {
                name,
                address: location,
                account: wallet.classicAddress,
                phone,
                email,
              });
              dispatch(updateWCPList2(data));
              setLoading(false);
              if (onclick) onclick();
            } else {
              setErrMsg("Please fill all fields");
            }
          } catch (error) {
            setLoading(false);
            console.log(error);
          }
        }}
        className="p-4 bg-primary rounded-lg font-semibold disabled:border-red-500"
      >
        {loading ? (
          <VscLoading className="animate-spin mx-auto text-white" />
        ) : (
          "Become WCP"
        )}
      </button>
    </div>
  );
};
export default WcpForm;
