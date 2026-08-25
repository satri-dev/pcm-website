/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import GalleryTable from "./gallery-table";
import GalleryFormModal from "./gallery-form-modal";
import { Gallery, GalleryPhoto } from "@/types/gallery";
import { Plus, RefreshCw } from "lucide-react";

const MOCK_PHOTOS: GalleryPhoto[] = [
  { url: "https://images.unsplash.com/photo-1562774053-701939374fdf?w=800&q=80", title: "Main building", tags: ["campus", "architecture"] },
  { url: "https://images.unsplash.com/photo-1541339907191-e087f0749e34?w=800&q=80", title: "Campus entrance", tags: ["campus", "entrance"] },
  { url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80", title: "Library", tags: ["campus", "library"] },
];

const MOCK_GALLERY: Gallery[] = [
  {
    id: "gallery-1",
    title: "Campus Welcome Ceremony 2026",
    category: "Campus",
    image: "https://images.unsplash.com/photo-1562774053-701939374fdf?w=800&q=80",
    photos: MOCK_PHOTOS,
    date: "2026-01-15",
    photoCount: 3,
    views: 245,
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-01-15T08:00:00Z",
  },
  {
    id: "gallery-2",
    title: "Annual Sports Week",
    category: "Events",
    image: "https://images.unsplash.com/photo-1461896836934-bd45ba05cf26?w=800&q=80",
    photos: [
      { url: "https://images.unsplash.com/photo-1461896836934-bd45ba05cf26?w=800&q=80", title: "Track event", tags: ["sports", "track"] },
      { url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80", title: "Relay race", tags: ["sports", "relay"] },
    ],
    date: "2026-02-10",
    photoCount: 2,
    views: 189,
    createdAt: "2026-02-10T10:00:00Z",
    updatedAt: "2026-02-10T10:00:00Z",
  },
  {
    id: "gallery-3",
    title: "Computer Lab Inauguration",
    category: "Infrastructure",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    photos: [
      { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", title: "Lab setup", tags: ["infrastructure", "lab"] },
      { url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80", title: "Equipment", tags: ["infrastructure", "computers"] },
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80", title: "Inauguration", tags: ["infrastructure", "event"] },
      { url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80", title: "Code screen", tags: ["infrastructure", "coding"] },
    ],
    date: "2026-03-05",
    photoCount: 4,
    views: 156,
    createdAt: "2026-03-05T14:00:00Z",
    updatedAt: "2026-03-05T14:00:00Z",
  },
  {
    id: "gallery-4",
    title: "Graduation Day 2025",
    category: "Graduation",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c87f?w=800&q=80",
    photos: [
      { url: "https://images.unsplash.com/photo-1523050854058-8df90110c87f?w=800&q=80", title: "Ceremony", tags: ["graduation", "ceremony"] },
      { url: "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=800&q=80", title: "Stage", tags: ["graduation", "stage"] },
      { url: "https://images.unsplash.com/photo-1606092195730-5d7b9af1ef4d?w=800&q=80", title: "Graduates", tags: ["graduation", "students"] },
    ],
    date: "2025-12-20",
    photoCount: 3,
    views: 412,
    createdAt: "2025-12-20T09:00:00Z",
    updatedAt: "2025-12-20T09:00:00Z",
  },
  {
    id: "gallery-5",
    title: "Student Cultural Program",
    category: "Students",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ce9f5?w=800&q=80",
    photos: [
      { url: "https://images.unsplash.com/photo-1493225457124-a3eb161ce9f5?w=800&q=80", title: "Performance", tags: ["students", "cultural"] },
    ],
    date: "2026-04-12",
    photoCount: 1,
    views: 0,
    createdAt: "2026-04-12T16:00:00Z",
    updatedAt: "2026-04-12T16:00:00Z",
  },
  {
    id: "gallery-6",
    title: "Faculty Research Symposium",
    category: "Faculty",
    image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&q=80",
    photos: [
      { url: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&q=80", title: "Presentation", tags: ["faculty", "research"] },
      { url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80", title: "Discussion", tags: ["faculty", "research"] },
      { url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80", title: "Audience", tags: ["faculty", "event"] },
    ],
    date: "2026-05-08",
    photoCount: 3,
    views: 98,
    createdAt: "2026-05-08T11:00:00Z",
    updatedAt: "2026-05-08T11:00:00Z",
  },
];

export default function GalleryManager() {
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Gallery | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setGallery(MOCK_GALLERY);
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAddGallery = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditGallery = (item: Gallery) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteGallery = (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    setGallery((prev) => prev.filter((g) => g.id !== id));
  };

  const handleSaveGallery = (data: Gallery) => {
    setSaving(true);
    setTimeout(() => {
      if (editingItem) {
        setGallery((prev) =>
          prev.map((g) => (g.id === data.id ? { ...data, updatedAt: new Date().toISOString() } : g))
        );
      } else {
        setGallery((prev) => [
          { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          ...prev,
        ]);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setSaving(false);
    }, 400);
  };

  return (
    <main>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
            Photo Gallery
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage, organize and publish photo albums.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="admin-btn"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleAddGallery}
          >
            <Plus size={16} />
            Add Photo
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {loading ? (
            <div className="p-6 text-center">
              <div className="flex flex-col items-center">
                <RefreshCw size={32} className="opacity-40 mb-4 animate-spin" />
                <p>Loading gallery items…</p>
              </div>
            </div>
          ) : (
            <GalleryTable
              gallery={gallery}
              onAdd={handleAddGallery}
              onEdit={handleEditGallery}
              onDelete={handleDeleteGallery}
            />
          )}
        </div>
      </div>

      <GalleryFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        gallery={editingItem}
        onSave={handleSaveGallery}
        saving={saving}
      />
    </main>
  );
}
