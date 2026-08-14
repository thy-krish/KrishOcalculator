import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { clearCalculationHistory, insertCalculationHistory, listCalculationHistory } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  history: router({
    list: protectedProcedure.query(({ ctx }) => listCalculationHistory(ctx.user.id)),
    add: protectedProcedure.input(z.object({
      expression: z.string().min(1).max(512),
      result: z.string().min(1).max(256),
      calculatedAt: z.string().datetime().optional(),
    })).mutation(({ ctx, input }) => insertCalculationHistory({
      userId: ctx.user.id,
      expression: input.expression,
      result: input.result,
      calculatedAt: input.calculatedAt ? new Date(input.calculatedAt) : new Date(),
    }).then(() => ({ success: true as const }))),
    clear: protectedProcedure.mutation(({ ctx }) => clearCalculationHistory(ctx.user.id).then(() => ({ success: true as const }))),
  }),
});

export type AppRouter = typeof appRouter;
