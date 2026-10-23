"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Link2, X } from "lucide-react";
import type { z } from "zod";
import { createProperty } from "@/app/admin/actions";
import { buttonStyles, inputStyles } from "@/components/ui/primitives";
import en from "@/dictionaries/en.json";
import { CITY_NAMES, MAX_IMAGES, propertySchema, type PropertyInput } from "@/lib/admin/schemas";
import { CATEGORIES, RENT_CYCLES } from "@/lib/property-filters";
import { cn } from "@/lib/utils";
import { ErrorText, FormField, FormRootError, SESSION_ENDED } from "./form-parts";

type Output = z.output<typeof propertySchema>;

const defaults: Partial<PropertyInput> = {
  title: "",
  description: "",
  listingType: "SALE",
  rentCycle: "NONE",
  category: "VILLA",
  city: "Tripoli",
  isVip: false,
  images: [],
};

interface LocalUpload {
  name: string;
  url: string;
}

export function PropertyForm({ onSaved }: { onSaved: () => void }) {
  const [pending, startTransition] = useTransition();
  const [imageLink, setImageLink] = useState("");
  const [uploads, setUploads] = useState<LocalUpload[]>([]);
  const uploadsRef = useRef(uploads);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<PropertyInput, unknown, Output>({ resolver: zodResolver(propertySchema), defaultValues: defaults });

  const listingType = watch("listingType");
  const images = watch("images") ?? [];

  // Object URLs hold the file in memory until revoked; the ref lets the unmount cleanup see the latest list.
  useEffect(() => {
    uploadsRef.current = uploads;
  }, [uploads]);
  useEffect(() => () => uploadsRef.current.forEach((u) => URL.revokeObjectURL(u.url)), []);

  function addImageLink() {
    const link = imageLink.trim();
    if (!link || images.includes(link) || images.length >= MAX_IMAGES) return;
    setValue("images", [...images, link], { shouldValidate: true });
    setImageLink("");
  }

  function addUploads(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
    setUploads((u) => [...u, ...next]);
  }

  function removeUpload(url: string) {
    URL.revokeObjectURL(url);
    setUploads((u) => u.filter((x) => x.url !== url));
  }

  function onSubmit(values: Output) {
    startTransition(async () => {
      let result;
      try {
        result = await createProperty(values);
      } catch {
        // The action throws when the session has expired or was never valid.
        setError("root", { message: SESSION_ENDED });
        return;
      }
      if (result.ok) {
        uploads.forEach((u) => URL.revokeObjectURL(u.url));
        setUploads([]);
        reset(defaults);
        onSaved();
        return;
      }
      for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
        setError(field as FieldPath<PropertyInput>, { message: messages[0] });
      }
      setError("root", { message: result.error });
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <FormField label="Title" error={errors.title?.message}>
        <input {...register("title")} className={inputStyles} placeholder="Corner villa with private pool, Hay Al Andalus" />
      </FormField>

      <FormField label="Description" error={errors.description?.message}>
        <textarea {...register("description")} rows={4} className={cn(inputStyles, "resize-y")} />
      </FormField>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-medium text-muted">Listing type</legend>
        <div className="inline-flex rounded-sm border border-line bg-bg p-1">
          {(["SALE", "RENT"] as const).map((type) => (
            <label
              key={type}
              className={cn(
                "cursor-pointer rounded-xs px-4 py-1.5 text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold",
                listingType === type ? "bg-brand text-brand-ink" : "text-muted hover:text-ink",
              )}
            >
              <input
                type="radio"
                value={type}
                {...register("listingType", {
                  onChange: (e) => setValue("rentCycle", e.target.value === "SALE" ? "NONE" : "MONTHLY"),
                })}
                className="sr-only"
              />
              {en.listingTypes[type]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Category" error={errors.category?.message}>
          <select {...register("category")} className={inputStyles}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {en.categories[c]}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="City" error={errors.city?.message}>
          <select {...register("city")} className={inputStyles}>
            {CITY_NAMES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Price (LYD)" error={errors.price?.message}>
          <input type="number" inputMode="decimal" min={0} step="any" {...register("price", { valueAsNumber: true })} className={cn(inputStyles, "tabular")} />
        </FormField>
        <FormField label="Area (m²)" error={errors.areaSqm?.message}>
          <input type="number" inputMode="decimal" min={0} step="any" {...register("areaSqm", { valueAsNumber: true })} className={cn(inputStyles, "tabular")} />
        </FormField>
        {listingType === "RENT" && (
          <FormField label="Rent period" error={errors.rentCycle?.message}>
            <select {...register("rentCycle")} className={inputStyles}>
              {RENT_CYCLES.map((c) => (
                <option key={c} value={c}>
                  {en.rentCycles[c]}
                </option>
              ))}
            </select>
          </FormField>
        )}
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" {...register("isVip")} className="size-4 accent-[#D4AF37]" />
        Feature as a VIP listing
      </label>

      <fieldset className="space-y-3">
        <legend className="mb-1.5 block text-sm font-medium text-muted">Images</legend>

        <div className="flex gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Image link</span>
            <Link2 className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              type="url"
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImageLink();
                }
              }}
              placeholder="https://images.unsplash.com/photo-…"
              className={cn(inputStyles, "ps-9")}
            />
          </label>
          <button type="button" onClick={addImageLink} disabled={images.length >= MAX_IMAGES} className={buttonStyles.secondary}>
            Add link
          </button>
        </div>
        <ErrorText
          message={errors.images?.message ?? (Array.isArray(errors.images) ? errors.images.find(Boolean)?.message : undefined)}
        />

        {/* Mock upload: previews stay in this browser until Supabase Storage is connected. */}
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-sm border border-dashed border-line px-4 py-6 text-center text-sm text-muted transition-colors hover:border-gold has-[:focus-visible]:border-gold">
          <ImagePlus className="size-6" aria-hidden />
          <span className="font-medium text-ink">Upload photos</span>
          <span className="text-xs">Preview only: files are not uploaded until storage is connected. Saved images come from the links above.</span>
          <input type="file" accept="image/*" multiple onChange={(e) => addUploads(e.target.files)} className="sr-only" />
        </label>

        {(images.length > 0 || uploads.length > 0) && (
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {images.map((src) => (
              <Thumb key={src} src={src} label="Saved link" onRemove={() => setValue("images", images.filter((i) => i !== src), { shouldValidate: true })} />
            ))}
            {uploads.map((u) => (
              <Thumb key={u.url} src={u.url} label="Preview only" onRemove={() => removeUpload(u.url)} />
            ))}
          </ul>
        )}
      </fieldset>

      <FormRootError message={errors.root?.message} />

      <div className="flex justify-end gap-3 border-t border-line pt-5">
        <button type="submit" disabled={pending} className={cn(buttonStyles.primary, "px-6")}>
          {pending ? "Saving…" : "Save property"}
        </button>
      </div>
    </form>
  );
}

function Thumb({ src, label, onRemove }: { src: string; label: string; onRemove: () => void }) {
  return (
    <li className="relative overflow-hidden rounded-sm border border-line">
      {/* Arbitrary hosts: next/image would need each one allow-listed. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="aspect-square w-full object-cover" referrerPolicy="no-referrer" />
      <span className="absolute inset-x-0 bottom-0 bg-black/60 px-1.5 py-0.5 text-[10px] text-white">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove image (${label})`}
        className="absolute end-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
      >
        <X className="size-3" />
      </button>
    </li>
  );
}
