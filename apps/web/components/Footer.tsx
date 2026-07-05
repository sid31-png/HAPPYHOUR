const links = [
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "Comment ça marche", href: "#comment-ca-marche" },
  { label: "Partenaires", href: "#partenaires" },
];

const socials = ["Instagram", "TikTok", "LinkedIn"];

export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-6 pb-12 pt-10 sm:px-10">
      <div className="glass flex flex-col gap-8 rounded-card p-8 shadow-glass-light dark:shadow-glass-dark sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="font-heading text-card-title font-extrabold text-textLight dark:text-textDark">
            happy
            <span className="bg-[linear-gradient(135deg,theme(colors.gold),theme(colors.goldDeep))] bg-clip-text text-transparent">
              hour
            </span>
          </span>
          <p className="max-w-xs text-meta font-body text-textLight/70 dark:text-textDark/70">
            Trouvez votre prochain happy hour à Doha — bars, cafés, rooftops et événements, en direct.
          </p>
        </div>

        <nav className="flex flex-col gap-2 text-body font-body text-textLight/80 dark:text-textDark/80">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-gold motion-reduce:transition-none">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-2">
          <span className="text-meta font-body uppercase tracking-wide text-textLight/60 dark:text-textDark/60">
            Suivez-nous
          </span>
          <div className="flex gap-3">
            {socials.map((social) => (
              <span
                key={social}
                className="glass rounded-pill px-3 py-1.5 text-nav font-body text-textLight/80 shadow-glass-light dark:text-textDark/80 dark:shadow-glass-dark"
              >
                {social}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-nav font-body text-textLight/60 dark:text-textDark/60">
        © {new Date().getFullYear()} Happy Hour, Doha, Qatar. Tous droits réservés.
      </p>
    </footer>
  );
}
