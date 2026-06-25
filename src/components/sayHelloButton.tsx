import { ArrowRight } from "lucide-react";
import "./css/WavingHand.css";
import Link from "next/link";

export default function SayHelloButton() {
  return (
    <div className="flex items-center justify-center">
      <Link href='https://persqft.co/about#contact'>
      <button className="group flex items-center gap-1 sm:gap-2 bg-[#B0B4A8]/20 p-[8px] sm:p-[18px] rounded-full transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-95">
        
        {/* The Text (Luxury spacious style) */}
        <span className="font-opensans font-semibold tracking-[0.15em] text-[#c9ada2] text-[12px] sm:text-[14px] uppercase">
          Say Hello
        </span>

        {/* The Waving Emoji (With animation class) */}
        <span className="text-sm sm:text-lg waving-hand">👋</span>

        {/* The Arrow (Pushes right slightly on group-hover) */}
        <ArrowRight 
          className="text-[#c9ada2] font-semibold opacity-70 transition-transform duration-300 group-hover:translate-x-1.5" 
          size={20} 
          strokeWidth={2}
        />
      </button>
      </Link>
    </div>
  );
}