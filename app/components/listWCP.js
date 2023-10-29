"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { convertToBase64 } from "./utils";
import validator from "validator";
import Popup from "./popup";
import Profile from "./profile";
import { HiSearch } from "react-icons/hi";

export default function ListWCP() {
  const [wcpList, setWCPList] = useState([]);
  const [show, setShow] = useState("");

  const [profileWCP, setProfileWCP] = useState(null);
  const { wallet, connected, wcpDetails } = useSelector((state) => state.app);

  useEffect(() => {
    const getWCPList = async () => {
      try {
        const { data } = await axios.get("/api/wcp?query=all");
        setWCPList(() => data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getWCPList();
  }, []);

  const WcpForm = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");

    return (
      // <div
      //   className={
      //     (showWCPForm ? "flex " : "hidden ") +
      //     "absolute top-0 left-0 w-full h-full justify-around"
      //   }
      // >
      <div className="flex flex-col gap-4 bg-black border p-4 my-auto">
        <input
          onChange={(event) => setName(event.target.value)}
          className="border bg-transparent p-4"
          placeholder="Name"
          value={name}
        />
        {/* TODO: implement google api here */}
        <input
          onChange={(event) => setLocation(event.target.value)}
          className="border bg-transparent p-4"
          placeholder="Address"
          value={location}
        />
        {/* // show validatione error */}
        <input
          onChange={(event) => setEmail(event.target.value)}
          className="border bg-transparent p-4"
          placeholder="Email"
          value={email}
        />
        <input
          onChange={(event) => setPhone(event.target.value)}
          className="border bg-transparent p-4"
          placeholder="Phone Number"
          value={phone}
        />
        {/* Consider adding open from when to when */}
        <button
          // disabled={(() => {
          //   if (!name) return true;
          //   if (!location) return true;
          //   if (!phone) return true;
          //   if (phone && !validator.isMobilePhone(phone)) return true;
          //   if (!email) return false;
          //   if (email && !validator.isEmail(email)) return true;
          //   return false;
          // })()}
          onClick={async () => {
            if (!connected) alert("plese connect your wallet");
            try {
              // Creates a waste collection point
              const { data } = await axios.post("/api/wcp", {
                name,
                address: location,
                account: wallet.classicAddress,
              });
              setWCPList((currentList) => [...currentList, data]);
              setShowWCPForm(false);
            } catch (error) {
              console.log(error);
            }
          }}
          className="p-4 border disabled:border-red-500"
        >
          Become WCP
        </button>
        {/* </div> */}
      </div>
    );
  };

  const SubmitForm = ({ listOfWCP }) => {
    const [files, setFiles] = useState([]);
    const [number, setNumber] = useState("");
    const [selectedWCP, setSelectedWCP] = useState(null);
    const [displayList, setDisplayList] = useState(false);

    return (
      <div className="flex flex-col gap-6 bg-white rounded-lg py-12 px-16 my-auto">
        <button
          onClick={() => setDisplayList(!displayList)}
          className="flex flex-col border-4 border-primary relative rounded-lg p-2"
        >
          <span className="text-[0.875rem] font-semibold flex w-full">
            Selected Waste Collection Point:
          </span>
          <span className="text-[0.875rem] flex w-full">
            {selectedWCP?.name || "Select a Waste Collection Point"}
          </span>

          <ul
            className={`${
              displayList ? "flex " : "hidden "
            } flex-col bg-white w-full rounded-lg top-[4.5rem] p-4 left-0 z-50 absolute`}
          >
            {listOfWCP.map((wcp) => {
              return (
                <li
                  onClick={() => setSelectedWCP(wcp)}
                  className="p-2 border-b "
                  key={wcp.id}
                >
                  <span>{wcp.name}</span>
                  <span>{wcp.location}</span>
                </li>
              );
            })}
          </ul>
        </button>

        <input
          onChange={(event) => setFiles(event.target.files)}
          className="border-4 border-primary rounded-lg focus:outline-none bg-transparent p-4"
          type="file"
          multiple
        />
        {/* show error if number is not a number */}
        <input
          onChange={(event) => {
            const val = Number(event.target.value);
            if (val > 0) {
              setNumber(val);
              return;
            }

            setNumber("");
          }}
          className="focus:outline-none border-4 border-primary rounded-lg bg-transparent p-4"
          placeholder="Number of Bags collected"
          value={Number(number) || ""}
        />
        <button
          onClick={async () => {
            if (!connected) {
              alert("plese connect your wallet");
              return;
            }

            try {
              // Submit waste data
              const headers = {
                "Content-Type": "application/json",
              };
              let images = [];
              for (let index = 0; index < files.length; index++) {
                let file = await convertToBase64(files[index]);
                images = [...images, file];
              }

              const reqData = {
                images,
                number,
                wcpId: selectedWCP?.id,
                account: wallet.classicAddress,
              };

              const { data } = await axios.post("/api/wastedata", reqData, {
                headers,
              });
              console.log(data);
              // setShowWCPForm(false);
            } catch (error) {
              console.log(error);
            }
          }}
          className="flex p-4 rounded-lg bg-primary w-full"
        >
          <span className="mx-auto">Submit Waste</span>
        </button>
      </div>
      // </div>
    );
  };

  return (
    <div className={`flex flex-col gap-4 w-1/2`}>
      <div className="flex flex-col bg-primary gap-8 py-8 px-4 rounded-lg">
        <span className="flex bg-white rounded-full">
          <HiSearch className="my-auto w-4 h-4 ml-4 mr-2 text=[#434343]" />
          <input
            className="p-[.3rem] bg-transparent w-full rounded-full focus:outline-none"
            placeholder="Search Waste Collection Points"
          />
        </span>

        <ul className="flex gap-2 flex-col py-4 overflow-x-auto h-[21rem]">
          {wcpList.map((wcp) => {
            return (
              <li
                onClick={() => {
                  setShow("profile");
                  setProfileWCP(wcp);
                }}
                className="border-b border-[#A2A2A2] py-2 flex gap-2 flex-col"
                key={wcp.id}
              >
                <span className="text-[0.875rem] text-btnText font-semibold">
                  {wcp.name}
                </span>
                <span className="text-[0.75rem] text-btnText">
                  {wcp.address}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <span className="flex flex-col gap-2 p-2">
        <button
          className="hidden"
          onClick={() => {
            if (!connected) {
              alert("plese connect your wallet");
              return;
            }
            setShow("wcpform");
          }}
        >
          Become a WCP
        </button>
        <button
          onClick={() => {
            if (!connected) {
              alert("plese connect your wallet");
              return;
            }

            setShow("submitform");
          }}
          className="bg-primary p-8 w-full rounded-lg flex"
        >
          <span className="mx-auto text-[0.875rem] font-semibold">
            Submit Waste Bags
          </span>
        </button>
      </span>
      <Popup
        show={show}
        child={
          show === "wcpform" ? (
            <WcpForm />
          ) : show === "submitform" ? (
            <SubmitForm listOfWCP={wcpList} />
          ) : (
            <Profile
              wcp={wcpDetails?.id === profileWCP?.id ? wcpDetails : profileWCP}
            />
          )
        }
        onclick={() => {
          setShow("");
        }}
      />
    </div>
  );
}
