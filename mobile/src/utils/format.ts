/** "0771234567" becomes "+94 77 123 4567". Anything else is returned as it was. */
export function formatMobile(stored: string): string {
  const match = /^0(\d{2})(\d{3})(\d{4})$/.exec(stored);
  return match ? `+94 ${match[1]} ${match[2]} ${match[3]}` : stored;
}

/** 650 becomes "Rs. 650", 1550 becomes "Rs. 1,550". */
export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-US')}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** A date as "7 Oct 2026". Written out by hand because Intl locales vary between devices. */
export function formatDate(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * How long ago something happened: "Just now", "5 min ago", "3 h ago", "Yesterday", "4 days ago".
 * After a week it falls back to the date, e.g. "7 Oct 2026".
 */
export function formatTimeAgo(date: Date, now: Date = new Date()): string {
  const minutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return formatDate(date);
}
