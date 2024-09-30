import { env } from "@/env";

export const isTeacher = (userId?: string | null) => {
  return userId === env.NEXT_PUBLIC_TEACHER_ID;
};
