import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glosor",
  description: "Swedish vocabulary flashcards.",
};

export default function GlosorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
