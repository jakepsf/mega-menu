import type { Metadata } from "next";
import WorkComponent from "@/components/pages/WorkComponent";

export const metadata: Metadata = {
  title: "Work Showcase",
  description:
    "Browse full portfolio of residential and commercial renovation projects in Singapore.",
  alternates: { canonical: "/works" },
  openGraph: {
    title: "Work Showcase | Interior Design & Renovation Services",
    description:
      "Browse PERSQFT's full portfolio of residential and commercial renovation projects in Singapore.",
    url: `https://btoreno.com/works`,
  }
};

export default function Works() {
  return (
    <WorkComponent />
  );
}
