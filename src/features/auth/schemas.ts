import * as z from 'zod';

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const signUpSchema = z.object({
  name: z.string(),
  email: z.string()
    .email("Digite um e-mail válido"),
  password: z.string(),
  confirmPassword: z.string(),
}).superRefine((data, ctx) => {
  // Validações de senha
  if (data.password.length < 8) {
    ctx.addIssue({
      code: "custom",
      message: "A senha precisa ter no mínimo 8 caracteres",
      path: ["password"]
    });
  }
  
  if (!/[A-Z]/.test(data.password)) {
    ctx.addIssue({
      code: "custom",
      message: "A senha deve conter pelo menos uma letra maiúscula",
      path: ["password"]
    });
  }
  
  if (!/[a-z]/.test(data.password)) {
    ctx.addIssue({
      code: "custom",
      message: "A senha deve conter pelo menos uma letra minúscula",
      path: ["password"]
    });
  }
  
  if (!/[0-9]/.test(data.password)) {
    ctx.addIssue({
      code: "custom",
      message: "A senha deve conter pelo menos um número",
      path: ["password"]
    });
  }
  
  if (!/[^A-Za-z0-9]/.test(data.password)) {
    ctx.addIssue({
      code: "custom",
      message: "A senha deve conter pelo menos um caractere especial",
      path: ["password"]
    });
  }
  
  // Validação de confirmação de senha
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "As senhas não coincidem",
      path: ["confirmPassword"]
    });
  }
});