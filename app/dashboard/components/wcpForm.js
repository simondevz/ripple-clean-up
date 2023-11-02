"use client";

import { useEffect, useState } from "react";
import validator from "validator";
import { VscLoading } from "react-icons/vsc";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateWCPList2 } from "../../reduxState/slice";
import { RiCloseFill } from "react-icons/ri";
import { useRouter } from "next/navigation";

const WcpForm = ({ onclick, wallet }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    function handleHashChange() {
      if (window.location.hash !== "#wcpform") {
        onclick();
      }
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div className="flex relative flex-col md:gap-4 gap-2 bg-white rounded-lg md:px-12 px-6 md:pt-16 pt-8 md:pb-8 pb-4 my-auto">
      <RiCloseFill
        onClick={() => {
          router.replace("/dashboard");
          onclick();
        }}
        className="absolute right-2 top-2 text-btnText h-6 w-6"
      />
      <span className="md:text-[0.75rem] text-[0.65rem] text-error">
        {errMsg}
      </span>
      <input
        onChange={(event) => setName(event.target.value)}
        className="md:border-4 border-2 border-primary focus:outline-none rounded-lg bg-transparent md:text-[0.875rem] text-[0.75rem] md:p-4 p-2"
        placeholder="Name"
        value={name}
      />
      {/* TODO: implement google api here */}
      <input
        onChange={(event) => setLocation(event.target.value)}
        className="md:border-4 border-2 border-primary focus:outline-none rounded-lg bg-transparent md:text-[0.875rem] text-[0.75rem] md:p-4 p-2"
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
          "md:border-4 border-2 focus:outline-none rounded-lg bg-transparent md:text-[0.875rem] text-[0.75rem] md:p-4 p-2"
        }
        placeholder="Email"
        value={email}
      />
      <input
        onChange={(event) => setPhone(event.target.value)}
        className={
          "border-primary md:border-4 border-2 focus:outline-none rounded-lg bg-transparent md:text-[0.875rem] text-[0.75rem] md:p-4 p-2"
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
        className="p-4 bg-primary rounded-lg md:text-[0.875rem] text-[0.75rem] font-semibold disabled:border-red-500"
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
