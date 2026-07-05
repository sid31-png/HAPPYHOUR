import { formatMinutesRemaining } from "@happyhour/ui";

const liveVenues = [
  { name: "Sundown Rooftop", offer: "-50% cocktails", minutes: 42 },
  { name: "The Pearl Terrace", offer: "2 pour 1 mocktails", minutes: 18 },
];

/**
 * Illustrative, non-photographic mock of the Explorer screen: a phone
 * silhouette in 3D perspective, built entirely from glass panels and
 * gradients (no external screenshot asset).
 */
export function PhoneMockup() {
  return (
    <div className="[perspective:1400px]">
      <div
        className="relative w-[260px] rotate-[-1deg] rounded-[40px] border border-textDark/20 bg-textLight/90 p-3 shadow-2xl transition-transform duration-700 ease-golden dark:bg-black/60 sm:w-[300px] [transform:rotateY(-16deg)_rotateX(6deg)] motion-reduce:[transform:none]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute left-1/2 top-3 h-1.5 w-14 -translate-x-1/2 rounded-pill bg-textDark/40" />

        <div className="relative overflow-hidden rounded-[30px] bg-sky-light dark:bg-sky-dark">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,theme(colors.textDark/85%),theme(colors.amberLight/50%)_32%,transparent_72%)] dark:bg-[radial-gradient(circle_at_50%_60%,theme(colors.textDark/45%),theme(colors.sunset/40%)_32%,transparent_72%)]"
            aria-hidden
          />

          <div className="relative flex flex-col gap-3 p-4 pt-8">
            <div className="flex items-center justify-between">
              <span className="font-heading text-[15px] font-extrabold text-textLight dark:text-textDark">
                happy<span className="bg-[linear-gradient(135deg,theme(colors.gold),theme(colors.goldDeep))] bg-clip-text text-transparent">hour</span>
              </span>
              <span className="text-nav font-body text-textLight/70 dark:text-textDark/70">Doha</span>
            </div>

            <div className="glass rounded-pill px-4 py-2 text-meta font-body text-textLight/80 shadow-glass-light dark:text-textDark/80 dark:shadow-glass-dark">
              Rechercher un lieu, une offre...
            </div>

            <p className="mt-1 text-nav font-body uppercase tracking-wide text-textLight/60 dark:text-textDark/60">
              En cours près de vous
            </p>

            <div className="flex flex-col gap-2">
              {liveVenues.map((venue) => (
                <div
                  key={venue.name}
                  className="glass flex items-center justify-between rounded-card px-3 py-2.5 shadow-glass-light dark:shadow-glass-dark"
                >
                  <div className="flex flex-col">
                    <span className="text-card-title font-heading font-bold text-textLight dark:text-textDark">
                      {venue.name}
                    </span>
                    <span className="text-meta font-body text-textLight/70 dark:text-textDark/70">
                      {venue.offer}
                    </span>
                  </div>
                  <div className="glass flex items-center gap-1.5 rounded-pill px-2.5 py-1 shadow-glass-light dark:shadow-glass-dark">
                    <span className="live-dot h-1.5 w-1.5 rounded-full bg-liveGreen" aria-hidden />
                    <span className="text-nav font-body text-textLight dark:text-textDark">
                      {formatMinutesRemaining(venue.minutes)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
