import { ArrowDownIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import NavBar from "../components/shared/navBar";
import OnboardingPage from "../components/templates/onboarding/onboardingPage";

interface OnboardingProps {
  step?: number;
}

const Onboarding = (props: OnboardingProps) => {
  const { step } = props;

  return <OnboardingPage step={step} />;
};

export default Onboarding;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const { step } = query;

  return {
    props: {
      step: parseInt(step as string),
    },
  };
}
