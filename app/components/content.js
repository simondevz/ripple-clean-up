import Image from "next/image";
import guypickingtrash from "../../public/guypickingtrash.jpeg";
import bitcoin from "../../public/bitcoin.jpeg";
import blockchain from "../../public/blockchain.jpeg";
import trash from "../../public/trash.jpeg";
import codeonscreen from "../../public/codeonscreen.jpeg";

export default function Content() {
  return (
    <div className="flex flex-col px-20 py-10 mb-[-22rem]">
      <div className="flex gap-8 justify-between">
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-[3.5rem]">
            What is Ripple Clean-Up?
          </h2>
          <p className="text-[1.4rem] w-[45rem]">
            At Ripple Clean-up, we’re on a mission to make the world a cleaner
            and greener place. We’ve harnessed the power of blockchain
            technology to incentivize and facilitate proper waste disposal. By
            joining our platform, you become a vital part of this environmental
            revolution.
            <b className="flex">
              Together, We Can Create a Ripple Effect of Positive Impact!!!
            </b>
          </p>
        </div>

        <Image
          src={guypickingtrash}
          alt="cc"
          className="rounded-md w-[30rem] object-cover h-[27rem] mb-[1rem]"
        />
      </div>

      <div className="flex gap-8 flex-row-reverse justify-between">
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-[3.5rem]">
            Waste Collection Points
          </h2>
          <p className="text-[1.4rem]  w-[40rem]">
            Environmental conscious organizations and individuals can register
            their waste collection points on our platform, allowing users to
            find and contribute easily.
          </p>
        </div>

        <Image
          src={trash}
          alt="cc"
          className="rounded-md w-[30rem] object-cover h-[27rem] relative top-[-8.5rem]"
        />
      </div>

      <div className="flex gap-8 relative top-[-7rem] justify-between">
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-[3.5rem]">
            Submit Collection Data
          </h2>
          <p className="text-[1.4rem]  w-[45rem]">
            Report your waste collection activities with ease. Scan the QR codes
            at designated collection points and update proof of collection, such
            as photos of your clean up efforts.
          </p>
        </div>
        <Image
          src={codeonscreen}
          alt="cc"
          className="rounded-md w-[30rem] relative top-[-5rem] object-cover h-[27rem]"
        />
      </div>

      <div className="flex gap-8 flex-row-reverse relative top-[-10rem] justify-between">
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-[3.5rem]">Smart Contracts</h2>
          <p className="text-[1.4rem]  w-[40rem]">
            Our blockchain-based smart contracts verify and record each waste
            collection transaction. Tokens are rewarded based on the type and
            quality of waste collected.
          </p>
        </div>
        <Image
          src={blockchain}
          alt="cc"
          className="rounded-md w-[30rem] relative top-[-7rem] object-cover h-[27rem]"
        />
      </div>

      <div className="flex gap-8 relative top-[-15rem] justify-between">
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-[3.5rem]">Token Rewards</h2>
          <p className="text-[1.4rem]  w-[45rem]">
            Your hard work pays off with valuable blockchain tokens which you
            can Trade with other users, Redeem for cash rewards, Donate to
            environmental causes, and Exchange at Eco-friendly stores.
          </p>
        </div>
        <Image
          src={bitcoin}
          alt="cc"
          className="rounded-md w-[30rem] relative top-[-7rem] object-cover h-[27rem]"
        />
      </div>
    </div>
  );
}
