"use client";
import {
  useUser,
  useFirestore,
  useMemoFirebase,
  useCollection,
} from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Video, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { collection, addDoc, serverTimestamp, deleteDoc, doc, orderBy, query } from "firebase/firestore";

export default function WorkDetails() {
  const { id: workId } = useParams(); 
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const firestore = useFirestore();

  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Query sub-collection: works/{workId}/content
  const contentQuery = useMemoFirebase(() => {
    if (!firestore || !workId) return null;
    return query(
      collection(firestore, "works", workId as string, "content"), 
      orderBy("createdAt", "asc")
    );
  }, [firestore, workId]);

  const { data: contentData, isLoading } = useCollection<any>(contentQuery);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !workId) return;

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const fileList = fileInput?.files;

    if (!fileList || fileList.length === 0) {
      toast({ title: "Error", description: "Select at least one file", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
  const storage = getStorage();
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  const fileList = fileInput?.files;

  if (!fileList) return;

  // Use a for...of loop for strict sequential execution
  for (const file of Array.from(fileList)) {
    const storageRef = ref(storage, `works/${workId}/content/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    // This waits for the previous save to finish before moving to the next file
    await addDoc(collection(firestore, "works", workId as string, "content"), {
      type: file.type.startsWith("video") ? "video" : "image",
      fileUrl: url,
      createdAt: serverTimestamp(),
    });
  }
  
  toast({ title: "Success", description: "All content uploaded in order." });
  setIsDialogOpen(false);
  fileInput.value = ""; 
} catch (error) {
      toast({ title: "Error", description: "Failed to upload content", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await deleteDoc(doc(firestore, "works", workId as string, "content", id));
      toast({ title: "Deleted", description: "Item removed." });
    } catch (error) {
      toast({ title: "Error", description: "Delete failed.", variant: "destructive" });
    }
  };

  if (isUserLoading || !user) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#B0B3A8]" /></div>;

  return (
    <div className="p-4 sm:p-8 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className='text-[24px] sm:text-[32px] font-bold font-bagel text-slate-800'>Project Gallery</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">Ref: {workId}</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <button onClick={() => setIsDialogOpen(true)} className="bg-[#B0B3A8] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-sm hover:opacity-90 transition">
            <Plus size={18} /> Add Media
          </button>

          <DialogContent>
            <DialogHeader><DialogTitle>Upload Gallery Media</DialogTitle></DialogHeader>
            <form onSubmit={handleUpload} className="space-y-6 mt-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-[#B0B3A8] transition">
                <input 
                  id="fileInput" 
                  type="file" 
                  multiple 
                  accept="image/*,video/*" 
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#B0B3A8]/10 file:text-[#B0B3A8] hover:file:bg-[#B0B3A8]/20" 
                />
                <p className="text-[10px] text-slate-400 mt-2">Select multiple images or videos</p>
              </div>

              <button 
                type="submit" 
                disabled={isUploading} 
                className="w-full bg-[#B0B3A8] text-white py-3 rounded-lg font-bold disabled:bg-slate-300 transition"
              >
                {isUploading ? "Uploading..." : "Start Upload"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-300" /></div>
        ) : contentData?.length ? (
          contentData.map((item: any) => (
            <div key={item.id} className="group relative aspect-square rounded-2xl border bg-white overflow-hidden shadow-sm">
              {item.type === "video" ? (
                <video src={item.fileUrl} className="h-full w-full object-cover" autoPlay loop muted playsInline />
              ) : (
                <img src={item.fileUrl} className="h-full w-full object-cover" alt="gallery item" />
              )}

              {/* Simple Delete Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex justify-end items-start">
                <button 
                  onClick={() => handleDelete(item.id)} 
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-white shadow-lg transition-transform hover:scale-110"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Media Type Indicator */}
              <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.type === "video" ? <Video size={12} className="text-slate-600" /> : <ImageIcon size={12} className="text-slate-600" />}
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{item.type}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-[32px]">
            <p className="font-medium">No media in this project yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}