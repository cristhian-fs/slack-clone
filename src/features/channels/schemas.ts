import * as z from "zod";

export const createChannelSchema = z.object({
  name: z.string().min(3).max(80).transform((val) =>
    val
      .toLowerCase()
      .normalize("NFD") // remove acentos
      .replace(/[\u0300-\u036f]/g, "") // remove acentos restantes
      .replace(/\s+/g, "-") // espaços viram hífen
      .replace(/[^a-z0-9\-]/g, "") // remove caracteres especiais
      .replace(/\-\-+/g, "-") // evita hífens duplicados
      .replace(/^-+|-+$/g, "") // remove hífens das pontas
  )
})