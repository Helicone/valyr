import {
  ArrowDownIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import NavBar from "../components/shared/navBar";
import HomePage from "../components/templates/home/homePage";

interface HomeProps {}

const Home = (props: HomeProps) => {
  const {} = props;

  return <HomePage />;
};

export default Home;
