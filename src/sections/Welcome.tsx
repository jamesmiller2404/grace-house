export type WelcomeProps = {
  heading: string;
  body: string;
  pullQuote?: string;
};

export default function Welcome({ heading, body, pullQuote }: WelcomeProps) {
  return (
    <section id="welcome" className="bg-cream px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
        <h2 className="font-heading text-anchor text-5xl">{heading}</h2>
        <p className="mt-4 max-w-[60ch] text-lg leading-relaxed">{body}</p>
        {pullQuote && (
          <blockquote className="border-gold mt-8 ml-10 flex max-w-xl items-center gap-3 border-l-[3px] pl-4">
            <p className="text-anchor text-lg font-semibold italic">
              {pullQuote}
            </p>
          </blockquote>
        )}
      </div>
    </section>
  );
}
