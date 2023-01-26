import { User } from "@supabase/supabase-js";

interface DashboardPageProps {
  user: User;
}

const DashboardPage = (props: DashboardPageProps) => {
  const {} = props;

  return (
    <>
      <h1>Hello DashboardPage</h1>
    </>
  );
};

export default DashboardPage;
