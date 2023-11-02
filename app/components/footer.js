import { FiHelpCircle } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="flex gap-8 p-20 justify-between bg-primary">
      <div className="flex flex-col justify-between gap-10">
        <div>
          <h4 className="text-[2.8rem] font-semibold">Ripple Clean-Up</h4>
          <span className="flex gap-2">
            <FiHelpCircle className="my-auto" />
            <span className="text-[0.75rem]">Help Center</span>
          </span>
        </div>

        <div className="flex flex-col gap-6">
          <button>App Store</button>
          <button>google play</button>
          <span>Download the Ripple Clean-Up App</span>
        </div>

        <div className="flex gap-2">
          <span>insta</span>
          <span>x</span>
          <span>fb</span>
          <span>linkedIn</span>
        </div>
      </div>

      <div className="flex gap-8 pr-56">
        <div className="flex flex-col justify-between gap-8 ">
          <div className="flex flex-col gap-4">
            <h6 className="flex font-semibold text-[0.875rem]">
              About Ripple Clean-Up
            </h6>
            <div className="flex flex-col text-[0.875rem]">
              <span>About WCP</span>
              <span>Trust and safety</span>
              <span>Do not share my info</span>
              <span>Community guidelines</span>
              <span>WCP Partners</span>
              <span>Blog</span>
              <span>Careers</span>
              <span>Become a Waste Collection Point</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h6 className="flex font-semibold text-[0.875rem]">
              Top WCP States
            </h6>
            <div className="flex flex-col text-[0.875rem]">
              <span>Enugu</span>
              <span>Abuja</span>
              <span>Lagos</span>
              <span>Port Harcourt</span>
              <span>Bayelsa</span>
              <span>Ebonyi</span>
              <span>Anambra</span>
              <span>Imo</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-4">
            <h6 className="flex font-semibold text-[0.875rem]">Resources</h6>
            <div className="flex flex-col text-[0.875rem]">
              <span>WCP Training</span>
              <span>WCP Grooming</span>
              <span>WCP Activities</span>
              <span>WCP Requirements</span>
              <span>WCP Agreement</span>
              <span>WCP Merits</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h6 className="flex font-semibold text-[0.875rem]">Focus Areas</h6>
            <div className="flex flex-col text-[0.875rem]">
              <span>Schools</span>
              <span>Universities</span>
              <span>Health Centers</span>
              <span>Recreation Centers</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h6 className="flex font-semibold text-[0.875rem]">Security</h6>
            <div className="flex flex-col text-[0.875rem]">
              <span>Responsible Disclosure</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
