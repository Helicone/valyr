import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Router, useRouter } from "next/router";
import { useState } from "react";
import { middleTruncString } from "../../../lib/stringHelpers";
import { hashAuth } from "../../../lib/supabaseClient";
import { supabaseServer } from "../../../lib/supabaseServer";
import NavBar from "../../shared/navBar";
import ProgressBar from "./progressBar";
import StepOne from "./stepOne";
import StepThree from "./stepThree";
import StepTwo from "./stepTwo";

interface OnboardingPageProps {}

const OnboardingPage = (props: OnboardingPageProps) => {
  const {} = props;
  const router = useRouter();
  const supabaseClient = useSupabaseClient();

  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const stepOneNextHandler = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setStep(2);
  };

  const stepTwoNextHandler = () => {
    setStep(3);
  };

  const onCompleteOnboarding = async (apiKey: string) => {
    setStep(4);

    // create an account
    const { data: user, error: authError } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    // if there is an error, redirect to the onboarding page
    if (authError) {
      console.log("error", authError);
      router.push("/onboarding");
    }

    // hash the api key and attach it to the created user
    const hashedApiKey = await hashAuth(apiKey);
    const { data, error } = await supabaseClient.from("user_api_keys").insert({
      api_key_preview: middleTruncString(apiKey, 8),
      user_id: user.user?.id,
      api_key_hash: hashedApiKey,
    });

    // if there is an error, tell the user that their api key was not saved
    if (error) {
      console.log("error", authError);
    }

    // redirect to the dashboard
    router.push("/dashboard");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepOne onNextHandler={stepOneNextHandler} />;
      case 2:
        return (
          <StepTwo
            onBackHandler={() => setStep(1)}
            onNextHandler={stepTwoNextHandler}
          />
        );
      case 3:
        return (
          <StepThree
            onBackHandler={() => setStep(2)}
            onNextHandler={onCompleteOnboarding}
          />
        );
      case 4:
        return (
          <p className="mt-4 text-2xl">Bringing you to your dashboard...</p>
        );
      default:
        return <StepOne onNextHandler={stepOneNextHandler} />;
    }
  };

  return (
    <div className="px-4 sm:px-16 flex flex-col h-screen w-screen bg-gray-300">
      <NavBar />
      <div className="h-full justify-center align-middle items-center flex flex-col space-y-6 sm:space-y-12">
        <ProgressBar currentStep={step} />
        {renderStep()}
      </div>
    </div>
  );
};

export default OnboardingPage;
