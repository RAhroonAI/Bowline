import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bowline",
  description: "The daily checklist for bareboat chartering.",
};

export default function BowlineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
