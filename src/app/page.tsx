import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="bg-muted">test</div>
    </HydrateClient>
  );
}
