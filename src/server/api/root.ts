import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { courseRouter } from "./routers/course";
import { categoryRouter } from "./routers/category";
import { chapterRouter } from "./routers/chapter";
import { userProgressRouter } from "./routers/user-pgoress";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  course: courseRouter,
  category: categoryRouter,
  chapter: chapterRouter,
  userProgress: userProgressRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
