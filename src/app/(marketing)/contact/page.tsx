import {
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Clock,
} from "lucide-react";
import { ContactForm } from "@/components/marketing/contact-form";
import { getDict } from "@/lib/i18n/server";

export const metadata = {
  title: "Contact — Mboa Property Group",
  description: "Get in touch with Mboa Property Group.",
};

export default async function ContactPage() {
  const { t } = await getDict();
  const tt = t.contact;

  const cards = [
    { icon: Mail, label: tt.cards.email.label, value: "hello@mboapropertygroup.com", href: "mailto:hello@mboapropertygroup.com", gradient: "from-emerald-500 to-teal-500", ring: "ring-emerald-100", soft: "from-emerald-50 to-teal-50" },
    { icon: Phone, label: tt.cards.phone.label, value: "+237 6 00 00 00 00", href: "tel:+237600000000", gradient: "from-sky-500 to-indigo-500", ring: "ring-sky-100", soft: "from-sky-50 to-indigo-50" },
    { icon: MapPin, label: tt.cards.office.label, value: tt.cards.office.value, href: null, gradient: "from-amber-500 to-orange-500", ring: "ring-amber-100", soft: "from-amber-50 to-orange-50" },
    { icon: Clock, label: tt.cards.hours.label, value: tt.cards.hours.value, href: null, gradient: "from-rose-500 to-pink-500", ring: "ring-rose-100", soft: "from-rose-50 to-pink-50" },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 left-10 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute top-40 -right-20 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 via-teal-100 to-sky-100 px-4 py-1.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            {tt.pill}
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">
            {tt.headlineLead}{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
              {tt.headlineAccent}
            </span>
          </h1>
          <p className="mt-4 text-muted-foreground">{tt.lead}</p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            {cards.map(({ icon: Icon, label, value, href, gradient, ring, soft }) => (
              <div
                key={label}
                className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm ring-1 ${ring} hover:shadow-lg transition`}
              >
                <span className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${gradient}`} />
                <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${soft} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-black/5`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold uppercase tracking-wider bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                      {label}
                    </p>
                    {href ? (
                      <a href={href} className="mt-0.5 block font-medium hover:text-emerald-700 transition-colors break-words">
                        {value}
                      </a>
                    ) : (
                      <p className="mt-0.5 font-medium">{value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <a
              href="https://wa.me/18186472187"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-5 text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl transition"
            >
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-lime-400/20 blur-3xl" />
              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004A9.87 9.87 0 0 1 7.1 20.45l-.355-.21-3.674.964.982-3.583-.231-.367a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.892 6.994c-.003 5.45-4.437 9.882-9.879 9.882m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
                    {tt.whatsappPanel.eyebrow}
                  </p>
                  <p className="mt-0.5 font-semibold">{tt.whatsappPanel.title}</p>
                  <p className="mt-1 text-sm text-emerald-50/90">{tt.whatsappPanel.body}</p>
                </div>
              </div>
            </a>
          </div>

          <ContactForm t={tt.form} />
        </div>
      </div>
    </section>
  );
}
