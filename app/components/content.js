import Image from "next/image";
import guypickingtrash from "../../public/guypickingtrash.jpeg";
import bitcoin from "../../public/bitcoin.jpeg";
import blockchain from "../../public/blockchain.jpeg";
import trash from "../../public/trash.jpeg";
import codeonscreen from "../../public/codeonscreen.jpeg";

export default function Content() {
  return (
    <div className="flex flex-col md:px-20 px-6 md:py-8 py-6 lg:mb-[-22rem] xl:mb-[-26rem]">
      <div className="flex lg:flex-row flex-col gap-8 justify-between">
        <div className="flex flex-col gap-4 mx-auto">
          <h2 className="xl:text-[3rem] font-semibold lg:text-[2.1rem] md:text-[3rem] text-[2rem]">
            What is Ripple Clean-Up?
          </h2>
          <p className="xl:text-[1.2rem] xl:w-[35rem]  lg:text-[0.875rem] text-[1rem] md:text-[1rem] md:text-[1.2rem] lg:min-w-[25rem]">
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
          className="rounded-md xl:w-[31rem] xl:h-[27rem] mx-auto lg:w-[22rem] lg:h-[19rem] w-[30rem] object-cover md:h-[27rem] h-[15rem] mb-[1rem]"
        />
      </div>

      <div className="flex gap-8 lg:flex-row-reverse flex-col justify-between">
        <div className="flex flex-col gap-4 mx-auto">
          <h2 className="xl:text-[3rem] font-semibold lg:text-[2.1rem] md:text-[3rem] text-[2rem]">
            Waste Collection Points
          </h2>
          <p className="xl:text-[1.2rem] xl:w-[30rem]  lg:text-[0.875rem] text-[1rem] md:text-[1.2rem] lg:w-[30rem]">
            Environmental conscious organizations and individuals can register
            their waste collection points on our platform, allowing users to
            find and contribute easily.
          </p>
        </div>

        <Image
          src={trash}
          alt="cc"
          className="rounded-md xl:w-[31rem] xl:h-[27rem] mx-auto lg:w-[22rem] lg:h-[19rem] w-[30rem] object-cover md:h-[27rem] h-[15rem] lg:relative top-[-8rem] xl:top-[-4rem]"
        />
      </div>

      <div className="flex gap-8 lg:flex-row flex-col lg:relative top-[-7.5rem] xl:top-[-2.5rem] justify-between">
        <div className="flex flex-col gap-4 mx-auto">
          <h2 className="xl:text-[3rem] font-semibold lg:text-[2.1rem] md:text-[3rem] text-[2rem]">
            Submit Collection Data
          </h2>
          <p className="xl:text-[1.2rem] xl:w-[35rem]  lg:text-[0.875rem] text-[1rem] md:text-[1.2rem] lg:min-w-[25rem]">
            Report your waste collection activities with ease. Scan the QR codes
            at designated collection points and update proof of collection, such
            as photos of your clean up efforts.
          </p>
        </div>
        <Image
          src={codeonscreen}
          alt="cc"
          className="rounded-md xl:w-[31rem] xl:h-[27rem] mx-auto lg:w-[22rem] lg:h-[19rem] w-[30rem] lg:relative top-[-3rem] xl:top-[-10.5rem] object-cover md:h-[27rem] h-[15rem]"
        />
      </div>

      <div className="flex gap-8 lg:flex-row-reverse flex-col lg:relative top-[-10.5rem] xl:top-[-11rem] justify-between">
        <div className="flex flex-col gap-4 mx-auto">
          <h2 className="xl:text-[3rem] font-semibold lg:text-[2.1rem] md:text-[3rem] text-[2rem]">
            Smart Contracts
          </h2>
          <p className="xl:text-[1.2rem] xl:w-[35rem]  lg:text-[0.875rem] text-[1rem] md:text-[1.2rem] lg:w-[30rem]">
            Our blockchain-based smart contracts verify and record each waste
            collection transaction. Tokens are rewarded based on the type and
            quality of waste collected.
          </p>
        </div>
        <Image
          src={blockchain}
          alt="cc"
          className="rounded-md xl:w-[31rem] xl:h-[27rem] mx-auto lg:w-[22rem] lg:h-[19rem] w-[30rem] lg:relative top-[-5.5rem] object-cover md:h-[27rem] h-[15rem]"
        />
      </div>

      <div className="flex lg:flex-row mb-8 flex-col gap-8 lg:relative top-[-15rem] xl:top-[-15rem] justify-between">
        <div className="flex flex-col gap-4 mx-auto">
          <h2 className="xl:text-[3rem] font-semibold lg:text-[2.1rem] md:text-[3rem] text-[2rem]">
            Token Rewards
          </h2>
          <p className="xl:text-[1.2rem] xl:w-[35rem]  lg:text-[0.875rem] text-[1rem] md:text-[1.2rem] lg:w-[25rem]">
            Your hard work pays off with valuable blockchain tokens which you
            can Trade with other users, Redeem for cash rewards, Donate to
            environmental causes, and Exchange at Eco-friendly stores.
          </p>
        </div>
        <Image
          src={bitcoin}
          alt="cc"
          className="rounded-md xl:w-[31rem] xl:h-[27rem] mx-auto lg:w-[22rem] lg:h-[19rem] w-[30rem] lg:relative top-[-5rem] xl:top-[-9rem] object-cover md:h-[27rem] h-[15rem]"
        />
      </div>
    </div>
  );
}
