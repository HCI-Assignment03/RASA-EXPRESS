/** "0771234567" becomes "+94 77 123 4567". Anything else is returned as it was. */
export function formatMobile(stored: string): string {
  const match = /^0(\d{2})(\d{3})(\d{4})$/.exec(stored);
  return match ? `+94 ${match[1]} ${match[2]} ${match[3]}` : stored;
}

/** 650 becomes "Rs. 650", 1550 becomes "Rs. 1,550". */
export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-US')}`;
}
