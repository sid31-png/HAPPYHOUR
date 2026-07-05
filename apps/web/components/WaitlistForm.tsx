"use client";

import { useState, type FormEvent } from "react";
import { joinWaitlist } from "@happyhour/api";
import { getSupabaseClient } from "../lib/supabase";

type Status = "idle" | "loading" | "success" | "error" | "not-configured";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
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
      await joinWaitlist(client, email);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="glass rounded-pill px-6 py-4 text-center text-body font-body text-textLight shadow-glass-light dark:text-textDark dark:shadow-glass-dark">
        Merci ! Vous êtes sur la liste d&apos;attente — on vous écrit très bientôt.
      </p>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        className="glass flex w-full flex-col gap-3 rounded-pill p-2 shadow-glass-light dark:shadow-glass-dark sm:flex-row"
      >
        <label htmlFor="waitlist-email" className="sr-only">
          Adresse e-mail
        </label>
        <input
          id="waitlist-email"
          type="email"
          required
          autoComplete="email"
          placeholder="vous@exemple.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-w-0 flex-1 rounded-pill bg-transparent px-5 py-3 text-body font-body text-textLight placeholder:text-textLight/60 outline-none dark:text-textDark dark:placeholder:text-textDark/50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="whitespace-nowrap rounded-pill bg-cta-gradient px-6 py-3 text-body font-heading font-bold text-textDark shadow-cta transition-transform duration-300 ease-golden hover:scale-[1.02] disabled:opacity-70 motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          {status === "loading" ? "Envoi..." : "Rejoindre la liste d'attente"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-center text-meta font-body text-textLight/80 dark:text-textDark/80">
          Une erreur est survenue, merci de réessayer dans un instant.
        </p>
      )}
      {status === "not-configured" && (
        <p className="mt-3 text-center text-meta font-body text-textLight/80 dark:text-textDark/80">
          L&apos;inscription arrive très bientôt — revenez nous voir dans quelques jours !
        </p>
      )}
    </div>
  );
}
