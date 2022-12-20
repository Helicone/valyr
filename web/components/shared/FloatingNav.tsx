import {
  MegaphoneIcon,
  XMarkIcon,
  GlobeAltIcon,
  CalculatorIcon,
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  NewspaperIcon,
  TruckIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useState } from "react";

interface FloatingNavProps {
  user?: User;
}

export default function FloatingNav(props: FloatingNavProps) {
  const { user } = props;
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 pb-2 sm:pb-5 sm:px-36">
        <div className="px-2 sm:px-6 lg:px-8">
          <div className="rounded-lg p-2 shadow-lg sm:p-3 bg-opacity-80 bg-zinc-700">
            <div className="hidden md:flex items-center sm:px-2">
              <div className="flex w-0 flex-1 items-center">
                <button
                  className="flex rounded-md bg-black px-4 py-2 text-white font-semibold hover:bg-gray-700"
                  onClick={() => router.push("/")}
                >
                  <GlobeAltIcon className="text-white w-4 h-4 mt-1 mr-2" />
                  TableTalk
                </button>
                <div className="w-0.5 bg-gray-400 h-8 mx-4" />
                <button
                  className="flex rounded-md bg-black px-4 py-2 text-white font-semibold hover:bg-gray-700"
                  onClick={() => router.push("/about")}
                >
                  <NewspaperIcon className="text-white w-4 h-4 mt-1 mr-2" />
                  About Us
                </button>
              </div>
              <button
                className="flex rounded-md px-4 py-2 text-gray-300 font-medium hover:text-zinc-500"
                onClick={() => {}}
              >
                Twitter
              </button>
              <button
                className="flex rounded-md px-4 py-2 text-gray-300 font-medium hover:text-zinc-500"
                onClick={() => {}}
              >
                Discord
              </button>
              {user ? (
                <button
                  className="flex rounded-md bg-rose-600 px-4 py-2 text-white font-medium ml-4 hover:bg-rose-800"
                  onClick={() => {
                    supabaseClient.auth.signOut();
                  }}
                >
                  Sign Out
                </button>
              ) : (
                <button
                  className="flex rounded-md bg-rose-600 px-4 py-2 text-white font-medium ml-4 hover:bg-rose-800"
                  onClick={() => {
                    router.push("/login");
                  }}
                >
                  Sign In
                </button>
              )}
            </div>
            <div className="flex md:hidden items-center px-2">
              <div className="flex w-0 flex-1 items-center">
                <button
                  className="flex rounded-md bg-black p-2 text-white font-semibold hover:bg-gray-800"
                  onClick={() => router.push("/")}
                >
                  <GlobeAltIcon className="text-white w-5 h-5" />
                </button>
                <div className="w-0.5 bg-gray-400 h-8 mx-4" />
                <button
                  className="flex rounded-md bg-black  p-2 text-white font-semibold hover:bg-gray-800"
                  onClick={() => router.push("/trip")}
                >
                  <NewspaperIcon className="text-white w-5 h-5" />
                </button>
              </div>
              {/* <button
                className="flex rounded-md px-4 py-2 text-gray-300 font-medium hover:text-zinc-500"
                onClick={() => {}}
              >
                Twitter
              </button>
              <button
                className="flex rounded-md px-4 py-2 text-gray-300 font-medium hover:text-zinc-500"
                onClick={() => {}}
              >
                Discord
              </button> */}
              {user ? (
                <button
                  className="flex rounded-md bg-rose-600 px-4 py-2 text-white font-medium ml-4 hover:bg-rose-800"
                  onClick={() => {
                    supabaseClient.auth.signOut();
                  }}
                >
                  Sign Out
                </button>
              ) : (
                <button
                  className="flex rounded-md bg-rose-600 px-4 py-2 text-white font-medium ml-4 hover:bg-rose-800"
                  onClick={() => {
                    router.push("/login");
                  }}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
