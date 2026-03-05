import { z } from "zod";

export const addressFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  phoneCountryCode: z.string().min(1, "Country code is required"),
  zipCode: z.string().min(1, "Pincode is required"),
  addressLine1: z.string().min(1, "Address is required"),
  street: z.string().min(1, "Street / locality is required"),
  city: z.string().min(1, "City is required"),
  landmark: z.string().optional(),
  countryId: z.string().min(1, "Country is required"),
  stateId: z.string().min(1, "State is required"),
  addressType: z.enum(["home", "work", "other"]),
  isDefault: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;

