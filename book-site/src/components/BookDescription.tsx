import Image from "next/image";
import BuyButton from "./BuyButton";

// Full book description paragraphs
const paragraphs = [
  "Stina tycker att vuxna är lite tråkiga ibland. De bara jobbar, handlar och städar.",
  "Själv tycker Stina att livet borde handla mer om att leka och ha roligt. Men en dag visar mamma att städning faktiskt kan vara något helt annat än ett tråkigt måste. Med musik i högtalaren, dans i köket och lite hjälp från Stina förvandlas vardagssysslorna till något lekfullt.",
  "Stina och mamma städar är en varm och igenkännbar bilderbok om vardagslivet i en familj – om samarbete, skratt och om hur vardagspusslet kan bli något fint när man gör det tillsammans.",
];

// [REPLACE] Update the author section with real author information and photo
const author = {
  name: "Cecilia Strandevall",
  bio: "Cecilia Strandevall är författaren bakom Stina och mamma städar. Med ett varmt berättarhjärta och blick för det lilla i vardagen skapar hon böcker som berör och engagerar hela familjen.",
  // [REPLACE] Add real author photo at /author-photo.jpg
  photo: null as string | null,
};

export default function BookDescription() {
  return (
    <section id="om-boken" className="bg-sand/40 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Text side */}
          <div className="flex flex-col justify-center">
            <span className="mb-3 text-xs font-semibold uppercase tracking-widest text-sage-dark">
              Om boken
            </span>
            <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
              En berättelse om glädje i vardagen
            </h2>

            <div className="mt-6 space-y-4">
              {paragraphs.map((para, i) => (
                <p key={i} className="leading-relaxed text-ink-muted">
                  {para}
                </p>
              ))}
            </div>

            {/* Book details */}
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-8 text-sm">
              <div>
                <dt className="font-semibold text-ink">Format</dt>
                {/* [REPLACE] Update with real book format */}
                <dd className="mt-0.5 text-ink-muted">Bilderbok, inbunden</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Ålder</dt>
                {/* [REPLACE] Update with target age range */}
                <dd className="mt-0.5 text-ink-muted">3–7 år</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Antal sidor</dt>
                {/* [REPLACE] Update with real page count */}
                <dd className="mt-0.5 text-ink-muted">[SIDANTAL]</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Språk</dt>
                <dd className="mt-0.5 text-ink-muted">Svenska</dd>
              </div>
            </dl>

            <div className="mt-10">
              <BuyButton />
            </div>
          </div>

          {/* Author side */}
          <div className="flex flex-col gap-8">
            {/* Decorative book preview card */}
            <div className="overflow-hidden rounded-2xl bg-forest p-8 text-center shadow-xl">
              <div className="mx-auto w-fit overflow-hidden rounded-xl shadow-lg">
                {/*
                  [REPLACE] Replace with your real book cover.
                  Path: /book-cover.jpg (or .png/.svg)
                */}
                <Image
                  src="/book-cover.svg"
                  alt="Stina och mamma städar – bokomslag"
                  width={200}
                  height={280}
                  className="block"
                />
              </div>
              <p className="mt-4 text-sm font-medium text-white/60">
                Stina och mamma städar
              </p>
            </div>

            {/* Author card */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-muted">
                Om författaren
              </p>
              <div className="flex items-start gap-4">
                {author.photo ? (
                  <Image
                    src={author.photo}
                    alt={author.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 flex-shrink-0 rounded-full object-cover"
                  />
                ) : (
                  // [REPLACE] This placeholder disappears once you set author.photo above
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-sage-light text-2xl">
                    ✍️
                  </div>
                )}
                <div>
                  <p className="font-bold text-ink">{author.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                    {author.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
