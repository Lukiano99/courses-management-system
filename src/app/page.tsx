import { HydrateClient } from "@/trpc/server";
import { UserButton } from "@clerk/nextjs";

export default async function Home() {
  return (
    <HydrateClient>
      <UserButton />
    </HydrateClient>
  );
}
