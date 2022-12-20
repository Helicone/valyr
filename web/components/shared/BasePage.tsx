import { useUser } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { ReactNode } from "react";
import FloatingNav from "./FloatingNav";

interface MetaData {
  title: string;
}

interface BasePageProps {
  className?: string;
  children: ReactNode;
  metaData?: MetaData;
}

const BasePage = (props: BasePageProps) => {
  const user = useUser();
  const { className, children, metaData } = props;

  return (
    <div className={`flex flex-col pb-24 ${className}`}>
      <Head>
        <title>{metaData?.title || "TableTalk"}</title>
        <link rel="icon" href="/assets/scarlet.png" />
      </Head>
      {children}
      <FloatingNav user={user || undefined} />
    </div>
  );
};

export default BasePage;
