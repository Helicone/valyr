import {
  ArrowUpIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { useUser } from "@supabase/auth-helpers-react";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import NavBar from "../../shared/navBar";
import GraphAndCharts from "./graphsAndCharts";
import { Logs } from "./logPanel";
import { MetricsPanel } from "./metricsPanel";

interface DashboardPageProps {
  user: User;
}

const DashboardPage = (props: DashboardPageProps) => {
  const {} = props;
  const user = useUser();

  return (
    <div className="px-4 sm:px-16 flex flex-col h-screen w-screen bg-white">
      <NavBar variant="secondary" />
      {user?.email === "valyrdemo@gmail.com" && (
        <div className="flex flex-row items-center justify-center bg-red-800 text-white p-2 mb-5">
          <ExclamationCircleIcon className="h-5 w-5 mr-2" />
          <p className="text-sm">
            You are currently logged in as a demo user. All of the traffic for
            this user is coming from this demo site{" "}
            <Link
              href="https://demoapp.valyrai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              AI App Ideas
            </Link>{" "}
            .
          </p>
        </div>
      )}
      <div className="h-2/6 w-full pt-8">
        <div className="flex flex-col md:flex-row gap-8 ">
          <div className="flex-1 border-[1px] border-black marker:rounded-lg px-5 py-3 flex flex-col items-center">
            <MetricsPanel />
          </div>
          <div className="flex-1 border-[1px] text-xs border-black rounded-lg px-5 py-3 max-h-60 overflow-y-auto">
            {/* This is a vertically scrollable table */}
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-2">
                <InformationCircleIcon className="h-5 w-5 text-slate-300" />
                <p className="text-black">Logs</p>
              </div>
              <div className="flex flex-row gap-2">
                <p className="text-black animate-pulse">Live</p>
                <ArrowUpIcon className="h-5 w-5 text-black" />
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <Logs />
            </div>
          </div>
        </div>
      </div>
      <div className="h-3/6 w-full ">
        <GraphAndCharts />
      </div>
    </div>
  );
};

export default DashboardPage;
