const steps = [
  {
    number: "1",
    title: "Repérez",
    description: "Ouvrez l'app et découvrez les happy hours en cours et les événements du soir autour de vous.",
  },
  {
    number: "2",
    title: "Choisissez",
    description: "Comparez les offres, les distances et les avis pour trouver le lieu qui vous correspond.",
  },
  {
    number: "3",
    title: "Profitez",
    description: "Réservez en un tap et profitez de votre soirée — sans avoir perdu 45 minutes à chercher.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
      <h2 className="text-center font-heading text-h2 font-bold text-textLight dark:text-textDark sm:text-4xl">
        Comment ça marche
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
            <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-cta-gradient font-heading text-lg font-bold text-textDark shadow-cta">
              {step.number}
            </span>
            <h3 className="font-heading text-card-title font-bold text-textLight dark:text-textDark sm:text-xl">
              {step.title}
            </h3>
            <p className="text-body font-body text-textLight/80 dark:text-textDark/80">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
