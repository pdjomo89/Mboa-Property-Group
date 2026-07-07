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
          </div>

          <ContactForm t={tt.form} />
        </div>
      </div>
    </section>
  );
}
