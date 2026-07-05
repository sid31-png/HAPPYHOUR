import { WaitlistForm } from "./WaitlistForm";
import { PhoneMockup } from "./PhoneMockup";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden px-6 pb-16 pt-28 sm:px-10">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_26%,theme(colors.textDark/90%),theme(colors.amberLight/55%)_30%,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_58%,theme(colors.textDark/55%),theme(colors.sunset/45%)_30%,transparent_70%)]"
        aria-hidden
      />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <h1 className="font-heading text-5xl font-extrabold leading-tight text-textLight dark:text-textDark sm:text-6xl lg:text-7xl">
            happy
            <span className="bg-[linear-gradient(135deg,theme(colors.gold),theme(colors.goldDeep))] bg-clip-text text-transparent">
              hour
            </span>
          </h1>

          <p className="max-w-md text-h2 font-body text-textLight/90 dark:text-textDark/90 sm:text-xl">
            Trouvez votre prochain happy hour à Doha — bars, cafés, rooftops et événements, en direct.
          </p>

          <p className="max-w-md text-body font-body text-textLight/75 dark:text-textDark/75">
            Fini de chercher pendant 45 minutes : on vous montre les offres en cours, maintenant, autour de vous.
          </p>

          <div className="mt-2 flex w-full flex-col items-center gap-3 lg:items-start">
            <WaitlistForm />
            <span className="text-meta font-body text-textLight/60 dark:text-textDark/60">
              Lancement à Doha — places limitées pour la liste d&apos;attente.
            </span>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
