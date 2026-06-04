import Footer from "@/components/layout/Footer";

export default function EsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <Footer lang="es" />
    </>
  );
}
