import { RiCloseFill } from "react-icons/ri";

export default function Popup({ show, child, onclick }) {
  return (
    <div
      className={`${show ? "flex" : "hidden"} absolute bg-black right-2 top-2`}
    >
      <RiCloseFill onClick={onclick} className="absolute left-2 top-2" />
      {child}
    </div>
  );
}
