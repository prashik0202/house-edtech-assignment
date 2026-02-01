import { z } from 'zod';

export const UserSchema = z.object({
  name: z.string().min(1, {error : "Please enter your name"}).max(30, { error : "your name is too long"}),
  email: z.email().nonoptional(),
  password: z.string().min(5, { error: "Must be atleast 5 characters"}),
});

export const LoginSchema = UserSchema.omit({
  name: true
});

export const RegisterSchema = UserSchema;

export type UserSchemaType = z.infer<typeof UserSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

