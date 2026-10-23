import type { Metadata } from "next";
import { BourseView } from "@/components/bourse/BourseView";

export const metadata: Metadata = {
  title: "Bourse & Calculator",
  description: "Live building material prices and an instant construction cost estimate.",
};

export default function BoursePage() {
  return <BourseView />;
}
