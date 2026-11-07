// Step 1: JavaScript for an R user.
// Run with:  node analysis.js
//
// Comments starting with "R:" show the R code you'd normally write.

// ---------------------------------------------------------------
// 1. Variables
// R: name <- "Coffee tracker"
// ---------------------------------------------------------------
const appName = "Coffee tracker"; // const = can't be reassigned
let total = 0;                    // let   = can be reassigned

// ---------------------------------------------------------------
// 2. A "data frame": in JavaScript it's an array of objects.
// Each object is one row. This is also how most app data looks.
// R: purchases <- data.frame(day = ..., item = ..., price = ...)
// ---------------------------------------------------------------
const purchases = [
  { day: "Mon", item: "Latte",     price: 5.50 },
  { day: "Mon", item: "Croissant", price: 4.00 },
  { day: "Tue", item: "Latte",     price: 5.50 },
  { day: "Wed", item: "Flat white", price: 5.00 },
  { day: "Thu", item: "Latte",     price: 5.50 },
  { day: "Fri", item: "Muffin",    price: 4.50 },
  { day: "Fri", item: "Latte",     price: 5.50 },
];

// ---------------------------------------------------------------
// 3. Pull out a column
// R: purchases$price
// ---------------------------------------------------------------
const prices = purchases.map(row => row.price);
console.log("Prices:", prices);

// ---------------------------------------------------------------
// 4. Functions
// R: mean_of <- function(x) sum(x) / length(x)
// ---------------------------------------------------------------
function sum(numbers) {
  return numbers.reduce((runningTotal, n) => runningTotal + n, 0);
}

function mean(numbers) {
  return sum(numbers) / numbers.length;
}

function sd(numbers) {
  // Sample standard deviation, same as R's sd()
  const m = mean(numbers);
  const squaredDiffs = numbers.map(n => (n - m) ** 2);
  return Math.sqrt(sum(squaredDiffs) / (numbers.length - 1));
}

console.log(`\n${appName}`);
console.log("Total spent:", sum(prices).toFixed(2));
console.log("Mean price: ", mean(prices).toFixed(2));
console.log("SD price:   ", sd(prices).toFixed(2));

// ---------------------------------------------------------------
// 5. Filtering rows
// R: subset(purchases, item == "Latte")   or   dplyr::filter()
// Note: JavaScript uses === for "equals" (not ==).
// ---------------------------------------------------------------
const lattes = purchases.filter(row => row.item === "Latte");
console.log(`\nLattes bought: ${lattes.length}`);

// ---------------------------------------------------------------
// 6. Group and summarise
// R: purchases |> group_by(day) |> summarise(spent = sum(price))
// JavaScript has no dplyr built in, so we build it with a loop.
// ---------------------------------------------------------------
const spentByDay = {}; // an empty object, like an empty named list in R

for (const row of purchases) {
  if (spentByDay[row.day] === undefined) {
    spentByDay[row.day] = 0;
  }
  spentByDay[row.day] += row.price;
}

console.log("\nSpent by day:");
for (const [day, amount] of Object.entries(spentByDay)) {
  console.log(`  ${day}: $${amount.toFixed(2)}`);
}

// ---------------------------------------------------------------
// 7. if / else
// R: if (total > 30) { ... } else { ... }   (identical!)
// ---------------------------------------------------------------
total = sum(prices);
const weeklyBudget = 30;

if (total > weeklyBudget) {
  console.log(`\nOver budget by $${(total - weeklyBudget).toFixed(2)}`);
} else {
  console.log(`\nUnder budget by $${(weeklyBudget - total).toFixed(2)}`);
}

// ---------------------------------------------------------------
// Key differences from R to remember:
//  * Indexes start at 0, not 1:  prices[0] is the first price
//  * Lines can end with ;  (optional, but common)
//  * Use === to compare, not ==
//  * Math isn't vectorised: prices * 2 doesn't work, use prices.map(p => p * 2)
// ---------------------------------------------------------------
