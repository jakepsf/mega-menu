"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  useFirestore,
  useMemoFirebase,
  useCollection,
} from "@/firebase";
import {
  collection,
  orderBy,
  query,
} from "firebase/firestore";
import { OurWork } from "@/lib/types";
import Link from "next/link";

export default function WorkComponent() {
  const firestore = useFirestore();

  const workQuery = useMemoFirebase(() => {
    if (!firestore) return null;

    // 1. Reference the collection
    const colRef = collection(firestore, "works");

    // 2. Create a query that orders by 'createdAt' in descending order
    return query(colRef, orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: workData, isLoading } = useCollection<OurWork>(workQuery);
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-grow mt-4 sm:mt-0">
        <h1 className="text-[35px] mb-12 px-4 sm:px-10 md:text-[60px] text-[#B0B4A8] font-bagel xl:text-[80px] 2xl:text-[100px]">
          WORK SHOWCASE
        </h1>
        <div className="mt-6 px-4 sm:px-10 grid md:grid-cols-2 gap-4 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full text-center py-10 text-slate-500">
              Loading our work...
            </div>
          ) : workData && workData?.length > 0 ? (
            workData.map((reel) => {
              return (
                <Link href={`/works/${reel.id}`} key={reel.id}>
                <div className="group relative h-[500px] md:h-[534px] overflow-hidden rounded-2xl">
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
                      alt={reel.title || 'renovation'}

                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.2]"
                    />
                  )}

                   <div className="text-white font-medium text-[26px] shadown-md opacity-0 group-hover:opacity-100 transition-all duration-500 absolute font-opensans left-4 top-4 z-[10]">
                        {reel.title}
                    </div>
                </div>
                </Link>
              );
            })
          ) : (
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
