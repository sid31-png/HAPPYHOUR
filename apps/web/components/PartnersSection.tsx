import { PartnerForm } from "./PartnerForm";

export function PartnersSection() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 text-center sm:px-10 sm:py-28">
      <h2 className="font-heading text-h2 font-bold text-textLight dark:text-textDark sm:text-4xl">
        Vous gérez un bar, un café, un lieu ?
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-body font-body text-textLight/80 dark:text-textDark/80 sm:text-lg">
        Ajoutez votre établissement à Happy Hour et faites découvrir vos offres à une nouvelle clientèle à
        Doha.
      </p>

      <div className="mt-10 flex justify-center">
        <PartnerForm />
      </div>
    </section>
  );
}
