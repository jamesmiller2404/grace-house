import Nav from "@/components/Nav";
import { missionPage } from "@/content/mission";

export const metadata = {
  title: "Mission — Grace House",
};

export default function MissionPage() {
  const { missionHeading, missionStatement, whyHeading, whyBody } = missionPage;
  return (
    <>
      <Nav />
      <main className="bg-cream px-6 py-14">
        <div className="mx-auto max-w-6xl">
          {/* Mission */}
          <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
          <h1 className="font-heading text-ink text-5xl">{missionHeading}</h1>
          <p className="whitespace-pre-line mt-4 max-w-[60ch] text-lg leading-relaxed">
            {missionStatement}
          </p>

          {/* Why Grace House */}
          <div className="bg-gold mt-12 mb-4 h-[4px] w-28 rounded-full" />
          <h2 className="font-heading text-ink text-5xl">{whyHeading}</h2>
          <p className="whitespace-pre-line mt-4 max-w-[60ch] text-lg leading-relaxed">
            {whyBody}
          </p>
        </div>
      </main>
    </>
  );
}
