import { initTRPC } from "@trpc/server";

//CONFIGURACAO tRPC 
const tRPC = initTRPC.create();

//agrupa endpoints
export const router = tRPC.router;
// de onde sai a definição do endpoint
export const publicProcedure = tRPC.procedure;
//funcao que chama os endpoints direto no servidor, sem HTTP
export const createCallerFactory = tRPC.createCallerFactory;
