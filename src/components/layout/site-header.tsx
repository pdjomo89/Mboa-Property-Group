import { getDict } from "@/lib/i18n/server";
import { SiteHeaderClient } from "./site-header-client";
import { LocaleToggle } from "./locale-toggle";

export async function SiteHeader() {
  const { locale, t } = await getDict();
  return <SiteHeaderClient t={t} toggle={<LocaleToggle current={locale} />} />;
}
