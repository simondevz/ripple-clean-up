"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { convertToBase64 } from "./utils";
import validator from "validator";
import Popup from "./popup";
import Profile from "./profile";

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
      <div className="flex flex-col gap-4 bg-black border p-4 my-auto">
        <button
          onClick={() => setDisplayList(!displayList)}
          className="flex flex-col border p-2"
        >
          <span className="text-[0.875rem] font-semibold">
            Selected Waste Collection Point:
          </span>
          <span className="text-[0.875rem]">
            {selectedWCP?.name || "Select a Waste Collection Point"}
          </span>

          <ul
            className={`${
              displayList ? "flex " : "hidden "
            } flex-col bg-black top-10 left-0 z-50 absolute`}
          >
            {listOfWCP.map((wcp) => {
              return (
                <li
                  onClick={() => setSelectedWCP(wcp)}
                  className="p-2 border "
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
          className="border bg-transparent p-4"
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
          className="border bg-transparent p-4"
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
                // wcpId: selectedWCP?.id,
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
          className="p-4 border"
        >
          Submit Waste
        </button>
      </div>
      // </div>
    );
  };

  return (
    <div className={`flex bg-primary flex-col gap-4 w-1/2`}>
      <input className="p-4 border bg-transparent" placeholder="Search WCP" />

      <ul className="flex gap-2 flex-col py-4 overflow-x-auto h-[21rem]">
        {wcpList.map((wcp) => {
          return (
            <li
              onClick={() => {
                setShow("profile");
                setProfileWCP(wcp);
              }}
              className="border p-4 flex flex-col"
              key={wcp.id}
            >
              <span className="text-[0.875rem]">{wcp.name}</span>
              <span className="text-[0.75rem]">{wcp.address}</span>
            </li>
          );
        })}
      </ul>

      <span className="flex flex-col gap-2 p-2">
        <button
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
          className="border p-4 flex"
        >
          Submit Proof of Work
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
