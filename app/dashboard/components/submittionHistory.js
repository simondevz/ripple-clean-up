import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { useSelector } from "react-redux";

export default function SubmitionHistory({ onclick }) {
  const router = useRouter();
  const [historyList, setHistoryList] = useState([]);
  const { wallet } = useSelector((state) => state.app);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const { data } = await axios.get(
          `/api/history?account=${wallet?.classicAddress}`
        );
        console.log(data);
        setHistoryList(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (wallet?.classicAddress) getHistory();
  }, [wallet?.classicAddress]);

  useEffect(() => {
    function handleHashChange() {
      if (window.location.hash !== "#history") {
        onclick();
      }
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div className="relative flex flex-col gap-2 bg-white md:p-8 p-4 my-auto rounded-lg">
      <RiCloseFill
        onClick={() => {
          router.replace("/dashboard#analytics");
          onclick();
        }}
        className="absolute right-2 top-2 text-btnText h-6 w-6"
      />
      <h2 className="font-semibold md:text-base text-[0.875rem] ">
        Personal Clean Up History
      </h2>
      <ul className="flex flex-col bg-primary relative rounded-lg md:gap-4 gap-2 w-full h-[30rem] overflow-x-auto md:p-6 p-4">
        {historyList.length === 0 && (
          <li className="flex md:text-[0.75rem] text-[0.65rem] font-semibold px-10">
            No waste submitted yet...
          </li>
        )}
        {historyList.map((item) => {
          return (
            <li
              className="flex justify-between border-b border-ash md:gap-12 gap-10 p-2 pt-4 md:text-[0.75rem] text-[0.65rem]"
              key={item.id}
            >
              <span>
                {item.number} bags submitted at {item.wcp.name}
              </span>
              <span className="flex gap-4">
                {item.verified ? (
                  <span className="text-blue">verified</span>
                ) : (
                  <span className="text-error">pending</span>
                )}
              </span>
            </li>
          );
        })}
        <button
          onClick={async () => {
            if (!historyList.length) return;
            try {
              const offsetId = historyList[historyList.length - 1].id;
              const { data } = await axios.get(
                `/api/history?account=${wallet?.classicAddress}&offsetId=${offsetId}`
              );
              console.log(data);
              setHistoryList([...historyList, ...data]);
            } catch (error) {
              console.log(error);
            }
          }}
          className="text-[0.65rem] absolute bottom-4 left-4"
        >
          load more...
        </button>
      </ul>
    </div>
  );
}
