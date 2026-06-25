"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, X, Video, Globe, Trash2, Loader2, Edit3 } from "lucide-react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { useFirestore, useMemoFirebase, useCollection } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";

interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
}

export default function Sites() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  // State for form/logic
  const [isUploading, setIsUploading] = useState(false);
  const [tempMedia, setTempMedia] = useState<MediaItem[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  
  // State for Edit Mode
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  // 1. Fetch Sites Logic
  const sitesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "sites"), orderBy("createdAt", "asc"));
  }, [firestore]);

  const { data: sitesData, isLoading: isDataLoading } = useCollection<any>(sitesQuery);

  // 2. Handle File Uploads
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const storage = getStorage();
    if (!e.target.files || !storage) return;
    
    setIsUploading(true);
    const files = Array.from(e.target.files);

    try {
      const uploadPromises = files.map(async (file) => {
        const fileType = file.type.startsWith("video") ? "video" : "image";
        const storageRef = ref(storage, `sites/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        
        return {
          id: Math.random().toString(36).substr(2, 9),
          type: fileType as "image" | "video",
          url: url
        };
      });

      const uploadedResults = await Promise.all(uploadPromises);
      setTempMedia((prev) => [...prev, ...uploadedResults]);
      
      toast({ title: "Media Uploaded", description: `${files.length} file(s) added.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Upload Failed", description: "Error uploading media." });
    } finally {
      setIsUploading(false);
    }
  };

  const removeMedia = (id: string) => {
    setTempMedia(prev => prev.filter(item => item.id !== id));
  };

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  // 3. Edit Logic: Populate form
  const handleEdit = (site: any) => {
    setEditingId(site.id);
    setValue("name", site.name);
    setValue("badgeText", site.badgeText);
    setValue("siteURL", site.siteURL);
    setTempMedia(site.media || []);
    setTags(site.tags || []);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    reset();
    setTempMedia([]);
    setTags([]);
  };

  // 4. Final Save (Create or Update)
  const onSubmit = async (data: any) => {
    if (!firestore) return;
    if (tempMedia.length === 0) {
      toast({ variant: "destructive", title: "Missing Media", description: "Upload at least one item." });
      return;
    }

    setIsUploading(true);
    try {
      const siteObject = {
        name: data.name,
        badgeText: data.badgeText || "",
        siteURL: data.siteURL || "",
        media: tempMedia,
        tags: tags,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(firestore, "sites", editingId), siteObject);
        toast({ title: "Site Updated", description: "Changes saved successfully." });
      } else {
        await addDoc(collection(firestore, "sites"), { ...siteObject, createdAt: serverTimestamp() });
        toast({ title: "Site Saved", description: "New project added successfully." });
      }

      handleCloseDialog();
    } catch (error) {
      toast({ variant: "destructive", title: "Operation Failed", description: "Error saving to database." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !confirm("Are you sure you want to delete this site?")) return;
    try {
      await deleteDoc(doc(firestore, "sites", id));
      toast({ title: "Deleted", description: "Site removed successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete item." });
    }
  };

  return (
    <div className="p-4 sm:p-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[24px] sm:text-[32px] font-bold font-bagel text-slate-800">
          Sites Management
        </h1>

        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
          <DialogTrigger asChild>
            <button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-[#B0B3A8] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold hover:opacity-90 transition text-sm"
            >
              <Plus size={20} /> Add New Site
            </button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="font-opensans text-2xl text-slate-800">
                {editingId ? "Edit Project Entry" : "Create Project Entry"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold mb-1 text-slate-700">Site Name</label>
                  <input {...register("name", { required: true })} className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-[#B0B3A8]" placeholder="e.g. Aye Studio" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold mb-1 text-slate-700">Badge Text (Domain)</label>
                  <input {...register("badgeText", { required: true })} className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-[#B0B3A8]" placeholder="ayestudio.co" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Site URL</label>
                <input {...register("siteURL", { required: true })} className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:border-[#B0B3A8]" placeholder="https://..." />
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <label className="block text-center cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Plus className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-500">Add Images or Videos</span>
                  </div>
                  <input type="file" multiple accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
                </label>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  {tempMedia.map((item) => (
                    <div key={item.id} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200">
                      {item.type === "video" ? (
                         <div className="w-full h-full bg-black flex items-center justify-center text-white"><Video size={20} /></div>
                      ) : (
                        <img src={item.url} className="w-full h-full object-cover" alt="preview" />
                      )}
                      <button type="button" onClick={() => removeMedia(item.id)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Tags (Services)</label>
                <div className="flex gap-2">
                  <input value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} className="flex-1 p-2.5 rounded-lg border border-slate-200 outline-none focus:border-[#B0B3A8]" placeholder="e.g. Design Services" />
                  <button type="button" onClick={addTag} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold">Add</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-200 rounded-full text-xs font-medium text-slate-700 flex items-center gap-1">
                      {tag} <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => setTags(tags.filter(t => t !== tag))} />
                    </span>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={isUploading} className="w-full bg-black text-white py-4 rounded-xl font-bold hover:opacity-90 disabled:bg-slate-400 transition">
                {isUploading ? "Processing..." : editingId ? "Update Project" : "Save Project"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isDataLoading ? (
          <div className="col-span-full text-center py-20"><Loader2 className="animate-spin mx-auto text-slate-400" /></div>
        ) : (sitesData &&sitesData?.length > 0) ? sitesData?.map((site: any) => (
          <div key={site.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div className="relative aspect-video bg-slate-100">
              {site.media?.[0]?.type === "video" ? (
                <video src={site.media[0].url} className="w-full h-full object-cover" muted playsInline />
              ) : (
                <img src={site.media?.[0]?.url} className="w-full h-full object-cover" alt={site.name} />
              )}
              
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {site.siteURL && (
                  <a href={site.siteURL} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/90 rounded-full text-slate-700 hover:text-black shadow-sm">
                    <Globe size={16} />
                  </a>
                )}
                <button onClick={() => handleEdit(site)} className="p-2 bg-white/90 rounded-full text-blue-600 hover:bg-blue-50 shadow-sm">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => handleDelete(site.id)} className="p-2 bg-white/90 rounded-full text-red-500 hover:bg-red-50 shadow-sm">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-800 leading-tight">{site.name}</h3>
                <span className="text-[10px] font-bold text-[#B0B3A8] uppercase tracking-wider">{site.badgeText}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {site.tags?.map((tag: string) => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-semibold rounded uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )): (
              <div className="col-span-full text-center py-20 text-slate-400">
                <p>No sites added yet.</p>
              </div>
      )}
      </div>
    </div>
  );
}