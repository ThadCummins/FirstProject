// Unit tests for the core logic. Like testthat in R:
//   test_that("sum adds numbers", { expect_equal(sum(c(1, 2)), 3) })
// Run with: npm test

import { describe, expect, it } from "vitest";
import {
  addPurchase,
  budgetRemaining,
  formatMoney,
  removePurchase,
  totalSpent,
  validatePurchase,
  type Purchase,
} from "./purchases";

describe("totals", () => {
  const purchases: Purchase[] = [
    { id: "1", item: "Latte", price: 5.5 },
    { id: "2", item: "Muffin", price: 4.5 },
  ];

  it("adds up the total spent", () => {
    expect(totalSpent(purchases)).toBe(10);
  });

  it("is zero when there are no purchases", () => {
    expect(totalSpent([])).toBe(0);
  });

  it("works out the budget remaining", () => {
    expect(budgetRemaining(purchases, 30)).toBe(20);
    expect(budgetRemaining(purchases, 8)).toBe(-2);
  });
});

describe("formatMoney", () => {
  it("formats positive and negative amounts", () => {
    expect(formatMoney(5.5)).toBe("$5.50");
    expect(formatMoney(0)).toBe("$0.00");
    expect(formatMoney(-3)).toBe("-$3.00");
  });
});

describe("validatePurchase", () => {
  it("accepts a valid purchase", () => {
    expect(validatePurchase("Latte", "5.50")).toBeNull();
    expect(validatePurchase("Free sample", "0")).toBeNull();
  });

  it("rejects bad input", () => {
    expect(validatePurchase("", "5")).not.toBeNull();
    expect(validatePurchase("   ", "5")).not.toBeNull();
    expect(validatePurchase("Latte", "")).not.toBeNull();
    expect(validatePurchase("Latte", "abc")).not.toBeNull();
    expect(validatePurchase("Latte", "-1")).not.toBeNull();
  });
});

describe("adding and removing", () => {
  it("adds a purchase with a unique id and trimmed name", () => {
    const one = addPurchase([], "  Latte ", 5.5);
    const two = addPurchase(one, "Muffin", 4.5);
    expect(two).toHaveLength(2);
    expect(two[0].item).toBe("Latte");
    expect(two[0].id).not.toBe(two[1].id);
  });

  it("does not change the original list", () => {
    const original: Purchase[] = [];
    addPurchase(original, "Latte", 5.5);
    expect(original).toHaveLength(0);
  });

  it("removes only the chosen purchase", () => {
    const list = addPurchase(addPurchase([], "Latte", 5.5), "Muffin", 4.5);
    const result = removePurchase(list, list[0].id);
    expect(result).toHaveLength(1);
    expect(result[0].item).toBe("Muffin");
  });
});
