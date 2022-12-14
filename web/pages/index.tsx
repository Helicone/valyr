import {
  ArrowDownIcon,
  ArrowUpIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { SupabaseClient } from "@supabase/supabase-js";
import Head from "next/head";
import { useEffect, useState } from "react";
import { supabaseClient } from "../lib/supabaseClient";
import { DateMetrics } from "../components/timeGraph";
import { Logo } from "../components/logo";
import { RequestTable } from "../components/requestTable";
import { MetricsPanel } from "../components/metricsPanel";
import { Logs } from "../components/logPanel";
import { OnBoarding } from "../components/onBoarding";
import { ResetAPIKey } from "../components/resetAPIKey";
import Step from "../components/common/step";

function getStorageValue<T>(key: string, defaultValue: T) {
  const saved =
    typeof window !== "undefined" ? localStorage.getItem(key) : null;
  if (saved === null) {
    return defaultValue;
  }
  return JSON.parse(saved) as T;
}

function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default function Home() {
  const [authHash, setAuthHash] = useLocalStorage<string | null>(
    "authHashedToken",
    null
  );
  const [authPreview, setAuthPreview] = useLocalStorage<string | null>(
    "authPreview",
    null
  );

  const [client, setClient] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    if (authHash !== null) {
      supabaseClient(authHash).then((client) => {
        setClient(client);
      });
    } else {
      setClient(null);
    }
  }, [authHash]);

  return (
    <div className="flex flex-col bg-black text-slate-100">
      <Head>
        <title>Valyr better logging for OpenAI</title>
        <meta name="description" content="Valyr" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="items-center pt-5 pb-12 md:h-screen min-h-screen">
        {client !== null ? (
          <LoggedInFlow
            setAuthHash={setAuthHash}
            client={client}
            authPreview={authPreview!}
          />
        ) : (
          <div className="flex flex-col md:items-center p-4 md:p-0">
            <div className="my-8 mt-8 sm:mt-36">
              <div className="hidden md:flex md:flex-row gap-5 items-center">
                <div className="hidden md:block font-light text-6xl">
                  Welcome to{" "}
                  <span className="font-semibold bg-gray-700 py-2 px-4 rounded-lg">
                    VALYR
                  </span>
                </div>
              </div>
              <div className="md:hidden flex flex-col text-center text-5xl md:text-6xl">
                Welcome to
                <div className="font-semibold bg-gray-700 py-1 px-2 rounded-lg mt-2 m-auto">
                  VALYR
                </div>
              </div>
            </div>
            <div className="font-extralight text-3xl mb-12 text-center">
              Simplify GPT-3 monitoring with one line of code
            </div>
            <div className="flex flex-row gap-8">
              <Step stepNumber={1} label="Replace <base url, SDK>">
                <h1>Hello World</h1>
              </Step>
              <Step stepNumber={2} label="View requests in dashboard">
                <h1>Hello World</h1>
              </Step>
              <Step stepNumber={3} label="Add data for A/B testing">
                <h1>Hello World</h1>
              </Step>
            </div>
            <OnBoarding
              setAuthHash={setAuthHash}
              setAuthPreview={setAuthPreview}
            />
          </div>
        )}
      </main>

      <footer className="fixed left-0 bottom-0 z-20 h-12 w-full text-center border-t-2 dark:border-slate-800 border-slate-300 dark:bg-black bg-opacity-90">
        <div className="flex flex-row items-center justify-center h-full gap-1">
          <div>
            Made by <i>Helicone</i>
          </div>

          <div>
            {"("}
            <a
              href="https://twitter.com/justinstorre"
              className="dark:text-slate-300 text-slate-700"
            >
              Justin
            </a>{" "}
            <a
              href="https://twitter.com/barakoshri"
              className="dark:text-slate-300 text-slate-700"
            >
              Barak
            </a>{" "}
            <a
              href="https://twitter.com/NguyenScott7"
              className="dark:text-slate-300 text-slate-700"
            >
              Scott
            </a>
            {")"}
          </div>
        </div>
      </footer>
    </div>
  );
}
function LoggedInFlow({
  setAuthHash,
  client,
  authPreview,
}: {
  setAuthHash: (client: string | null) => void;
  client: SupabaseClient;
  authPreview: string;
}) {
  return (
    <div className="flex flex-col h-full px-10 pb-12">
      <div className="h-1/6 ">
        <ResetAPIKey setAuthHash={setAuthHash} authPreview={authPreview} />
      </div>
      <div className="h-2/6 w-full ">
        <div className="flex flex-col md:flex-row gap-8 ">
          <div className="flex-1 border-[1px] border-slate-700 rounded-lg px-5 py-3 flex flex-col items-center">
            <MetricsPanel client={client} />
          </div>
          <div className="flex-1 border-[1px] text-xs border-slate-700 rounded-lg px-5 py-3 max-h-60 overflow-y-auto ">
            {/* This is a vertically scrollable table */}
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-2">
                <InformationCircleIcon className="h-5 w-5 text-slate-300" />
                <p className="text-slate-600 dark:text-slate-300">Logs</p>
              </div>
              <div className="flex flex-row gap-2">
                <p className="dark:text-slate-300 text-slate-600 animate-pulse">
                  Live
                </p>
                <ArrowUpIcon className="h-5 w-5 text-slate-300" />
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              Live logs coming soon!
              <Logs client={client} />
            </div>
          </div>
        </div>
      </div>
      <div className="h-3/6 w-full ">
        <GraphAndCharts client={client} />
      </div>
    </div>
  );
}

function GraphAndCharts({ client }: { client: SupabaseClient }) {
  const [showRequestTable, setShowRequestTable] = useState(false);
  return (
    <>
      <div className="h-[10%] w-full pl-10 flex flex-col gap-3 mt-4">
        <div className="flex flex-row gap-5 items-center">
          <div className="border-2 dark:border-none dark:bg-slate-800 rounded-full flex flex-row gap-2">
            <div
              className={
                "flex flex-row gap-2 items-center px-10 rounded-full py-1 cursor-pointer " +
                (showRequestTable || "dark:bg-slate-600 bg-slate-500")
              }
              onClick={() => setShowRequestTable(false)}
            >
              <p
                className={
                  showRequestTable
                    ? "dark:text-slate-100 "
                    : "dark:text-slate-200 text-slate-100"
                }
              >
                Graph
              </p>
            </div>
            <div
              className={
                "flex flex-row gap-2 items-center px-10 rounded-full py-1 cursor-pointer " +
                (showRequestTable && "dark:bg-slate-600 bg-slate-500")
              }
              onClick={() => setShowRequestTable(true)}
            >
              <p
                className={
                  showRequestTable
                    ? "dark:text-slate-200 text-slate-100"
                    : "dark:text-slate-100 "
                }
              >
                Table
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[90%] py-5">
        {showRequestTable ? (
          <RequestTable client={client} />
        ) : (
          <TimeGraphWHeader client={client} />
        )}
      </div>
    </>
  );
}

function TimeGraphWHeader({ client }: { client: SupabaseClient }) {
  return (
    <div className="h-full w-full">
      <div className="w-full h-1/6 pl-10">
        <p className="text-lg text-slate-300">Number of requests over time</p>
      </div>
      <div className="w-full md:h-5/6 h-40">
        <DateMetrics client={client} />
      </div>
    </div>
  );
}
