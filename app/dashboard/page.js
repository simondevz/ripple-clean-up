"use client";

import { useEffect, useState } from "react";
import Analytics from "./components/analytics";
import ListWCP from "./components/listWCP";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [showAnalitics, setShowAnalytics] = useState(false);
  const [locationHash, setLocationHash] = useState("#submittionpage");
  const router = useRouter();

  useEffect(() => {
    function handleHashChange() {
      if (window.location.hash === "#analytics") {
        setLocationHash("#analytics");
        setShowAnalytics(true);
      } else {
        setLocationHash("#submittionpage");
        setShowAnalytics(false);
      }
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [locationHash]);

  return (
    <div className="flex md:flex-row flex-col md:gap-4 py-6 px-4">
      <div
        className={
          (locationHash === "#analytics" ? "" : "justify-end ") +
          "flex w-full py-2 md:hidden mt-[-2rem]"
        }
      >
        <button
          className="flex"
          onClick={() => {
            if (!showAnalitics) {
              router.push("/dashboard#analytics");
              setLocationHash("#analytics");
            }
            if (showAnalitics) {
              router.push("/dashboard#submittionpage");
              setLocationHash("#submittionpage");
            }
            setShowAnalytics(!showAnalitics);
          }}
        >
          {locationHash === "#analytics" ? (
            <span className="flex text-[0.75rem] underline text-blue">
              <RiArrowLeftLine className="my-auto" />
              <span className="my-auto">Go back to Submittion Page</span>
            </span>
          ) : (
            <span className="flex flex-row-reverse text-[0.75rem] underline text-blue">
              <RiArrowRightLine className="my-auto" />
              <span className="my-auto">View Analytics</span>
            </span>
          )}
        </button>
      </div>
      <div
        className={
          (locationHash === "#analytics" ? "flex " : "hidden ") +
          "md:flex md:w-1/2"
        }
      >
        <Analytics />
      </div>
      <div
        className={
          (locationHash === "#submittionpage" ? "flex " : "hidden ") +
          "md:flex md:w-1/2"
        }
      >
        <ListWCP />
      </div>
    </div>
  );
}
