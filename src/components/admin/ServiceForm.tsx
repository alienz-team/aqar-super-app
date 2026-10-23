"use client";

import { useTransition } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { createService } from "@/app/admin/actions";
import { buttonStyles, inputStyles } from "@/components/ui/primitives";
import en from "@/dictionaries/en.json";
import { SERVICE_CATEGORIES, serviceSchema, type ServiceInput } from "@/lib/admin/schemas";
import { cn } from "@/lib/utils";
import { FormField, FormRootError, SESSION_ENDED } from "./form-parts";

type Output = z.output<typeof serviceSchema>;

const defaults: Partial<ServiceInput> = {
  nameEn: "",
  nameAr: "",
  description: "",
  category: "CONSTRUCTION_SKELETON",
  bookingMode: "QUOTE",
  isActive: true,
};

const MAINTENANCE = new Set(["MAINTENANCE_PLUMBING", "MAINTENANCE_ELECTRICAL", "MAINTENANCE_AC", "MAINTENANCE_POOL"]);

export function ServiceForm({ onSaved }: { onSaved: () => void }) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<ServiceInput, unknown, Output>({ resolver: zodResolver(serviceSchema), defaultValues: defaults });

  function onSubmit(values: Output) {
    startTransition(async () => {
      let result;
      try {
        result = await createService(values);
      } catch {
        // The action throws when the session has expired or was never valid.
        setError("root", { message: SESSION_ENDED });
        return;
      }
      if (result.ok) {
        reset(defaults);
        onSaved();
        return;
      }
      for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
        setError(field as FieldPath<ServiceInput>, { message: messages[0] });
      }
      setError("root", { message: result.error });
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Name (English)" error={errors.nameEn?.message}>
          <input {...register("nameEn")} className={inputStyles} placeholder="AC maintenance" />
        </FormField>
        <FormField label="Name (Arabic)" error={errors.nameAr?.message}>
          <input {...register("nameAr")} dir="rtl" lang="ar" className={inputStyles} placeholder="صيانة المكيفات" />
        </FormField>
      </div>

      <FormField label="Description" error={errors.description?.message}>
        <textarea {...register("description")} rows={3} className={cn(inputStyles, "resize-y")} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Category" error={errors.category?.message}>
          <select
            {...register("category", {
              // Maintenance trades default to direct technician booking; the rest collect quotes.
              onChange: (e) => setValue("bookingMode", MAINTENANCE.has(e.target.value) ? "TECHNICIAN" : "QUOTE"),
            })}
            className={inputStyles}
          >
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {en.services.categories[c]}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Starting price (LYD)" error={errors.startingPrice?.message}>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            {...register("startingPrice", { valueAsNumber: true })}
            className={cn(inputStyles, "tabular")}
          />
        </FormField>
        <FormField label="How clients book" error={errors.bookingMode?.message}>
          <select {...register("bookingMode")} className={inputStyles}>
            <option value="QUOTE">Request a quote</option>
            <option value="TECHNICIAN">Book a technician</option>
          </select>
        </FormField>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" {...register("isActive")} className="size-4 accent-[#D4AF37]" />
        Visible to clients
      </label>

      <FormRootError message={errors.root?.message} />

      <div className="flex justify-end gap-3 border-t border-line pt-5">
        <button type="submit" disabled={pending} className={cn(buttonStyles.primary, "px-6")}>
          {pending ? "Saving…" : "Save service"}
        </button>
      </div>
    </form>
  );
}
