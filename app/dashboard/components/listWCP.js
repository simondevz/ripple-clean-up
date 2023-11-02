"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convertToBase64 } from "./utils";
import Popup from "./popup";
import Profile from "./profile";
import { HiSearch } from "react-icons/hi";
import { updateWCPList } from "../../reduxState/slice";
import { VscLoading } from "react-icons/vsc";
import { RiArrowDownSFill, RiArrowUpSFill, RiCloseFill } from "react-icons/ri";
import { useRouter } from "next/navigation";

export default function ListWCP() {
  const [show, setShow] = useState("");
  const [filter, setfilter] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

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
    const [locationHash, setLocationHash] = useState("");

    const [displayList, setDisplayList] = useState(false);
    const [loading, setloading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
      function handleHashChange() {
        if (window.location.hash !== "#submittionform") {
          setLocationHash("");
          setShow("");
        }
      }

      window.addEventListener("hashchange", handleHashChange);
      return () => {
        window.removeEventListener("hashchange", handleHashChange);
      };
    }, [locationHash]);

    return (
      <div className="flex relative flex-col md:gap-6 gap-4 bg-white rounded-lg md:py-12 py-6 md:px-16 px-8 my-auto">
        <RiCloseFill
          onClick={() => {
            router.replace("/dashboard#submittionpage");
            setShow("");
          }}
          className="absolute right-2 top-2 text-btnText h-6 w-6"
        />
        <span className="md:text-[0.75rem] text-[0.65rem] text-error">
          {errMsg}
        </span>
        <button
          onClick={() => setDisplayList(!displayList)}
          className="flex flex-col  md:border-4 border-2 border-primary relative rounded-lg p-2"
        >
          <span className="md:text-[0.875rem] text-[0.75rem] font-semibold justify-between flex w-full">
            <span>Selected Waste Collection Point</span>
            {displayList ? (
              <RiArrowUpSFill className="my-auto" />
            ) : (
              <RiArrowDownSFill className="my-auto" />
            )}
          </span>
          <span className="md:text-[0.875rem] text-[0.75rem] flex w-full">
            {selectedWCP?.name || "Select a Waste Collection Point"}
          </span>

          <ul
            className={`${
              displayList ? "flex " : "hidden "
            } flex-col bg-white w-full md:h-[15rem] h-[12rem] rounded-lg md:border-4 border-2 border-primary top-[4.5rem] p-4 left-0 z-50  overflow-y-auto absolute`}
          >
            {listOfWCP.map((wcp) => {
              return (
                <li
                  onClick={() => setSelectedWCP(wcp)}
                  className="md:p-2 md:md-0 mb-2 border-b border-[#a2a2a2] flex flex-col "
                  key={wcp.id}
                >
                  <span className="md:text-[0.875rem] text-[0.75rem] flex  w-full">
                    {wcp.name}
                  </span>
                  <span className="md:text-[0.75rem] text-[0.65rem] flex w-full">
                    {wcp.address}
                  </span>
                </li>
              );
            })}
          </ul>
        </button>

        <input
          onChange={(event) => setFiles(event.target.files)}
          className=" md:border-4 border-2 border-primary rounded-lg focus:outline-none bg-transparent md:p-4 p-2 md:text-[0.875rem] text-[0.75rem]"
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
          className="focus:outline-none md:border-4 border-2 border-primary rounded-lg bg-transparent md:p-4 p-2 md:text-[0.875rem] text-[0.75rem]"
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
                setloading(false);
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
          <span className="mx-auto md:text-base text-[0.875rem] font-semibold">
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
    <div className={`flex flex-col gap-4 w-full`}>
      <div className="flex flex-col bg-primary gap-8 py-8 px-4 rounded-lg">
        <span className="flex bg-white rounded-full">
          <HiSearch className="my-auto w-4 h-4 ml-4 mr-2 text=[#434343]" />
          <input
            onChange={(event) => setfilter(event.target.value)}
            className="p-[.3rem] bg-transparent w-full rounded-full md:text-[0.875rem] text-[0.75rem] focus:outline-none"
            placeholder="Search Waste Collection Points"
            value={filter}
          />
        </span>

        <ul className="flex gap-2 flex-col md:py-4 py-2 overflow-x-auto md:h-[21rem] h-[17rem]">
          {wcpList
            .filter((item) => {
              return (
                item.name.toLowerCase().includes(filter.toLowerCase()) ||
                item.address.toLowerCase().includes(filter.toLowerCase())
              );
            })
            .map((wcp) => {
              return (
                <li
                  onClick={() => {
                    setShow("profile");
                    setProfileWCP(wcp);
                    router.push("/dashboard#profile");
                  }}
                  className="border-b border-[#A2A2A2] py-2 flex gap-2 flex-col"
                  key={wcp.id}
                >
                  <span className="md:text-[0.875rem] text-[0.75rem] text-btnText font-semibold">
                    {wcp.name}
                  </span>
                  <span className="md:text-[0.75rem] text-[0.65rem] text-btnText">
                    {wcp.address}
                  </span>
                </li>
              );
            })}
        </ul>
      </div>

      <span className="flex flex-col gap-2">
        <button
          onClick={() => {
            if (!connected) {
              alert("plese connect your wallet");
              return;
            }

            router.push("#submittionform");
            setTimeout(() => {
              setShow("submitform");
            }, 1000);
          }}
          className="bg-primary md:p-8 p-6 w-full rounded-lg flex"
        >
          <span className="mx-auto md:text-[0.875rem] text-[0.75rem] font-semibold">
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
            <Profile wcp={profileWCP} onclick={() => setShow("")} />
          )
        }
        onclick={() => {
          setShow("");
        }}
      />
    </div>
  );
}
