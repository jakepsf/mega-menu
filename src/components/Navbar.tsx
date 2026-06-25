'use client'
import DotsIcon from "./icons/DotsIcon";
import Link from "next/link";
import SayHelloButton from "@/components/sayHelloButton";

export default function Navbar() {
    return (
        <nav className="bg-background p-6 sm:p-10">
            <div className="flex justify-between items-center">
                <div className="w-fit">
                <Link href='/'>
                    <div className="relative w-fit">
                        <div className="flex relative z-[10] flex-col leading-none">
                            <h1 className="text-3xl font-extrabold text-primary tracking-tight">
                                renovation
                            </h1>
                            <h4 className="text-md sm:text-lg font-medium text-muted-foreground -mt-1 tracking-wide">
                                mega-menu
                            </h4>
                        </div>

                        <div className="absolute top-[-13px] z-[1] right-[-19px] rotate-[10deg]">
                            <DotsIcon />
                        </div>
                    </div>
                </Link>
                </div>
                <SayHelloButton />
            </div>
        </nav>
    );
}