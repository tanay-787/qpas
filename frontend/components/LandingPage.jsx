import { Button } from "@/components/ui/button";
import NavBar from "./shared-components/NavBar";
import Meteors from "@/components/ui/meteors";
import HyperText from "@/components/ui/hyper-text";

export default function LandingPage() {

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary">
            <header className="bg-background/85 backdrop-blur-[3px] sticky top-0 z-50">
                <NavBar />
            </header>
            <div className="relative flex h-[500px] m-10 flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
                <Meteors number={15} />
                <span className="whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center  leading-none text-transparent dark:from-white dark:to-slate-900/10">
                    <HyperText className="lg:text-7xl">Question Paper Archives</HyperText>
                </span>
            </div>
            {/* <Footer /> */}
        </div>
    );
}