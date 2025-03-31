import { z } from "zod";

// UPI ID Format: [localpart]@[handle]
// - localpart: alphanumeric string that may include periods (.)
// - handle: payment service provider (ybl, okicici, okaxis, etc.)
const upiIdRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;

export const CreateGreetingSchema = z.object({
  recipientName: z
    .string()
    .min(1, "Recipient name is required")
    .max(50, "Name should be less than 50 characters"),
  message: z
    .string()
    .min(5, "Message should be at least 5 characters")
    .max(200, "Message should be less than 200 characters"),
  amount1: z
    .number()
    .min(1, "Amount must be at least 1")
    .max(10000, "Amount must be less than 10,000"),
  amount2: z
    .number()
    .min(1, "Amount must be at least 1")
    .max(10000, "Amount must be less than 10,000"),
  amount3: z
    .number()
    .min(1, "Amount must be at least 1")
    .max(10000, "Amount must be less than 10,000"),
  amount4: z
    .number()
    .min(1, "Amount must be at least 1")
    .max(10000, "Amount must be less than 10,000"),
  amount5: z
    .number()
    .min(1, "Amount must be at least 1")
    .max(10000, "Amount must be less than 10,000"),
  amount6: z
    .number()
    .min(1, "Amount must be at least 1")
    .max(10000, "Amount must be less than 10,000"),
  upiId: z
    .string()
    .regex(upiIdRegex, "Invalid UPI ID format. Example: yourname@ybl")
    .optional(),
  enableUpiPayment: z
    .boolean()
    .default(false)
});

export type CreateGreetingFormData = z.infer<typeof CreateGreetingSchema>; 