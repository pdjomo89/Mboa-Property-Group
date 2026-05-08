export function formatXAF(amount: number): string {
  return new Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
}

export function formatDateTime(timestamp: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function formatPhone(phone: string): string {
  if (phone.startsWith("+237")) {
    const num = phone.slice(4);
    return `+237 ${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6)}`;
  }
  return phone;
}
