// CORE LOGIC: the rules of the app.
//
// This file has NO screen code in it: no buttons, no colours, no web or
// phone specifics. That's deliberate. Because it only deals with data,
// it works unchanged on web, iPhone and Android, and it's easy to test.
//
// This is TypeScript: JavaScript plus "types". `price: number` means
// price must be a number. If code tries to put text there, you get an
// error before the app even runs.

// The shape of one purchase (one "row" of data)
export type Purchase = {
  id: string;
  item: string;
  price: number;
};

// R: sum(x)
export function sum(numbers: number[]): number {
  return numbers.reduce((runningTotal, n) => runningTotal + n, 0);
}

export function totalSpent(purchases: Purchase[]): number {
  return sum(purchases.map((p) => p.price));
}

export function budgetRemaining(purchases: Purchase[], budget: number): number {
  return budget - totalSpent(purchases);
}

// Format a number as money: 5.5 -> "$5.50", -3 -> "-$3.00"
export function formatMoney(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  return sign + "$" + Math.abs(amount).toFixed(2);
}

// Check what the user typed. Returns an error message, or null if it's fine.
export function validatePurchase(item: string, priceText: string): string | null {
  if (item.trim() === "") return "Enter what you bought.";
  const price = Number(priceText);
  if (priceText.trim() === "" || Number.isNaN(price)) return "Enter a price as a number.";
  if (price < 0) return "Price can't be negative.";
  return null;
}

// Each purchase needs a unique id so we can delete the right one.
let nextId = 1;
function makeId(): string {
  return `${Date.now()}-${nextId++}`;
}

// These functions return a NEW list rather than changing the old one.
// That's how React (the screen library) notices something changed.
// It's also how R works: x <- c(x, 5) makes a new vector.
export function addPurchase(purchases: Purchase[], item: string, price: number): Purchase[] {
  return [...purchases, { id: makeId(), item: item.trim(), price }];
}

export function removePurchase(purchases: Purchase[], id: string): Purchase[] {
  return purchases.filter((p) => p.id !== id);
}
