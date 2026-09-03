"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Check, X, AlertTriangle, Phone, Mail } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import type { TopBarLink, TopBarContact } from "@/types/topbar";

interface Props {
  links: TopBarLink[];
  contact: TopBarContact | null;
}

interface DeleteDialogProps {
  isOpen: boolean;
  linkLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteDialog({ isOpen, linkLabel, onConfirm, onCancel }: DeleteDialogProps) {
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
              Delete Link
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this link? This action cannot be undone.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mb-6">
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            "{linkLabel}"
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
            Delete Link
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TopBarManager({ links: initialLinks, contact: initialContact }: Props) {
  const [links, setLinks] = useState(initialLinks);
  const [contact, setContact] = useState(initialContact);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; linkId: string | null; linkLabel: string }>({
    isOpen: false,
    linkId: null,
    linkLabel: "",
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Sync links state with prop changes
  useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks]);
  
  // Sync contact state with prop changes
  useEffect(() => {
    setContact(initialContact);
  }, [initialContact]);
  
  // Auto-dismiss messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  const [formData, setFormData] = useState({
    label: "",
    href: "",
    status: "active" as "active" | "inactive",
    type: "simple" as "simple" | "dropdown",
    dropdownItems: [] as { label: string; href: string }[],
    order: links.length,
  });
  const [contactForm, setContactForm] = useState({
    phone: contact?.phone || "",
    phoneDisplay: contact?.phoneDisplay || "",
    email: contact?.email || "",
    facebookUrl: contact?.facebookUrl || "",
    instagramUrl: contact?.instagramUrl || "",
    showLanguageSwitcher: contact?.showLanguageSwitcher ?? true,
  });

  const resetForm = () => {
    setFormData({
      label: "",
      href: "",
      status: "active",
      type: "simple",
      dropdownItems: [],
      order: links.length,
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/admin/topbar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        resetForm();
        setMessage({ type: 'success', text: 'Link created successfully!' });
        window.location.reload();
      } else {
        const error = await res.json();
        setMessage({ type: 'error', text: error.error || 'Failed to create link.' });
      }
    } catch (error) {
      console.error("Failed to create link:", error);
      setMessage({ type: 'error', text: 'Failed to create link. Please try again.' });
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/topbar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        resetForm();
        setMessage({ type: 'success', text: 'Link updated successfully!' });
        window.location.reload();
      } else {
        const error = await res.json();
        setMessage({ type: 'error', text: error.error || 'Failed to update link.' });
      }
    } catch (error) {
      console.error("Failed to update link:", error);
      setMessage({ type: 'error', text: 'Failed to update link. Please try again.' });
    }
  };

  const openDeleteDialog = (link: TopBarLink) => {
    setDeleteDialog({
      isOpen: true,
      linkId: link.id,
      linkLabel: link.label,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      linkId: null,
      linkLabel: "",
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.linkId) return;
    
    try {
      const res = await fetch(`/api/admin/topbar/${deleteDialog.linkId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        closeDeleteDialog();
        setMessage({ type: 'success', text: 'Link deleted successfully!' });
        window.location.reload();
      } else {
        const error = await res.json();
        setMessage({ type: 'error', text: error.error || 'Failed to delete link.' });
      }
    } catch (error) {
      console.error("Failed to delete link:", error);
      setMessage({ type: 'error', text: 'Failed to delete link. Please try again.' });
    }
  };

  const startEdit = (link: TopBarLink) => {
    setIsCreating(false);
    setEditingId(link.id);
    setFormData({
      label: link.label,
      href: link.href,
      status: link.status,
      type: link.type,
      dropdownItems: link.dropdownItems || [],
      order: link.order,
    });
  };

  const startCreate = () => {
    setEditingId(null);
    setIsCreating(true);
    setFormData({
      label: "",
      href: "",
      status: "active",
      type: "simple",
      dropdownItems: [],
      order: links.length,
    });
  };

  const addDropdownItem = () => {
    setFormData({
      ...formData,
      dropdownItems: [...formData.dropdownItems, { label: "", href: "" }],
    });
  };

  const removeDropdownItem = (index: number) => {
    setFormData({
      ...formData,
      dropdownItems: formData.dropdownItems.filter((_, i) => i !== index),
    });
  };

  const updateDropdownItem = (index: number, field: "label" | "href", value: string) => {
    const updated = [...formData.dropdownItems];
    updated[index][field] = value;
    setFormData({ ...formData, dropdownItems: updated });
  };

  const handleUpdateContact = async () => {
    try {
      const res = await fetch("/api/admin/topbar/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        setEditingContact(false);
        setMessage({ type: 'success', text: 'Contact information updated successfully!' });
        window.location.reload();
      } else {
        const error = await res.json();
        setMessage({ type: 'error', text: error.error || 'Failed to update contact information.' });
      }
    } catch (error) {
      console.error("Failed to update contact:", error);
      setMessage({ type: 'error', text: 'Failed to update contact information. Please try again.' });
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {message && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 duration-300">
          <div className={`
            flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-md
            ${message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700' 
              : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700'}
          `}>
            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
              ${message.type === 'success' 
                ? 'bg-green-100 dark:bg-green-800' 
                : 'bg-red-100 dark:bg-red-800'}
            `}>
              {message.type === 'success' ? (
                <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
              ) : (
                <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400" />
              )}
            </div>
            <p className={`text-sm font-medium
              ${message.type === 'success' 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-red-800 dark:text-red-200'}
            `}>
              {message.text}
            </p>
            <button
              onClick={() => setMessage(null)}
              className={`ml-auto flex-shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors
                ${message.type === 'success' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'}
              `}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        linkLabel={deleteDialog.linkLabel}
        onConfirm={confirmDelete}
        onCancel={closeDeleteDialog}
      />

      <div className="space-y-6">
        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Contact Information
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Phone, email and social media links
              </p>
            </div>
            {!editingContact && (
              <button
                onClick={() => setEditingContact(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          <div className="p-4">
            {editingContact ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="061544761"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Phone Display
                    </label>
                    <input
                      type="text"
                      value={contactForm.phoneDisplay}
                      onChange={(e) => setContactForm({ ...contactForm, phoneDisplay: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(061) 544761, 570124"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="info@pcm.edu.np"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={contactForm.facebookUrl}
                      onChange={(e) => setContactForm({ ...contactForm, facebookUrl: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://www.facebook.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={contactForm.instagramUrl}
                      onChange={(e) => setContactForm({ ...contactForm, instagramUrl: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://www.instagram.com/..."
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contactForm.showLanguageSwitcher}
                      onChange={(e) => setContactForm({ ...contactForm, showLanguageSwitcher: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Show Language Switcher (EN / ने)
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                    Toggle to show or hide the language switcher in the top bar
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleUpdateContact}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Check className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingContact(false)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">{contact?.phoneDisplay || "Not set"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">{contact?.email || "Not set"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FaFacebook className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100 truncate">{contact?.facebookUrl || "Not set"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FaInstagram className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100 truncate">{contact?.instagramUrl || "Not set"}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Links List */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                TopBar Links ({links.length})
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Manage navigation links in the top bar
              </p>
            </div>
            <button
              onClick={startCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Link
            </button>
          </div>
          
          <div className="max-h-[600px] overflow-y-auto">
            <div className="p-4 space-y-3">
              {/* Create/Edit Form */}
              {(isCreating || editingId) && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Label <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.label}
                          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Scholarships"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Type
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as "simple" | "dropdown" })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="simple">Simple Link</option>
                          <option value="dropdown">Dropdown</option>
                        </select>
                      </div>
                    </div>
                    {formData.type === "simple" && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.href}
                          onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="/scholarship"
                        />
                      </div>
                    )}
                    {formData.type === "dropdown" && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Dropdown Items
                          </label>
                          <button
                            type="button"
                            onClick={addDropdownItem}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            + Add Item
                          </button>
                        </div>
                        {formData.dropdownItems.map((item, idx) => (
                          <div key={idx} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => updateDropdownItem(idx, "label", e.target.value)}
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                              placeholder="Label"
                            />
                            <input
                              type="text"
                              value={item.href}
                              onChange={(e) => updateDropdownItem(idx, "href", e.target.value)}
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                              placeholder="/url"
                            />
                            <button
                              type="button"
                              onClick={() => removeDropdownItem(idx)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Order
                        </label>
                        <input
                          type="number"
                          value={formData.order}
                          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          if (isCreating) {
                            handleCreate();
                          } else if (editingId) {
                            handleUpdate(editingId);
                          }
                        }}
                        disabled={!formData.label || (formData.type === "simple" && !formData.href)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                      >
                        <Check className="w-3 h-3" />
                        {isCreating ? "Create" : "Save"}
                      </button>
                      <button
                        onClick={resetForm}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Existing Links */}
              {links.map((link) => (
                <div key={link.id}>
                  {editingId === link.id ? null : (
                    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 break-words">
                              {link.label}
                            </span>
                            {link.status === "active" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex-shrink-0">
                                <Eye className="w-3 h-3" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 flex-shrink-0">
                                <EyeOff className="w-3 h-3" />
                                Inactive
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {link.type === "simple" ? (
                              <span>{link.href}</span>
                            ) : (
                              <span>{link.dropdownItems?.length || 0} dropdown items</span>
                            )}
                            <span>Order: {link.order}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
                          <button
                            onClick={() => startEdit(link)}
                            className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                            title="Edit link"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteDialog(link)}
                            className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                            title="Delete link"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {links.length === 0 && !isCreating && (
                <div className="text-center py-12">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                    No links yet
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Create your first topbar link to get started
                  </p>
                  <button
                    onClick={startCreate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Your First Link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
