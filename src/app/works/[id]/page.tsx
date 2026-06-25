"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  useFirestore,
  useMemoFirebase,
  useCollection,
  useDoc
} from "@/firebase";
import {
  collection,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { OurWork } from "@/lib/types";
import { useParams } from "next/dist/client/components/navigation";
import { Loader2 } from "lucide-react";

export default function Works() {
  const firestore = useFirestore();
  const { id: workId } = useParams(); 
  

  const workQuery = useMemoFirebase(() => {
    if (!firestore) return null;

    return doc(firestore, 'works', workId as string);

  }, [firestore]);

    const contentQuery = useMemoFirebase(() => {
    if (!firestore || !workId) return null;
    return query(
      collection(firestore, "works", workId as string, "content"), 
      orderBy("createdAt", "asc")
    );
  }, [firestore, workId]);

  const { data: contentData, isLoading: isContentLoading } = useCollection<any>(contentQuery);

  const { data: workData, isLoading } = useDoc<OurWork>(workQuery);

  if(isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#B0B3A8]" />
      </div> 
      ) 
  }


  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-grow mt-4 sm:mt-0">
        <h1 className="text-[35px] leading-none px-4 sm:px-10 md:text-[60px] text-[#B0B4A8] font-bagel xl:text-[80px] 2xl:text-[90px]">
          {workData?.title || 'Our Work'}
        </h1>
        <h6 className="mt-20 mb-12 px-4 sm:px-10 text-[#c9aea1]">{workData?.year || ''}</h6>
        <div className="mt-6">
          {(isContentLoading || isLoading) ? (
            <div className="col-span-full text-center py-10 text-slate-500">
              Loading content...
            </div>
          ) : contentData && contentData?.length > 0 ? (
            <>
            <div className={`grid md:grid-cols-2 gap-2 ${contentData.length > 4 ? 'mb-2' : ''}`}>
            {
                contentData.length > 4 && contentData.slice(0, 4).map((reel) => {
                  return (
                    <div key={reel.id} className="group relative h-[500px] sm:h-[700px] overflow-hidden">
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
                    </div>
                  );
                })
            }
            </div>
              <div className={`w-full whitespace-pre-line leading-loose ${contentData.length > 4 ? 'py-20' : 'pb-16'} font-opensans px-4 sm:px-10`}>
              {workData?.description || ''}
            </div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
            {
               contentData.slice(contentData.length > 4 ? 4 : 0).map((reel) => {
                  return (
                    <div key={reel.id} className="group relative h-[400px] sm:h-[600px] overflow-hidden">
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
                    </div>
                  );
                })
            }
            </div>
            </>
          ) : (
            <div className="col-span-full text-center py-20 text-slate-400">
              <p>No content uploaded yet.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
