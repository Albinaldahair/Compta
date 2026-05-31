"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { HUD } from "./HUD";
import { BottomNav } from "./BottomNav";

export function Page({
  title,
  subtitle,
  children,
  back = "/",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  back?: string;
}) {
  return (
    <>
      <header className="mb-3 flex items-center justify-between gap-2">
        <Link href={back} className="text-2xl leading-none">←</Link>
        <div className="text-center flex-1">
          <h1 className="title-pixel text-2xl text-gold leading-none">{title}</h1>
          {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
        </div>
        <div className="w-6" />
      </header>
      <HUD />
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 space-y-4"
      >
        {children}
      </motion.section>
      <BottomNav />
    </>
  );
}
