import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z.string("Nome inválido").min(3),
    email: z.email("Email inválido"),
    password: z.string("Senha inválida").min(6),
    confirmPassword: z.string("Confirmação de senha inválida"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>
