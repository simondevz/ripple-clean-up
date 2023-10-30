"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convertToBase64 } from "./utils";
import Popup from "./popup";
import Profile from "./profile";
import { HiSearch } from "react-icons/hi";
import { updateWCPList } from "../reduxState/slice";
import { VscLoading } from "react-icons/vsc";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";

export default function ListWCP() {
  const [show, setShow] = useState("");
  const dispatch = useDispatch();

  const [profileWCP, setProfileWCP] = useState(null);
  const { wallet, connected, wcpDetails, wcpList } = useSelector(
    (state) => state.app
  );

  useEffect(() => {
    const getWCPList = async () => {
      try {
        const { data } = await axios.get("/api/wcp?query=all");
        dispatch(updateWCPList(data));
      } catch (error) {
        console.log(error);
      }
    };
    getWCPList();
  }, [dispatch]);

  const SubmitForm = ({ listOfWCP }) => {
    const [files, setFiles] = useState([]);
    const [number, setNumber] = useState("");
    const [selectedWCP, setSelectedWCP] = useState(null);

    const [displayList, setDisplayList] = useState(false);
    const [loading, setloading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    return (
      <div className="flex flex-col gap-6 bg-white rounded-lg py-12 px-16 my-auto">
        <span className="text-[0.75rem] text-error">{errMsg}</span>
        <button
          onClick={() => setDisplayList(!displayList)}
          className="flex flex-col border-4 border-primary relative rounded-lg p-2"
        >
          <span className="text-[0.875rem] font-semibold justify-between flex w-full">
            <span>Selected Waste Collection Point</span>
            {displayList ? (
              <RiArrowUpSFill className="my-auto" />
            ) : (
              <RiArrowDownSFill className="my-auto" />
            )}
          </span>
          <span className="text-[0.875rem] flex w-full">
            {selectedWCP?.name || "Select a Waste Collection Point"}
          </span>

          <ul
            className={`${
              displayList ? "flex " : "hidden "
            } flex-col bg-white w-full h-[15rem] rounded-lg border-4 border-primary top-[4.5rem] p-4 left-0 z-50  overflow-y-auto absolute`}
          >
            {listOfWCP.map((wcp) => {
              return (
                <li
                  onClick={() => setSelectedWCP(wcp)}
                  className="p-2 border-b border-[#a2a2a2] flex flex-col "
                  key={wcp.id}
                >
                  <span className="text-[0.875rem] w-full">{wcp.name}</span>
                  <span className="text-[0.75rem] w-full">{wcp.address}</span>
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
              setloading(true);
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

              if (data.status > 199 && data.status < 300) {
                setloading(false);
                setShow("");
              } else {
                setErrMsg(
                  data.message ||
                    "Something went Wrong. Check your network and try again."
                );
              }
              console.log(data);
            } catch (error) {
              setloading(false);
              setErrMsg(
                "Something went Wrong. Check your network and try again."
              );
              console.log(error);
            }
          }}
          className="flex p-4 rounded-lg bg-primary w-full"
          disabled={loading}
        >
          <span className="mx-auto font-semibold">
            {loading ? (
              <VscLoading className="animate-spin mx-auto text-white" />
            ) : (
              "Submit Waste"
            )}
          </span>
        </button>
      </div>
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

      <span className="flex flex-col gap-2">
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
          show === "submitform" ? (
            <SubmitForm listOfWCP={wcpList} />
          ) : (
            <Profile wcp={profileWCP} />
          )
        }
        onclick={() => {
          setShow("");
        }}
      />
    </div>
  );
}
