// Step 2: Making the page react to the user.
//
// The big idea in every app:
//   1. Keep your data in one place ("state")
//   2. When the user does something, update the data
//   3. Redraw the screen from the data
//
// In R, a script runs top to bottom and ends. Here, the code at the
// bottom sets up "listeners" and then the page WAITS for the user.

// ---------------------------------------------------------------
// 1. STATE: the app's data (same shape as step 1)
// ---------------------------------------------------------------
let purchases = [];
let budget = 30;

// ---------------------------------------------------------------
// Grab the elements from index.html that we need to read or change.
// document.getElementById finds an element by its id="..." attribute.
// ---------------------------------------------------------------
const form = document.getElementById("add-form");
const itemInput = document.getElementById("item-input");
const priceInput = document.getElementById("price-input");
const budgetInput = document.getElementById("budget-input");
const list = document.getElementById("purchase-list");
const totalEl = document.getElementById("total");
const remainingEl = document.getElementById("remaining");
const countEl = document.getElementById("count");
const emptyMessage = document.getElementById("empty-message");
const errorEl = document.getElementById("error");

// ---------------------------------------------------------------
// Helper functions (from step 1)
// ---------------------------------------------------------------
function sum(numbers) {
  return numbers.reduce((runningTotal, n) => runningTotal + n, 0);
}

function money(amount) {
  const sign = amount < 0 ? "-" : ""; // R: ifelse(amount < 0, "-", "")
  return sign + "$" + Math.abs(amount).toFixed(2);
}

// ---------------------------------------------------------------
// 3. RENDER: redraw the whole screen from the current state.
// Every time data changes, we call render(). Simple and reliable.
// ---------------------------------------------------------------
function render() {
  const total = sum(purchases.map(p => p.price));
  const remaining = budget - total;

  totalEl.textContent = money(total);
  remainingEl.textContent = money(remaining);
  countEl.textContent = purchases.length;

  // Turn the "budget left" card red when over budget
  remainingEl.classList.toggle("over", remaining < 0);

  // Rebuild the list: clear it, then add one <li> per purchase
  list.innerHTML = "";
  purchases.forEach((purchase, index) => {
    const li = document.createElement("li");

    const name = document.createElement("span");
    name.textContent = purchase.item;

    const price = document.createElement("span");
    price.className = "price";
    price.textContent = money(purchase.price);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.textContent = "✕";
    deleteButton.setAttribute("aria-label", "Delete " + purchase.item);
    deleteButton.addEventListener("click", () => deletePurchase(index));

    li.append(name, price, deleteButton);
    list.append(li);
  });

  // Show the "No purchases yet" message only when the list is empty
  emptyMessage.hidden = purchases.length > 0;
}

// ---------------------------------------------------------------
// 2. ACTIONS: functions that change the state, then re-render
// ---------------------------------------------------------------
function addPurchase(item, price) {
  purchases.push({ item: item, price: price });
  render();
}

function deletePurchase(index) {
  purchases.splice(index, 1); // remove 1 item at position `index`
  render();
}

// ---------------------------------------------------------------
// EVENT LISTENERS: "when X happens, run this function"
// ---------------------------------------------------------------
form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the browser reloading the page

  const item = itemInput.value.trim();
  const price = parseFloat(priceInput.value); // text -> number, like as.numeric()

  // Validate the input before using it. Users type all sorts of things!
  if (item === "" || isNaN(price) || price < 0) {
    errorEl.textContent = "Enter an item name and a price of 0 or more.";
    return;
  }
  errorEl.textContent = "";

  addPurchase(item, price);

  // Clear the form and put the cursor back in the first box
  form.reset();
  itemInput.focus();
});

budgetInput.addEventListener("input", () => {
  budget = parseFloat(budgetInput.value) || 0;
  render();
});

// Draw the screen once when the page first loads
render();
