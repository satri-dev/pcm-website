"use client";

import { useEffect } from "react";
import {
  Control,
  UseFormRegister,
  useForm,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { NavMenuItem } from "@/types/nav-menu";
import { Save, X, Plus, Trash2 } from "lucide-react";

const linkItemSchema = z.object({
  label: z.string().trim().min(1, "Link label is required").max(200),
  href: z.string().trim().min(1, "Link URL is required").max(500),
});

const columnSchema = z.object({
  label: z.string().trim().min(1, "Column label is required").max(200),
  links: z.array(linkItemSchema),
});

const navMenuSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(100),
  type: z.enum(["link", "dropdown", "mega"]),
  href: z.string().trim().max(500),
  order: z.number().int().min(0),
  active: z.boolean(),
  children: z.array(linkItemSchema),
  columns: z.array(columnSchema),
});

type NavMenuFormData = z.infer<typeof navMenuSchema>;

interface NavMenuFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: NavMenuItem | null;
  onSave: (item: NavMenuItem) => void;
  saving?: boolean;
}

function ColumnLinks({
  control,
  register,
  columnIndex,
  linkErrors,
}: {
  control: Control<NavMenuFormData>;
  register: UseFormRegister<NavMenuFormData>;
  columnIndex: number;
  linkErrors?: { label?: { message?: string }; href?: { message?: string } };
}) {
  const links = useFieldArray({
    control,
    name: `columns.${columnIndex}.links`,
  });

  return (
    <div className="nested-links">
      {links.fields.map((link, linkIdx) => (
        <div key={link.id} className="flex gap-2 items-start flex-wrap">
          <div className="flex-1 min-w-[140px]">
            <input
              type="text"
              placeholder="Link label"
              {...register(`columns.${columnIndex}.links.${linkIdx}.label`)}
            />
            {linkErrors?.label && (
              <div className="field__err">{linkErrors.label.message}</div>
            )}
          </div>
          <div className="flex-1 min-w-[160px]">
            <input
              type="text"
              placeholder="/path or https://…"
              {...register(`columns.${columnIndex}.links.${linkIdx}.href`)}
            />
            {linkErrors?.href && (
              <div className="field__err">{linkErrors.href.message}</div>
            )}
          </div>
          <button
            type="button"
            className="act-btn danger mt-1"
            title="Remove link"
            onClick={() => links.remove(linkIdx)}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="admin-btn admin-btn--sm admin-btn--ghost mt-1"
        onClick={() => links.append({ label: "", href: "" })}
      >
        <Plus size={13} />
        Add Link
      </button>
    </div>
  );
}

export default function NavMenuFormModal({
  open,
  onOpenChange,
  item,
  onSave,
  saving = false,
}: NavMenuFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<NavMenuFormData>({
    resolver: zodResolver(navMenuSchema),
    defaultValues: {
      label: "",
      type: "link",
      href: "",
      order: 10,
      active: true,
      children: [],
      columns: [],
    },
  });

  const type = useWatch({ control, name: "type" });

  const childrenFields = useFieldArray({ control, name: "children" });
  const columnFields = useFieldArray({ control, name: "columns" });

  useEffect(() => {
    if (item) {
      reset({
        label: item.label,
        type: item.type,
        href: item.href || "",
        order: item.order,
        active: item.active,
        children: item.children ?? [],
        columns: item.columns ?? [],
      });
    } else {
      reset({
        label: "",
        type: "link",
        href: "",
        order: 10,
        active: true,
        children: [],
        columns: [],
      });
    }
  }, [item, reset, open]);

  const onSubmit = async (data: NavMenuFormData) => {
    await onSave({
      id: item?.id || "",
      label: data.label,
      type: data.type,
      href: data.type === "mega" ? undefined : data.href || undefined,
      order: data.order,
      active: data.active,
      children: data.children ?? [],
      columns: data.columns ?? [],
      createdAt: item?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const fieldValue = (key: keyof NavMenuFormData) =>
    errors[key] ? "field is-invalid" : "field";

  const childrenErrors = errors.children as unknown as
    | { [k: number]: { label?: { message?: string }; href?: { message?: string } } }
    | undefined;
  const columnsErrors = errors.columns as unknown as
    | {
        [k: number]: {
          label?: { message?: string };
          links?: {
            [k: number]: { label?: { message?: string }; href?: { message?: string } };
          };
        };
      }
    | undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="nav-menu-modal w-[min(100%,720px)] sm:max-w-[720px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        {/* Head */}
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">
            {item ? "Edit Navbar Item" : "Add Navbar Item"}
          </DialogTitle>
          <button
            type="button"
            className="admin-icon-btn"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Body */}
          <div className="modal__body">
            <div className="form-grid">
              <div className="form-section">
                <b>Details</b>
              </div>

              <div className={fieldValue("label")}>
                <label htmlFor="nav-label">
                  Label <span className="req">*</span>
                </label>
                <input
                  id="nav-label"
                  type="text"
                  {...register("label")}
                  placeholder="e.g. About"
                />
                {errors.label && (
                  <div className="field__err">{errors.label.message}</div>
                )}
              </div>

              <div className={fieldValue("type")}>
                <label htmlFor="nav-type">
                  Type <span className="req">*</span>
                </label>
                <select id="nav-type" {...register("type")}>
                  <option value="link">Link</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="mega">Mega Menu</option>
                </select>
                {errors.type && (
                  <div className="field__err">{errors.type.message}</div>
                )}
              </div>

              {type !== "mega" && (
                <div className={fieldValue("href")}>
                  <label htmlFor="nav-href">URL</label>
                  <input
                    id="nav-href"
                    type="text"
                    {...register("href")}
                    placeholder="/about or https://…"
                  />
                  {errors.href && (
                    <div className="field__err">{errors.href.message}</div>
                  )}
                </div>
              )}

              <div className={fieldValue("order")}>
                <label htmlFor="nav-order">Order</label>
                <input
                  id="nav-order"
                  type="number"
                  min={0}
                  {...register("order", { valueAsNumber: true })}
                />
                {errors.order && (
                  <div className="field__err">{errors.order.message}</div>
                )}
              </div>

              <div className="field">
                <label>Visible on site</label>
                <label className="switch">
                  <input type="checkbox" {...register("active")} />
                  <span className="track"></span>
                </label>
              </div>

              {type === "dropdown" && (
                <>
                  <div className="form-section">
                    <b>Dropdown Links</b>
                  </div>
                  <div className="field field--full">
                    {childrenFields.fields.length === 0 && (
                      <p className="hint">
                        No links yet — add the items shown inside the dropdown.
                      </p>
                    )}
                    <div className="nested-links">
                      {childrenFields.fields.map((field, i) => (
                        <div key={field.id} className="flex gap-2 items-start flex-wrap">
                          <div className="flex-1 min-w-[140px]">
                            <input
                              type="text"
                              placeholder="Link label"
                              {...register(`children.${i}.label`)}
                            />
                            {childrenErrors?.[i]?.label && (
                              <div className="field__err">
                                {childrenErrors[i].label!.message}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-[160px]">
                            <input
                              type="text"
                              placeholder="/path or https://…"
                              {...register(`children.${i}.href`)}
                            />
                            {childrenErrors?.[i]?.href && (
                              <div className="field__err">
                                {childrenErrors[i].href!.message}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            className="act-btn danger mt-1"
                            title="Remove link"
                            onClick={() => childrenFields.remove(i)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="admin-btn admin-btn--sm admin-btn--ghost mt-2"
                      onClick={() => childrenFields.append({ label: "", href: "" })}
                    >
                      <Plus size={13} />
                      Add Link
                    </button>
                  </div>
                </>
              )}

              {type === "mega" && (
                <>
                  <div className="form-section">
                    <b>Mega Menu Columns</b>
                  </div>
                  {columnFields.fields.length === 0 && (
                    <div className="field field--full">
                      <p className="hint">
                        No columns yet — add column headings with their links.
                      </p>
                    </div>
                  )}
                  {columnFields.fields.map((field, i) => (
                    <div key={field.id} className="field field--full">
                      <label htmlFor={`nav-col-${i}`}>Column {i + 1}</label>
                      <div className="flex gap-2 items-start">
                        <input
                          id={`nav-col-${i}`}
                          type="text"
                          placeholder="Column heading, e.g. Community"
                          {...register(`columns.${i}.label`)}
                        />
                        <button
                          type="button"
                          className="act-btn danger mt-1 shrink-0"
                          title="Remove column"
                          onClick={() => columnFields.remove(i)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      {columnsErrors?.[i]?.label && (
                        <div className="field__err">
                          {columnsErrors[i].label!.message}
                        </div>
                      )}
                      <ColumnLinks
                        control={control}
                        register={register}
                        columnIndex={i}
                        linkErrors={columnsErrors?.[i]?.links?.[0]}
                      />
                    </div>
                  ))}
                  <div className="field field--full">
                    <button
                      type="button"
                      className="admin-btn admin-btn--sm admin-btn--ghost"
                      onClick={() =>
                        columnFields.append({ label: "", links: [] })
                      }
                    >
                      <Plus size={13} />
                      Add Column
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="modal__foot">
            <button
              type="button"
              className="admin-btn"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={saving}
            >
              <Save size={16} />
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}