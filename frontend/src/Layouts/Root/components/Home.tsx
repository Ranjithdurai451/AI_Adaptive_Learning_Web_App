import RightArrow from "@/components/ui/RightArrow";

import { useEffect } from "react";
import { Link } from "react-router";

const Home = () => {
  useEffect(() => {
    // generateBatchExplainations();
  }, []);
  return (
    <div className=" h-full w-full flex justify-center items-center">
      <div className="flex shadow-md flex-col items-center p-5 pb-[25px] mt-5 rounded-md  border-b dark:border-b-white/10 border-b-black/20">
        <p className="bg-primary p-[0.2rem] rounded-md text-[0.875rem] px-3 py-1 font-medium text-muted">
          AI-Powered Learning
        </p>
        <h3 className="text-[3rem] font-bold text-center capitalize leading-[1] p-4">
          Master Technical Skills <br />
          <span className="dark:text-white/30 text-black/30">
            with Personalized Roadmaps
          </span>
        </h3>
        <p className="text-[1.125rem] text-center capitalize max-w-[42rem] pt-2 pb-6">
          Tell us what you want to learn, and we'll create a customized learning
          path with hand-picked resources tailored to your skill level and
          preferences.
        </p>
        <Link
          to={"skill-selector"}
          className=" cursor-pointer shadow-lg hover:scale-[1.1] transition-all flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground"
        >
          {" "}
          Get Started
          <RightArrow />
        </Link>
      </div>
    </div>
  );
};

export default Home;
