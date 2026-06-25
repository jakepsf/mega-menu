"use client";
import {
  useUser,
  useFirestore,
  useMemoFirebase,
  useCollection,
} from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Edit3, X } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { collection, addDoc, serverTimestamp, deleteDoc, doc, orderBy, query, updateDoc, writeBatch, getDocs } from "firebase/firestore";
import { OurWork } from "@/lib/types";
import Link from "next/link";

const uploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["image", "video"]),
  year: z.string().min(4, "Year must be 4 digits"),
  file: z.any().optional(),
  description: z.string()
});

export default function Works() {
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const firestore = useFirestore();

  // Logic States
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentFileUrl, setCurrentFileUrl] = useState<string | null>(null);

  const workQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "works"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: workData, isLoading } = useCollection<OurWork>(workQuery);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: { type: "image" }
  });

  // Handle Edit Populate
  const handleEditClick = (e: React.MouseEvent, item: OurWork) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(item.id);
    setValue("title", item.title);
    setValue("year", item.year);
    setValue("description", item.description);
    setValue("type", item.type as "image" | "video");
    setCurrentFileUrl(item.fileUrl);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setCurrentFileUrl(null);
    reset();
  };

  const onSubmit = async (data: any) => {
    if (!firestore) return;
    const file = data.file?.[0];

    if (!editingId && !file) {
      toast({ title: "Error", description: "Please select a file", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    try {
      let finalFileUrl = currentFileUrl;

      if (file) {
        const storage = getStorage();
        const storageRef = ref(storage, `works/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        finalFileUrl = await getDownloadURL(snapshot.ref);
      }

      const payload = {
        title: data.title,
        type: data.type,
        year: data.year,
        description: data.description,
        fileUrl: finalFileUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(firestore, "works", editingId), payload);
        toast({ title: "Success", description: "Entry updated successfully." });
      } else {
        await addDoc(collection(firestore, "works"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        toast({ title: "Success", description: "New entry added." });
      }

      handleCloseDialog();
    } catch (error) {
      console.error(error);
      toast({ title: "Failed", description: "Error saving content.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

const handleDelete = async (e: React.MouseEvent, id: string) => {
  e.preventDefault();
  e.stopPropagation();

  if (!window.confirm("Delete this work and ALL its gallery images/videos?")) return;

  try {
    const batch = writeBatch(firestore);

    // 1. Reference the sub-collection
    const contentSnap = await getDocs(collection(firestore, "works", id, "content"));
    
    // 2. Add all sub-documents to the batch
    contentSnap.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // 3. Add the main document to the batch
    batch.delete(doc(firestore, "works", id));

    // 4. Commit the batch
    await batch.commit();

    toast({ title: "Deleted", description: "Project and all content removed." });
  } catch (error) {
    console.error(error);
    toast({ title: "Error", description: "Failed to delete everything.", variant: "destructive" });
  }
};

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#B0B3A8]" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[24px] sm:text-[32px] font-bold font-bagel text-slate-800">
          Work Portfolio
        </h1>

        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#B0B3A8] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold hover:opacity-90 transition"
          >
            <Plus size={20} /> Add New
          </button>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-opensans text-2xl">
                {editingId ? "Edit Work" : "Add New Work"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Title</label>
                <input
                  {...register("title")}
                  className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-[#B0B3A8]"
                  placeholder="e.g. Minimalist Kitchen"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Year</label>
                <input
                  {...register("year")}
                  className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-[#B0B3A8]"
                  placeholder="e.g. 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Cover</label>
                <select
                  {...register("type")}
                  className="w-full p-2.5 rounded-lg border border-slate-200"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  {editingId ? "Replace File (Optional)" : "Select File"}
                </label>
                <input
                  type="file"
                  {...register("file")}
                  accept="image/*,video/*"
                  className="w-full p-2.5 rounded-lg border border-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#B0B3A8] file:text-white"
                />
              </div>

                 <div>
                  <label className="block text-sm font-semibold mb-1">
                    Description (To be render with content images)
                  </label>
                  <textarea
                    {...register("description")}
                    className="w-full p-2.5 rounded-lg border border-slate-200 h-20"
                  />
                </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-[#B0B3A8] text-white py-3 rounded-lg font-bold hover:opacity-90 transition disabled:bg-slate-300"
              >
                {isUploading ? "Processing..." : editingId ? "Update Entry" : "Save Entry"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-10 text-slate-500"><Loader2 className="animate-spin mx-auto" /></div>
        ) : workData && workData.length > 0 ? (
          workData.map((item) => (
            <Link href={`/admin/works/${item.id}`} key={item.id} className="block relative group">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                {item.type === "video" ? (
                  <video src={item.fileUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                ) : (
                  <img src={item.fileUrl} className="w-full h-full object-cover" alt={item.title || 'work'} />
                )}

                {/* Overlay with Actions */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={(e) => handleEditClick(e, item)}
                      className="bg-white/90 p-2 rounded-full text-blue-600 hover:bg-white shadow-sm"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="bg-white/90 p-2 rounded-full text-red-500 hover:bg-red-50 shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {item.title && (
                    <div className="bg-white/80 backdrop-blur-sm p-2 rounded-xl">
                      <p className="text-[11px] font-bold text-slate-800 truncate uppercase tracking-tighter">
                        {item.title}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-slate-400">No work uploaded yet.</div>
        )}
      </div>
    </div>
  );
}