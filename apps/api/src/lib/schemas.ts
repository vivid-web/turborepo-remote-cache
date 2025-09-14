import { z } from "zod";

export const HashSchema = z.string();

export const SlugSchema = z.string().optional();

export const TeamIdSchema = z.string().optional();
