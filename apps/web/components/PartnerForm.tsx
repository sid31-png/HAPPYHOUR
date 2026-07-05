"use client";

import { useState, type FormEvent } from "react";
import { submitPartnerLead } from "@happyhour/api";
import { getSupabaseClient } from "../lib/supabase";

type Status = "idle" | "loading" | "success" | "error" | "not-configured";

export function PartnerForm() {
  const [name, setName] = useState("");
  const [venueName, setVenueName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getSupabaseClient();

    if (!client) {
      setStatus("not-configured");
      return;
    }

    setStatus("loading");
    try {
      await submitPartnerLead(client, {
        name,
        venueName,
        email,
        phone: phone || undefined,
      });
      setStatus("success");
      setName("");
      setVenueName("");
      setEmail("");
      setPhone("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="glass rounded-card p-6 text-center text-body font-body text-textLight shadow-glass-light dark:text-textDark dark:shadow-glass-dark">
        Merci ! Votre demande a bien été reçue, notre équipe vous contacte très vite.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass grid w-full max-w-2xl grid-cols-1 gap-4 rounded-card p-6 shadow-glass-light dark:shadow-glass-dark sm:grid-cols-2 sm:p-8"
    >
      <div className="flex flex-col gap-1.5 sm:col-span-1">
        <label htmlFor="partner-name" className="text-meta font-body text-textLight/80 dark:text-textDark/80">
          Nom
        </label>
        <input
          id="partner-name"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="glass rounded-pill px-4 py-3 text-body font-body text-textLight outline-none dark:text-textDark"
          placeholder="Votre nom"
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-1">
        <label htmlFor="partner-venue" className="text-meta font-body text-textLight/80 dark:text-textDark/80">
          Établissement
        </label>
        <input
          id="partner-venue"
          type="text"
          required
          value={venueName}
          onChange={(event) => setVenueName(event.target.value)}
          className="glass rounded-pill px-4 py-3 text-body font-body text-textLight outline-none dark:text-textDark"
          placeholder="Nom de votre lieu"
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-1">
        <label htmlFor="partner-email" className="text-meta font-body text-textLight/80 dark:text-textDark/80">
          E-mail
        </label>
        <input
          id="partner-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="glass rounded-pill px-4 py-3 text-body font-body text-textLight outline-none dark:text-textDark"
          placeholder="vous@exemple.com"
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-1">
        <label htmlFor="partner-phone" className="text-meta font-body text-textLight/80 dark:text-textDark/80">
          Téléphone <span className="text-textLight/50 dark:text-textDark/50">(optionnel)</span>
        </label>
        <input
          id="partner-phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="glass rounded-pill px-4 py-3 text-body font-body text-textLight outline-none dark:text-textDark"
          placeholder="+974 XXXX XXXX"
        />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-pill bg-cta-gradient px-6 py-3 text-body font-heading font-bold text-textDark shadow-cta transition-transform duration-300 ease-golden hover:scale-[1.01] disabled:opacity-70 motion-reduce:transition-none motion-reduce:hover:scale-100 sm:w-auto"
        >
          {status === "loading" ? "Envoi..." : "Ajouter mon établissement"}
        </button>
        {status === "error" && (
          <p className="mt-3 text-meta font-body text-textLight/80 dark:text-textDark/80">
            Une erreur est survenue, merci de réessayer dans un instant.
          </p>
        )}
        {status === "not-configured" && (
          <p className="mt-3 text-meta font-body text-textLight/80 dark:text-textDark/80">
            Le formulaire partenaires arrive très bientôt — écrivez-nous en attendant !
          </p>
        )}
      </div>
    </form>
  );
}
