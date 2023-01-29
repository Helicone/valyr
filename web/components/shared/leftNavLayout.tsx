import { Dialog, Transition } from "@headlessui/react";
import { BellAlertIcon, HomeIcon, KeyIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Fragment, ReactNode, useState } from "react";
import { useKeys } from "../../lib/useKeys";
import { Database } from "../../supabase/database.types";
import { clsx } from "./clsx";

interface LeftNavLayoutProps {
  children: ReactNode;
}

const LeftNavLayout = (props: LeftNavLayoutProps) => {
  const { children } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const supabaseClient = useSupabaseClient<Database>();
  const router = useRouter();

  const apiKeys = useKeys(supabaseClient);

  const { pathname } = router;

  const leftPaths = [
    {
      name: "Dashboard",
      path: "/dashboard",
      active: pathname === "/dashboard",
      icon: HomeIcon,
    },
    {
      name: "Manage Keys",
      path: "/settings/keys",
      active: pathname === "/settings/keys",
      icon: KeyIcon,
    },
  ];

  return (
    <>
      <div className="flex flex-col sm:hidden">{children}</div>
      <div className="flex-row h-full w-screen hidden sm:flex">
        {/* Sidebar */}
        <div className="h-full flex min-w-64 flex-col">
          <nav className="py-2 pl-4 pr-2 flex-1 space-y-1 bg-white w-64 border-r-[1px] border-gray-200">
            {leftPaths.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className={clsx(
                  item.active
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md justify-between"
                )}
              >
                <div className="flex flex-row">
                  <item.icon
                    className={clsx(
                      item.active
                        ? "bg-gray-200 text-gray-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "mr-2.5 flex-shrink-0 h-5 w-5"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </div>
                {item.path === "/settings/keys" && apiKeys.length < 1 && (
                  <ExclamationCircleIcon
                    className={clsx(
                      item.active
                        ? "bg-gray-200 text-red-600"
                        : "text-red-600 hover:bg-gray-50 hover:text-gray-900",
                      "flex-shrink-0 h-5 w-5 self-end"
                    )}
                    aria-hidden="true"
                  />
                )}
              </a>
            ))}
          </nav>
        </div>
        <div className="h-full flex flex-col p-4 w-full bg-gray-50">
          {children}
        </div>
      </div>
    </>
  );
};

export default LeftNavLayout;
