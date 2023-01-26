import {
  ArrowDownIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import NavBar from "../components/shared/navBar";

interface HomeProps {}

const Home = (props: HomeProps) => {
  const {} = props;

  const router = useRouter();

  return (
    <div className="px-4 sm:px-16 flex flex-col h-screen w-screen bg-gray-300">
      <NavBar />
      <div className="h-4/5 justify-center align-middle items-left flex flex-col space-y-4">
        <p className="text-5xl sm:text-6xl font-serif">Valyr.ai</p>
        <p className="text-3xl sm:text-4xl font-sans font-light">
          Simplify GPT-3 monitoring with{" "}
          <span className="bg-yellow-300 py-0.5 px-1.5 rounded-sm font-bold">
            one
          </span>{" "}
          line of code
        </p>
        <div className="pt-8 flex flex-row sm:items-center justify-start gap-4">
          <button
            onClick={() => router.push("/onboarding")}
            className="rounded-md bg-black px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Get started{" "}
            <span className="hidden sm:inline-flex">
              in less than 3 minutes
            </span>
          </button>
          <button
            onClick={() => {}}
            className="text-base font-semibold leading-7 text-black hover:text-gray-800"
          >
            View Demo <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
