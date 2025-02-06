import { Button } from "@/components/ui/button";
import NavBar from "./shared-components/NavBar";
import Meteors from "@/components/ui/meteors";
import HyperText from "@/components/ui/hyper-text";
import { TextAnimate } from "@/components/ui/text-animate";

export default function LandingPage() {

    return (
        <div className="min-h-screen">
        <div className="flex flex-col bg-gradient-to-b from-background to-secondary">
                <div className="relative flex h-[500px] m-10 flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
                    <Meteors number={15} />
                    <span className="whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center  leading-none text-transparent dark:from-white dark:to-slate-900/10">
                        <HyperText className="lg:text-7xl">Question Paper Archives</HyperText>
                    </span>
                </div>
                {/* <Footer /> */}
        </div>
        </div>
    );
}