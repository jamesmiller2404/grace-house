import Image from "next/image";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getBoardPage } from "@/payload/queries";

export async function generateMetadata() {
  const board = await getBoardPage();
  return {
    title: `${board.title} — Grace House`,
  };
}

export default async function BoardPage() {
  const board = await getBoardPage();

  return (
    <main className="flex-1 bg-cream px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <nav
          aria-label="Breadcrumb"
          className="text-terra pb-1 text-base font-bold"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="underline-offset-4 hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-ink/60 font-normal">›</li>
            <li aria-current="page">{board.title}</li>
          </ol>
        </nav>

        <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
        <h1 className="font-heading text-ink text-5xl">{board.title}</h1>

        {Boolean(board.intro) && (
          <div className="gh-board-intro text-ink/80 mt-4 max-w-[70ch] text-lg leading-relaxed [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-4 [&_p]:mt-4 [&_p:first-child]:mt-0">
            <RichText data={board.intro as never} />
          </div>
        )}

        {board.members.length > 0 && (
          <section
            aria-label="Board members"
            className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {board.members.map((member, index) => (
              <article
                key={member.id ?? `${member.name}-${index}`}
                className="border-ink/10 bg-white/50 overflow-hidden rounded-xl border shadow-sm"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink/5">
                  {member.image ? (
                    <Image
                      src={member.image.url}
                      alt={member.image.alt || member.name}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-ink/50 flex h-full items-center justify-center text-sm">
                      Profile picture unavailable
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="font-heading text-ink text-2xl">
                    {member.name}
                  </h2>
                  <p className="text-terra mt-1 text-base font-semibold">
                    {member.role}
                  </p>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
