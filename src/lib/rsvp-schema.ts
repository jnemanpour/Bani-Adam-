import { z } from "zod";
import { VOLUNTEER_ROLES } from "@/config/event";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));

export const rsvpSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name").max(100),
    phone: z
      .string()
      .trim()
      .max(30)
      .refine((v) => v.replace(/\D/g, "").length >= 10, "Please enter a phone number with area code"),
    email: z.string().trim().toLowerCase().email("Please enter a valid email").max(200),
    attending: z.enum(["yes", "maybe", "no"], { message: "Let us know if you're coming" }),
    adults: z.coerce.number().int().min(0).max(6).default(1),
    kids: z.coerce.number().int().min(0).max(6).default(0),
    kids_ages: optionalText(200),
    dietary: optionalText(300),
    volunteer: z.array(z.enum(VOLUNTEER_ROLES)).max(VOLUNTEER_ROLES.length).default([]),
    note: optionalText(1000),
    // Honeypot: real people never see or fill this.
    website: z.string().max(0).optional(),
  })
  .superRefine((v, ctx) => {
    if (v.attending !== "no" && v.adults < 1) {
      ctx.addIssue({ code: "custom", path: ["adults"], message: "At least 1 adult (you!)" });
    }
  })
  .transform((v) =>
    v.attending === "no" ? { ...v, adults: 0, kids: 0, kids_ages: null, volunteer: [] } : v,
  );

export type RsvpInput = z.infer<typeof rsvpSchema>;
