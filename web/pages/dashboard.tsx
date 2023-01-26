import {
  createServerSupabaseClient,
  Session,
  User,
} from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps } from "next";

interface DashboardProps {
  initialSession: Session;
  user: User;
}

const Dashboard = (props: DashboardProps) => {
  const { initialSession, user } = props;

  return (
    <>
      <h1>Hello {user.id}</h1>
      <h1>Hello {user.email}</h1>
    </>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient(context);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};
