"use client";

import React, { useState } from "react";
import { FileText } from "lucide-react";
import type { AdmissionPageContent } from "@/types/page-content";
import ImageUpload from "@/components/cloudinary/ImageUpload";
import DocumentUpload from "@/components/cloudinary/DocumentUpload";
import { provinces, districtsForProvince, municipalitiesForDistrict, wardsForMunicipality } from "@/lib/location";

interface DynamicFormFieldsProps {
  fields: AdmissionPageContent["applicationForm"]["personalInfoFields"];
  formData: Record<string, any>;
  onUpdate: (fieldId: string, value: any) => void;
}

type FieldItem = AdmissionPageContent["applicationForm"]["personalInfoFields"][number];

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-white placeholder:text-gray-400 transition-all focus:outline-none focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10";

function Label({ field }: { field: { label: string; required?: boolean } }) {
  return (
    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
      {field.label} {field.required && <span className="text-red-500">*</span>}
    </label>
  );
}

function HelpText({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="text-xs text-gray-500 mt-1.5">{text}</p>;
}

export function DynamicFormFields({ fields, formData, onUpdate }: DynamicFormFieldsProps) {
  const [uploaded, setUploaded] = useState<Record<string, { url: string; name: string }>>({});

  if (!fields || fields.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 text-sm">
        <p>No fields configured yet. Please configure fields in the admin panel.</p>
      </div>
    );
  }

  // Helper to find guardian type field
  function getGuardianType(): string | undefined {
    const guardianField = fields.find((f) => {
      const ll = f.label.toLowerCase();
      return ll.includes("guardian") && ll.includes("type");
    });
    if (!guardianField) return undefined;
    return formData[guardianField.id] as string | undefined;
  }

  // Helper to check if field is conditional guardian field
  function isConditionalGuardianField(field: FieldItem): boolean {
    const ll = field.label.toLowerCase();
    return (
      ll.includes("father") ||
      ll.includes("mother") ||
      ll.includes("relationship") ||
      (ll.includes("guardian") && !ll.includes("type"))
    );
  }

  // Helper to check if guardian field should be shown
  function shouldShowGuardianField(field: FieldItem): boolean {
    const guardianType = getGuardianType();
    if (!guardianType) return false; // Hide all guardian fields until type is selected
    
    const ll = field.label.toLowerCase();
    
    // Relationship field only shows for "other"
    if (ll.includes("relationship")) {
      return guardianType === "other";
    }
    
    if (guardianType === "father") {
      return ll.includes("father");
    } else if (guardianType === "mother") {
      return ll.includes("mother");
    } else if (guardianType === "other") {
      return ll.includes("guardian") && !ll.includes("type");
    }
    
    return false;
  }

  // Build a lookup of location fields by grouping them via a shared label suffix
  // e.g. "Province (Permanent)", "District (Permanent)" share suffix "(Permanent)"
  function getLocationGroup(field: FieldItem): { role: "province" | "district" | "city" | "ward"; groupId: string; fields: Record<string, FieldItem> } | null {
    const ll = field.label.toLowerCase();
    const isProvince = ll.includes("province");
    const isDistrict = ll.includes("district");
    const isCity = ll.includes("city") || ll.includes("municipality");
    const isWard = ll.includes("ward");
    if (!isProvince && !isDistrict && !isCity && !isWard) return null;

    const role: "province" | "district" | "city" | "ward" = isProvince ? "province" : isDistrict ? "district" : isCity ? "city" : "ward";

    // Extract shared suffix like "(Permanent)" or "(Temporary)" to group related fields
    const suffixMatch = field.label.match(/\(([^)]+)\)\s*$/);
    const suffix = suffixMatch ? suffixMatch[1].toLowerCase() : "";

    // Find all fields that share the same suffix and are location fields
    const groupFields: Record<string, FieldItem> = {};
    for (const f of fields) {
      const fl = f.label.toLowerCase();
      const fSuffixMatch = f.label.match(/\(([^)]+)\)\s*$/);
      const fSuffix = fSuffixMatch ? fSuffixMatch[1].toLowerCase() : "";
      if (fSuffix !== suffix) continue;
      if (fl.includes("province")) groupFields.province = f;
      else if (fl.includes("district")) groupFields.district = f;
      else if (fl.includes("city") || fl.includes("municipality")) groupFields.city = f;
      else if (fl.includes("ward")) groupFields.ward = f;
    }

    return { role, groupId: suffix, fields: groupFields };
  }

  return (
    <div className="grid sm:grid-cols-2 gap-x-5 gap-y-5">
      {fields
        .slice()
        .sort((a, b) => a.order - b.order)
        .filter((field) => {
          // Filter out conditional guardian fields that shouldn't be shown
          if (isConditionalGuardianField(field)) {
            return shouldShowGuardianField(field);
          }
          return true;
        })
        .map((field) => {
          const value = formData[field.id];
          const group = getLocationGroup(field);

          // Check if this is a Guardian Type dropdown - add onChange to clear dependent fields
          const isGuardianTypeField = field.label.toLowerCase().includes("guardian") && field.label.toLowerCase().includes("type");
          
          if (isGuardianTypeField && field.fieldType === "dropdown") {
            return (
              <div key={field.id}>
                <Label field={field} />
                <select
                  value={value || ""}
                  onChange={(e) => {
                    const newType = e.target.value;
                    onUpdate(field.id, newType);
                    // Clear all guardian-related fields when type changes
                    fields.forEach((f) => {
                      if (isConditionalGuardianField(f)) {
                        onUpdate(f.id, "");
                      }
                    });
                  }}
                  required={field.required}
                  className={inputClass}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label || opt.value}
                    </option>
                  ))}
                </select>
                <HelpText text={field.helpText} />
              </div>
            );
          }

          // --- Nepal Province cascading select ---
          if (group?.role === "province") {
            return (
              <div key={field.id}>
                <Label field={field} />
                <select
                  value={value || ""}
                  onChange={(e) => {
                    const province = e.target.value;
                    onUpdate(field.id, province);
                    const districtField = group.fields.district;
                    if (districtField) onUpdate(districtField.id, "");
                  }}
                  required={field.required}
                  className={inputClass}
                >
                  <option value="">Select {field.label}</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <HelpText text={field.helpText} />
              </div>
            );
          }

          // --- Nepal District cascading select ---
          if (group?.role === "district") {
            const provinceField = group.fields.province;
            const selectedProvince = provinceField ? (formData[provinceField.id] as string | undefined) : undefined;
            const districts = districtsForProvince(selectedProvince);
            return (
              <div key={field.id}>
                <Label field={field} />
                <select
                  value={value || ""}
                  onChange={(e) => {
                    onUpdate(field.id, e.target.value);
                    if (e.target.value) {
                      const cityField = group.fields.city;
                      if (cityField) onUpdate(cityField.id, "");
                    }
                  }}
                  required={field.required}
                  disabled={!selectedProvince}
                  className={`${inputClass} ${!selectedProvince ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                >
                  <option value="">
                    {selectedProvince ? `Select ${field.label}` : "Select province first"}
                  </option>
                  {Array.isArray(districts) && districts.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <HelpText text={field.helpText} />
              </div>
            );
          }

          // --- Nepal Municipality cascading select ---
          if (group?.role === "city") {
            const provinceField = group.fields.province;
            const districtField = group.fields.district;
            const selectedProvince = provinceField ? (formData[provinceField.id] as string | undefined) : undefined;
            const selectedDistrict = districtField ? (formData[districtField.id] as string | undefined) : undefined;
            const municipalities = municipalitiesForDistrict(selectedProvince, selectedDistrict);
            return (
              <div key={field.id}>
                <Label field={field} />
                <select
                  value={value || ""}
                  onChange={(e) => {
                    onUpdate(field.id, e.target.value);
                    if (e.target.value) {
                      const wardField = group.fields.ward;
                      if (wardField) onUpdate(wardField.id, "");
                    }
                  }}
                  required={field.required}
                  disabled={!selectedDistrict}
                  className={`${inputClass} ${!selectedDistrict ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                >
                  <option value="">
                    {selectedDistrict ? `Select ${field.label}` : "Select district first"}
                  </option>
                  {Array.isArray(municipalities) && municipalities.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <HelpText text={field.helpText} />
              </div>
            );
          }

          // --- Nepal Ward cascading select ---
          if (group?.role === "ward") {
            const provinceField = group.fields.province;
            const districtField = group.fields.district;
            const cityField = group.fields.city;
            const selectedProvince = provinceField ? (formData[provinceField.id] as string | undefined) : undefined;
            const selectedDistrict = districtField ? (formData[districtField.id] as string | undefined) : undefined;
            const selectedMunicipality = cityField ? (formData[cityField.id] as string | undefined) : undefined;
            const wards = wardsForMunicipality(selectedProvince, selectedDistrict, selectedMunicipality);
            return (
              <div key={field.id}>
                <Label field={field} />
                <select
                  value={value || ""}
                  onChange={(e) => onUpdate(field.id, e.target.value)}
                  required={field.required}
                  disabled={!selectedMunicipality}
                  className={`${inputClass} ${!selectedMunicipality ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                >
                  <option value="">
                    {selectedMunicipality ? `Select ${field.label}` : "Select municipality first"}
                  </option>
                  {Array.isArray(wards) && wards.map((w, i) => (
                    <option key={`${w}-${i}`} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
                <HelpText text={field.helpText} />
              </div>
            );
          }

          // --- Text, Email, Phone, Number ---
          if (["text", "email", "phone", "number"].includes(field.fieldType)) {
            const isPhone = field.fieldType === "phone";
            const inputType = isPhone ? "tel" : field.fieldType;
            return (
              <div key={field.id} className={field.fieldType === "email" ? "sm:col-span-2" : ""}>
                <Label field={field} />
                <input
                  type={inputType}
                  value={value || ""}
                  onChange={(e) => {
                    let next = e.target.value;
                    if (isPhone) {
                      next = next.replace(/\D/g, "").slice(0, 10);
                    }
                    onUpdate(field.id, next);
                  }}
                  placeholder={field.placeholder}
                  required={field.required}
                  maxLength={isPhone ? 10 : undefined}
                  className={inputClass}
                />
                <HelpText text={field.helpText} />
              </div>
            );
          }

          // --- Textarea ---
          if (field.fieldType === "textarea") {
            return (
              <div key={field.id} className="sm:col-span-2">
                <Label field={field} />
                <textarea
                  value={value || ""}
                  onChange={(e) => onUpdate(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
                <HelpText text={field.helpText} />
              </div>
            );
          }

          // --- Date ---
          if (field.fieldType === "date") {
            return (
              <div key={field.id}>
                <Label field={field} />
                <input
                  type="date"
                  value={value || ""}
                  onChange={(e) => onUpdate(field.id, e.target.value)}
                  required={field.required}
                  className={inputClass}
                />
                <HelpText text={field.helpText} />
              </div>
            );
          }

          // --- Dropdown ---
          if (field.fieldType === "dropdown") {
            return (
              <div key={field.id}>
                <Label field={field} />
                <select
                  value={value || ""}
                  onChange={(e) => onUpdate(field.id, e.target.value)}
                  required={field.required}
                  className={inputClass}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label || opt.value}
                    </option>
                  ))}
                </select>
                <HelpText text={field.helpText} />
              </div>
            );
          }

          // --- Radio ---
          if (field.fieldType === "radio") {
            return (
              <div key={field.id}>
                <Label field={field} />
                <div className="flex flex-wrap gap-2.5">
                  {field.options?.map((opt) => {
                    const active = value === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${
                          active
                            ? "border-[#16285B] bg-[#f0f4ff]"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name={field.id}
                          value={opt.value}
                          checked={active}
                          onChange={(e) => onUpdate(field.id, e.target.value)}
                          className="sr-only"
                        />
                        <span
                          className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                            active ? "border-[#16285B]" : "border-gray-300"
                          }`}
                        >
                          {active && <span className="w-1.5 h-1.5 rounded-full bg-[#16285B]" />}
                        </span>
                        <span className={`text-sm font-medium ${active ? "text-gray-900" : "text-gray-700"}`}>
                          {opt.label || opt.value}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <HelpText text={field.helpText} />
              </div>
            );
          }

          // --- Checkbox ---
          if (field.fieldType === "checkbox") {
            // Single boolean checkbox (no options)
            if (!field.options || field.options.length === 0) {
              return (
                <div key={field.id} className="sm:col-span-2">
                  <label className="flex items-start gap-3 py-3.5 px-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-all">
                    <input
                      type="checkbox"
                      checked={!!value}
                      onChange={(e) => onUpdate(field.id, e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#51B747]"
                    />
                    <span className="text-sm font-medium text-gray-800 leading-snug">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </span>
                  </label>
                  <HelpText text={field.helpText} />
                </div>
              );
            }

            // Multiple choice checkboxes
            const values: string[] = Array.isArray(value) ? value : [];
            return (
              <div key={field.id} className="sm:col-span-2">
                <Label field={field} />
                <div className="flex flex-wrap gap-2.5">
                  {field.options?.map((opt) => {
                    const active = values.includes(opt.value);
                    return (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${
                          active
                            ? "border-[#16285B] bg-[#f0f4ff]"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={opt.value}
                          checked={active}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...values, opt.value]
                              : values.filter((v) => v !== opt.value);
                            onUpdate(field.id, next);
                          }}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">{opt.label || opt.value}</span>
                      </label>
                    );
                  })}
                </div>
                <HelpText text={field.helpText} />
              </div>
            );
          }

          // --- File / Image upload ---
          if (field.fieldType === "file" || field.fieldType === "image") {
            const current = uploaded[field.id];
            const currentUrl = current?.url || (typeof value === "string" ? value : "");
            const currentName = current?.name || (currentUrl ? currentUrl.split("/").pop() || "Uploaded file" : "");

            const handleCloudinaryUpload = (url: string, name: string) => {
              setUploaded((prev) => ({ ...prev, [field.id]: { url, name } }));
              onUpdate(field.id, url);
            };

            return (
              <div key={field.id} className="sm:col-span-2">
                <Label field={field} />
                <div className="space-y-3">
                  {field.fieldType === "image" ? (
                    <ImageUpload onUpload={(r) => handleCloudinaryUpload(r.secure_url, r.original_filename)} />
                  ) : (
                    <DocumentUpload onUpload={(r) => handleCloudinaryUpload(r.secure_url, r.original_filename)} />
                  )}
                  {currentUrl ? (
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
                      {field.fieldType === "image" ? (
                        <img src={currentUrl} alt={field.label} className="h-12 w-12 rounded object-cover" />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-400 shrink-0" />
                      )}
                      <a
                        href={currentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-[#16285B] truncate flex-1 min-w-0 hover:underline"
                      >
                        {currentName}
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setUploaded((prev) => {
                            const next = { ...prev };
                            delete next[field.id];
                            return next;
                          });
                          onUpdate(field.id, "");
                        }}
                        className="text-red-500 hover:text-red-700 text-lg leading-none px-1"
                        aria-label={`Remove ${field.label}`}
                      >
                        &times;
                      </button>
                    </div>
                  ) : null}
                </div>
                <HelpText text={field.helpText} />
              </div>
            );
          }

          // --- Fallback: safely renders any newly added / unknown field type ---
          return (
            <div key={field.id}>
              <Label field={field} />
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onUpdate(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={inputClass}
              />
              <HelpText text={field.helpText} />
            </div>
          );
        })}
    </div>
  );
}
