"use client";
import { useEffect, useRef } from "react";

export default function Popup({ show, child, onclick }) {
  const popupRef = useRef(null);

  const closePopupOnParentClick = (e) => {
    if (!popupRef.current.attributes["id"]?.value) return;

    if (
      popupRef.current.attributes["id"]?.value ===
      e.target.attributes["id"]?.value
    ) {
      onclick();
    }
  };

  useEffect(() => {
    document.addEventListener("click", closePopupOnParentClick);
    return () => {
      document.removeEventListener("click", closePopupOnParentClick);
    };
  }, []);

  return (
    <div
      ref={popupRef}
      className={`${
        show ? "flex" : "hidden"
      } absolute w-full h-full justify-center backdrop-brightness-50 m-[-.5rem] z-50 right-2 top-2`}
    >
      {child}
    </div>
  );
}
