"use client";

import { useState, useEffect } from "react";
import { Check, X, Plus, Edit, Trash2, AlertTriangle, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import ImageUpload from "@/components/cloudinary/ImageUpload";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FooterSettings, FooterLink } from "@/types/footer";

interface Props {
  settings: FooterSettings | null;
}

interface DeleteDialogProps {
  isOpen: boolean;
  linkTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteDialog({ isOpen, linkTitle, onConfirm, onCancel }: DeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Delete Footer Section
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this footer section? This action cannot be undone.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mb-6">
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            "{linkTitle}"
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Section
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FooterManager({ settings: initialSettings }: Props) {
  // Footer Settings State
  const [settingsData, setSettingsData] = useState({
    logoUrl: initialSettings?.logoUrl || "",
    tagline: initialSettings?.tagline || "",
    address: initialSettings?.address || "",
    phone: initialSettings?.phone || "",
    email: initialSettings?.email || "",
    mapUrl: initialSettings?.mapUrl || "",
    facebookUrl: initialSettings?.facebookUrl || "",
    instagramUrl: initialSettings?.instagramUrl || "",
    linkedinUrl: initialSettings?.linkedinUrl || "",
    whatsappNumber: initialSettings?.whatsappNumber || "",
    weekdaysHours: initialSettings?.weekdaysHours || "",
    saturdayHours: initialSettings?.saturdayHours || "",
    affiliationText: initialSettings?.affiliationText || "",
    affiliationBadge: initialSettings?.affiliationBadge || "",
    newsletterTitle: initialSettings?.newsletterTitle || "",
    newsletterDescription: initialSettings?.newsletterDescription || "",
    newsletterButtonText: initialSettings?.newsletterButtonText || "Subscribe",
    copyrightText: initialSettings?.copyrightText || "",
    developerName: initialSettings?.developerName || "",
    developerUrl: initialSettings?.developerUrl || "",
  });

  // Footer Links State
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; linkId: string | null; linkTitle: string }>({
    isOpen: false,
    linkId: null,
    linkTitle: "",
  });
  const [linkFormData, setLinkFormData] = useState({
    title: "",
    links: [{ label: "", href: "", external: false }],
    order: 0,
    status: "active" as "active" | "inactive",
  });

  // Fetch footer links
  useEffect(() => {
    fetchFooterLinks();
  }, []);

  const fetchFooterLinks = async () => {
    try {
      const res = await fetch("/api/admin/footer/links");
      if (res.ok) {
        const data = await res.json();
        setFooterLinks(data);
      }
    } catch (error) {
      console.error("Failed to fetch footer links:", error);
    }
  };

  // Settings Handlers
  const handleLogoUpload = (result: { secure_url: string }) => {
    setSettingsData((prev) => ({ ...prev, logoUrl: result.secure_url }));
  };

  const handleSaveSettings = async () => {
    try {
      const res = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsData),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update footer:", error);
      alert("Failed to update footer. Please try again.");
    }
  };

  // Link Section Handlers
  const resetLinkForm = () => {
    setLinkFormData({
      title: "",
      links: [{ label: "", href: "", external: false }],
      order: footerLinks.length,
      status: "active",
    });
    setIsCreatingLink(false);
    setEditingLinkId(null);
  };

  const startCreateLink = () => {
    setEditingLinkId(null);
    setIsCreatingLink(true);
    setLinkFormData({
      title: "",
      links: [{ label: "", href: "", external: false }],
      order: footerLinks.length,
      status: "active",
    });
  };

  const startEditLink = (link: FooterLink) => {
    setIsCreatingLink(false);
    setEditingLinkId(link.id);
    setLinkFormData({
      title: link.title,
      links: link.links.map(l => ({ ...l, external: l.external ?? false })),
      order: link.order,
      status: link.status,
    });
  };

  const addLinkItem = () => {
    setLinkFormData({
      ...linkFormData,
      links: [...linkFormData.links, { label: "", href: "", external: false }],
    });
  };

  const removeLinkItem = (index: number) => {
    setLinkFormData({
      ...linkFormData,
      links: linkFormData.links.filter((_, i) => i !== index),
    });
  };

  const updateLinkItem = (index: number, field: string, value: string | boolean) => {
    const newLinks = [...linkFormData.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinkFormData({ ...linkFormData, links: newLinks });
  };

  const handleCreateLink = async () => {
    try {
      const res = await fetch("/api/admin/footer/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(linkFormData),
      });
      if (res.ok) {
        resetLinkForm();
        fetchFooterLinks();
      }
    } catch (error) {
      console.error("Failed to create footer link:", error);
      alert("Failed to create footer link. Please try again.");
    }
  };

  const handleUpdateLink = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/footer/links/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(linkFormData),
      });
      if (res.ok) {
        resetLinkForm();
        fetchFooterLinks();
      }
    } catch (error) {
      console.error("Failed to update footer link:", error);
      alert("Failed to update footer link. Please try again.");
    }
  };

  const openDeleteDialog = (link: FooterLink) => {
    setDeleteDialog({
      isOpen: true,
      linkId: link.id,
      linkTitle: link.title,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      linkId: null,
      linkTitle: "",
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.linkId) return;
    
    try {
      const res = await fetch(`/api/admin/footer/links/${deleteDialog.linkId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        closeDeleteDialog();
        fetchFooterLinks();
      } else {
        alert("Failed to delete footer link. Please try again.");
      }
    } catch (error) {
      console.error("Failed to delete footer link:", error);
      alert("Failed to delete footer link. Please try again.");
    }
  };

  return (
    <>
      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        linkTitle={deleteDialog.linkTitle}
        onConfirm={confirmDelete}
        onCancel={closeDeleteDialog}
      />

      <div className="space-y-6">
        {/* Section 1: Footer Settings */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Footer Settings
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage footer logo, contact info, and social media
            </p>
          </div>

          <div className="p-6">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4 pr-4">
                  {/* Simplified form - only key fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Logo URL (Cloudinary)
                    </label>
                    <div className="flex items-start gap-3">
                      {settingsData.logoUrl && (
                        <div className="flex-shrink-0">
                          <Image
                            src={settingsData.logoUrl}
                            alt="Logo"
                            width={60}
                            height={60}
                            className="rounded-lg border border-gray-200 dark:border-gray-700"
                          />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            value={settingsData.logoUrl}
                            onChange={(e) => setSettingsData({ ...settingsData, logoUrl: e.target.value })}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://res.cloudinary.com/..."
                          />
                          <div className="flex-shrink-0">
                            <ImageUpload 
                              onUpload={handleLogoUpload}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Upload an image or paste the Cloudinary URL above
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={settingsData.tagline}
                      onChange={(e) => setSettingsData({ ...settingsData, tagline: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={settingsData.phone}
                      onChange={(e) => setSettingsData({ ...settingsData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settingsData.email}
                      onChange={(e) => setSettingsData({ ...settingsData, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Address
                    </label>
                    <input
                      type="text"
                      value={settingsData.address}
                      onChange={(e) => setSettingsData({ ...settingsData, address: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Map URL (Google Maps embed or link)
                    </label>
                    <input
                      type="url"
                      value={settingsData.mapUrl}
                      onChange={(e) => setSettingsData({ ...settingsData, mapUrl: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://maps.google.com/..."
                    />
                  </div>

                  {/* Social Media Section */}
                  <div className="md:col-span-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Social Media Links</h4>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={settingsData.facebookUrl}
                      onChange={(e) => setSettingsData({ ...settingsData, facebookUrl: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={settingsData.instagramUrl}
                      onChange={(e) => setSettingsData({ ...settingsData, instagramUrl: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://instagram.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={settingsData.linkedinUrl}
                      onChange={(e) => setSettingsData({ ...settingsData, linkedinUrl: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://linkedin.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Copyright Text
                    </label>
                    <input
                      type="text"
                      value={settingsData.copyrightText}
                      onChange={(e) => setSettingsData({ ...settingsData, copyrightText: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={settingsData.whatsappNumber}
                      onChange={(e) => setSettingsData({ ...settingsData, whatsappNumber: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="97761544761"
                    />
                  </div>

                  {/* Opening Hours Section */}
                  <div className="md:col-span-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Opening Hours</h4>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Weekdays Hours
                    </label>
                    <input
                      type="text"
                      value={settingsData.weekdaysHours}
                      onChange={(e) => setSettingsData({ ...settingsData, weekdaysHours: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Sun-Fri: 6:00 AM - 5:00 PM"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Saturday Hours
                    </label>
                    <input
                      type="text"
                      value={settingsData.saturdayHours}
                      onChange={(e) => setSettingsData({ ...settingsData, saturdayHours: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Sat: 6:00 AM - 1:00 PM"
                    />
                  </div>

                  {/* Newsletter Section */}
                  <div className="md:col-span-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Newsletter Subscription</h4>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Newsletter Title
                    </label>
                    <input
                      type="text"
                      value={settingsData.newsletterTitle}
                      onChange={(e) => setSettingsData({ ...settingsData, newsletterTitle: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="STAY IN THE LOOP"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Newsletter Description
                    </label>
                    <textarea
                      value={settingsData.newsletterDescription}
                      onChange={(e) => setSettingsData({ ...settingsData, newsletterDescription: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Monthly highlights & events, scholarships and results. No spam, unsubscribe anytime."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={settingsData.newsletterButtonText}
                      onChange={(e) => setSettingsData({ ...settingsData, newsletterButtonText: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Subscribe"
                    />
                  </div>

                  {/* Affiliation Section */}
                  <div className="md:col-span-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Affiliation</h4>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Affiliation Text
                    </label>
                    <input
                      type="text"
                      value={settingsData.affiliationText}
                      onChange={(e) => setSettingsData({ ...settingsData, affiliationText: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Affiliated to Tribhuvan University"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Affiliation Badge URL (Cloudinary)
                    </label>
                    <input
                      type="url"
                      value={settingsData.affiliationBadge}
                      onChange={(e) => setSettingsData({ ...settingsData, affiliationBadge: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://res.cloudinary.com/..."
                    />
                  </div>

                  {/* Developer Info Section */}
                  <div className="md:col-span-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Developer Info</h4>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Developer Name
                    </label>
                    <input
                      type="text"
                      value={settingsData.developerName}
                      onChange={(e) => setSettingsData({ ...settingsData, developerName: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Developer URL
                    </label>
                    <input
                      type="url"
                      value={settingsData.developerUrl}
                      onChange={(e) => setSettingsData({ ...settingsData, developerUrl: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleSaveSettings}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    <Check className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Section 2: Footer Link Sections (Add/Edit/Delete) */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Footer Link Sections ({footerLinks.length})
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Add link sections like "Quick Links", "Programs", "Resources", etc.
              </p>
            </div>
            <button
              onClick={startCreateLink}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </button>
          </div>
          
          <ScrollArea className="h-[600px]">
            <div className="p-4 space-y-3 pr-4">
              {/* Create Form */}
              {isCreatingLink && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Create New Footer Section
                    </h3>
                    <button
                      onClick={resetLinkForm}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Section Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={linkFormData.title}
                          onChange={(e) => setLinkFormData({ ...linkFormData, title: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Quick Links"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Order
                        </label>
                        <input
                          type="number"
                          value={linkFormData.order}
                          onChange={(e) => setLinkFormData({ ...linkFormData, order: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Status
                        </label>
                        <select
                          value={linkFormData.status}
                          onChange={(e) => setLinkFormData({ ...linkFormData, status: e.target.value as "active" | "inactive" })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                          Links
                        </label>
                        <button
                          onClick={addLinkItem}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          Add Link
                        </button>
                      </div>
                      <div className="space-y-2">
                        {linkFormData.links.map((link, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => updateLinkItem(index, "label", e.target.value)}
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Link Label"
                            />
                            <input
                              type="text"
                              value={link.href}
                              onChange={(e) => updateLinkItem(index, "href", e.target.value)}
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="/about"
                            />
                            <label className="flex items-center gap-1.5 px-2 py-2 text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={link.external}
                                onChange={(e) => updateLinkItem(index, "external", e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              External
                            </label>
                            {linkFormData.links.length > 1 && (
                              <button
                                onClick={() => removeLinkItem(index)}
                                className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleCreateLink}
                        disabled={!linkFormData.title}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                      >
                        <Check className="w-3 h-3" />
                        Create Section
                      </button>
                      <button
                        onClick={resetLinkForm}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Existing Footer Link Sections */}
              {footerLinks.map((link) => (
                <div key={link.id}>
                  {editingLinkId === link.id ? (
                    // Edit Mode
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Section Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={linkFormData.title}
                              onChange={(e) => setLinkFormData({ ...linkFormData, title: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Order
                            </label>
                            <input
                              type="number"
                              value={linkFormData.order}
                              onChange={(e) => setLinkFormData({ ...linkFormData, order: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Status
                            </label>
                            <select
                              value={linkFormData.status}
                              onChange={(e) => setLinkFormData({ ...linkFormData, status: e.target.value as "active" | "inactive" })}
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                              Links
                            </label>
                            <button
                              onClick={addLinkItem}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                              Add Link
                            </button>
                          </div>
                          <div className="space-y-2">
                            {linkFormData.links.map((linkItem, index) => (
                              <div key={index} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={linkItem.label}
                                  onChange={(e) => updateLinkItem(index, "label", e.target.value)}
                                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Link Label"
                                />
                                <input
                                  type="text"
                                  value={linkItem.href}
                                  onChange={(e) => updateLinkItem(index, "href", e.target.value)}
                                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="/about"
                                />
                                <label className="flex items-center gap-1.5 px-2 py-2 text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                  <input
                                    type="checkbox"
                                    checked={linkItem.external}
                                    onChange={(e) => updateLinkItem(index, "external", e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  External
                                </label>
                                {linkFormData.links.length > 1 && (
                                  <button
                                    onClick={() => removeLinkItem(index)}
                                    className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleUpdateLink(link.id)}
                            disabled={!linkFormData.title}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                          >
                            <Check className="w-3 h-3" />
                            Save
                          </button>
                          <button
                            onClick={resetLinkForm}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                              {link.title}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              (Order: {link.order})
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              link.status === "active" 
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            }`}>
                              {link.status}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {link.links.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <LinkIcon className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">
                                  {item.label} → {item.href}
                                </span>
                                {item.external && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                    external
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => startEditLink(link)}
                            className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                            title="Edit section"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteDialog(link)}
                            className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                            title="Delete section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {footerLinks.length === 0 && !isCreatingLink && (
                <div className="text-center py-12">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                    No footer sections yet
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Create your first footer link section
                  </p>
                  <button
                    onClick={startCreateLink}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Section
                  </button>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
