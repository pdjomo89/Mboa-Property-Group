import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppWidget } from "@/components/layout/whatsapp-widget";
import { getDict } from "@/lib/i18n/server";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = await getDict();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppWidget t={t.whatsapp} />
    </div>
  );
}
