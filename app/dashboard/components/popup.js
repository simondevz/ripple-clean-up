import { RiCloseFill } from "react-icons/ri";

export default function Popup({ show, child, onclick }) {
  return (
    <div
      className={`${
        show ? "flex" : "hidden"
      } absolute w-full h-full justify-center backdrop-brightness-50 m-[-.5rem] z-50 right-2 top-2`}
    >
      {child}
    </div>
  );
}
