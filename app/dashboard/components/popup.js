import { RiCloseFill } from "react-icons/ri";

export default function Popup({ show, child, onclick }) {
  return (
    <div
      className={`${
        show ? "flex" : "hidden"
      } absolute w-full h-full justify-center backdrop-brightness-50 m-[-.5rem] z-5 right-2 top-2`}
    >
      <RiCloseFill
        onClick={onclick}
        className="absolute left-20 top-20 text-white h-6 w-6"
      />
      {child}
    </div>
  );
}
