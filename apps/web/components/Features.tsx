const features = [
  {
    title: "Happy hours en direct",
    description:
      "Un compte à rebours en temps réel sur chaque offre en cours : plus besoin de deviner s'il est encore temps d'y aller.",
  },
  {
    title: "Tout réserver en un tap",
    description:
      "Tables, billets et expériences : réservez votre soirée en quelques secondes, directement depuis l'app.",
  },
  {
    title: "Le Club",
    description:
      "Un abonnement pensé pour les habitués : un drink offert chaque semaine, des réductions et un accès prioritaire.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
      <h2 className="text-center font-heading text-h2 font-bold text-textLight dark:text-textDark sm:text-4xl">
        Ce que vous trouverez dans l&apos;app
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="glass flex flex-col gap-3 rounded-card p-8 shadow-glass-light transition-transform duration-500 ease-golden hover:-translate-y-1 dark:shadow-glass-dark motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <h3 className="font-heading text-card-title font-bold text-textLight dark:text-textDark sm:text-xl">
              {feature.title}
            </h3>
            <p className="text-body font-body text-textLight/80 dark:text-textDark/80">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
