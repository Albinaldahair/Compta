"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const ITEMS: { href: string; label: string; emoji: string }[] = [
  { href: "/", label: "Hub", emoji: "🏠" },
  { href: "/flashcards", label: "Cartes", emoji: "🧠" },
  { href: "/exam", label: "Examen", emoji: "📝" },
  { href: "/voice", label: "Voix", emoji: "🎙️" },
  { href: "/pcg", label: "PCG", emoji: "📒" },
  { href: "/night", label: "Nuit", emoji: "🌙" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-ink/85 backdrop-blur border-t border-white/10">
      <div className="mx-auto max-w-md sm:max-w-2xl grid grid-cols-6">
        {ITEMS.map((it) => {
          const active = pathname === it.href || (it.href !== "/" && pathname.startsWith(it.href));
          return (
            <Link
              key={it.href}
              href={it.href}
              className={clsx(
                "flex flex-col items-center justify-center py-2 text-[11px] font-semibold",
                active ? "text-gold" : "text-white/60 hover:text-white"
              )}
            >
              <span className="text-xl leading-none">{it.emoji}</span>
              <span className="mt-0.5">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
