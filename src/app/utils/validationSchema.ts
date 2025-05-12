import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2).max(200),
  price: z.number(),
  quantity: z.number(),
  description: z.string(),
  image: z.string().optional(),
  categoryId: z.number(),
});

export const productSchemaUpdate = z.object({
  name: z.string().min(2).max(200).optional(),
  price: z.number().optional(),
  quantity: z.number().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  categoryId: z.number().optional(),
});

export const registerSchema = z.object({
  username: z.string().min(2).max(200),
  email: z.string().min(3).max(200).email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().min(3).max(200).email(),
  password: z.string().min(6),
});

export const updateUserSchema = z.object({
  email: z.string().min(3).max(200).email().optional(),
  password: z.string().min(6).optional(),
  username: z.string().min(2).max(200).optional(),
});
