"use client";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2 } from "lucide-react";
import { Slider } from "@/components/Carousal";
import Footer from "@/components/Footer";
import { MediaCarousal } from "@/components/MediaCarousal";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useFirestore, useMemoFirebase, useCollection } from "@/firebase";
import { OurWork, type ReelsData } from "@/lib/types";
import { collection, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  const firestore = useFirestore();
  const [reelsData, setReelsData] = useState<ReelsData[]>([]);
  const [reelsLoading, setReelsLoading] = useState(true);

  const workQuery = useMemoFirebase(() => {
    if (!firestore) return null;

    // 1. Reference the collection
    const colRef = collection(firestore, "works");

    // 2. Create a query that orders by 'createdAt' in descending order
    return query(colRef, orderBy("createdAt", "desc"));
  }, [firestore]);

  // 1. Fetch Sites Logic
  const sitesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "sites"), orderBy("createdAt", "asc"));
  }, [firestore]);

  const { data: sitesData, isLoading: isDataLoading } =
    useCollection<any>(sitesQuery);

  useEffect(() => {
    const fetchInstagram = async () => {
      try {
        const response = await fetch(
          "https://api.feedspring.co/inst_lbu8hKBojZktxazpiWuCX",
        );
        const data = await response.json();
        const reels = data?.data?.media || [];
        setReelsData(reels || []);
      } catch (error) {
        console.error("Manual fetch failed", error);
      } finally {
        setReelsLoading(false);
      }
    };
    fetchInstagram();
  }, []);

  const formatLikes = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return num.toString();
  };

  const { data: workData, isLoading } = useCollection<OurWork>(workQuery);

  if(isLoading || reelsLoading || isDataLoading) {
    return (
       <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#B0B3A8]" />
      </div> 
    )
  }
  return (
    <main className="">
      <Navbar />
      {/* Website Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-10">
        {isDataLoading ? (
          <div className="col-span-full text-center py-20 text-slate-400">
            Loading our sites...
          </div>
        ) : sitesData && sitesData.length > 0 ? (
          sitesData?.map((value) => {
            return (
              <Card
                key={value.id}
                className="border border-[#000000a8] bg-[#F0F0F3]"
              >
                <CardContent className="p-0 ">
                  <div className="w-full h-[240px] md:h-[300px] relative">
                    <Badge className="absolute font-opensans bg-[#B0B4A8]/80 hover:bg-[#B0B4A8] left-2 top-2 z-[10]">
                      {value.badgeText}
                    </Badge>
                    <Link href={value.siteURL} target="_blank">
                      <div className="h-full w-full">
                        <MediaCarousal slides={value.media} />
                      </div>
                    </Link>
                    <div className="px-2 absolute w-full bottom-0 shadow-lg">
                      {value.tags.map((value: string) => (
                        <div
                          key={value}
                          className="text-white font-opensans text-[13px] sm:text-base w-full text-center my-2 p-[6px] rounded-sm bg-[#B0B4A8]/80"
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-20 text-slate-400">
            <p>No sites added yet.</p>
          </div>
        )}
      </div>
      {/* Instagram Videos */}
      <div className="mt-12 sm:mt-8">
        <div className="flex justify-between px-4 sm:px-10">
          <h1 className="text-[35px] font-bagel text-[#C9ADA2] md:text-[60px] xl:text-[80px] 2xl:text-[100px]">
            OUR REELS
          </h1>
          <div className="flex items-center">
            <a href="https://www.instagram.com/persqft.co/" target="_blank">
              <button className="text-[#919191] flex text-xs sm:text-lg items-center space-x-2 sm:space-x-3">
                <span>View Instagram</span>{" "}
                <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
              </button>
            </a>
          </div>
        </div>
        <div className="mt-6">
          {reelsLoading ? (
            <div className="col-span-full text-center py-20 text-slate-400">
              Loading reels from Instagram...
            </div>
          ) : reelsData && reelsData.length > 0 ? (
            <Slider
              data={reelsData}
              renderItem={(reel) => (
                <a
                  href={reel.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="relative cursor-pointer group w-[235px] h-[314px] sm:w-[400px] sm:h-[534px] overflow-hidden rounded-2xl">
                    <img
                      src={reel.mediaUrl}
                      alt="Insta Reel"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.2]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="text-white text-center">
                        <p className="text-md font-semibold tracking-wide flex items-center gap-x-2 uppercase">
                          <Heart className="w-5 h-5" />{" "}
                          {formatLikes(reel.likeCount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              )}
            />
          ) : (
            <div className="col-span-full text-center py-20 text-slate-400">
              <p>No reels available at the moment.</p>
            </div>
          )}
        </div>
      </div>
      {/* Work Images/Videos */}
      <div className="mt-12 sm:mt-8">
        <div className="flex justify-between px-4 sm:px-10">
          <h1 className="text-[35px] md:text-[60px] text-[#B0B4A8] font-bagel xl:text-[80px] 2xl:text-[100px]">
            OUR WORKS
          </h1>
          <div className="flex items-center">
            <Link href="/works">
              <button className="text-[#919191] flex text-xs sm:text-lg items-center space-x-2 sm:space-x-3">
                <span>View All</span>{" "}
                <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
              </button>
            </Link>
          </div>
        </div>
        <div className="mt-6">
          {isLoading ? (
            // Loading State
            <div className="col-span-full text-center py-20 text-slate-400">
              Loading our work...
            </div>
          ) : workData && workData.length > 0 ? (
            <Slider
              data={workData.slice(0,8)} // Show only first 8 items in the slider
              renderItem={(reel) => (
                <Link href={`/works/${reel.id}`}>
                  <div className="group relative w-[235px] h-[314px] sm:w-[400px] sm:h-[534px] overflow-hidden rounded-2xl">
                    {/* Dynamic Media Rendering */}
                    {reel.type === "video" ? (
                      <video
                        src={reel.fileUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.2]"
                      />
                    ) : (
                      <img
                        src={reel.fileUrl}
                        alt={reel.title || "renovation"}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.2]"
                      />
                    )}
                    <div className="text-white font-medium text-[18px] md:text-[26px] shadown-md opacity-0 group-hover:opacity-100 transition-all duration-500 absolute font-opensans left-4 top-4 z-[10]">
                      {reel.title}
                    </div>
                  </div>
                </Link>
              )}
            />
          ) : (
            // Empty State
            <div className="col-span-full text-center py-20 text-slate-400">
              <p>No work uploaded yet.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
