import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vårverb",
  description: "Swedish verb practice for the B1 list.",
};

export default function VarverbLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
