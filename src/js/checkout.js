import { loadHeaderFooter } from "./utils.mjs";
import { clearCart, getStoredItems, CART_KEY } from "./storage.mjs";

const baseURL = import.meta.env.VITE_SERVER_URL;
const taxRate = 0.06;
const firstItemShipping = 10;
const additionalItemShipping = 2;

function getCartItems() {
  return getStoredItems(CART_KEY);
}

function toPrice(value) {
  return Number(value) || 0;
}

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function calculateOrderTotals(items) {
  const subtotal = items.reduce(
    (total, item) => total + toPrice(item.FinalPrice),
    0,
  );
  const tax = subtotal * taxRate;
  const shipping = items.length
    ? firstItemShipping + (items.length - 1) * additionalItemShipping
    : 0;

  return {
    subtotal,
    tax,
    shipping,
    total: subtotal + tax + shipping,
  };
}

function updateOrderSummary(items) {
  const totals = calculateOrderTotals(items);
  document.querySelector(".summary-subtotal").textContent = formatCurrency(
    totals.subtotal,
  );
  document.querySelector(".summary-tax").textContent = formatCurrency(
    totals.tax,
  );
  document.querySelector(".summary-shipping").textContent = formatCurrency(
    totals.shipping,
  );
  document.querySelector(".summary-total").textContent = formatCurrency(
    totals.total,
  );
}

function showMessage(message, type = "error") {
  const messageElement = document.querySelector(".checkout-message");
  messageElement.textContent = message;
  messageElement.className = `checkout-message checkout-message--${type}`;
}

function clearMessage() {
  const messageElement = document.querySelector(".checkout-message");
  messageElement.textContent = "";
  messageElement.className = "checkout-message";
}

function validateExpiration(value) {
  const [month, year] = value.split("/").map((part) => Number(part));
  if (!month || !year) {
    return false;
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = Number(String(currentDate.getFullYear()).slice(-2));

  return year > currentYear || (year === currentYear && month >= currentMonth);
}

function validateCardNumber(value) {
  const cardNumber = value.replace(/\s/g, "");
  return /^[0-9]{13,19}$/.test(cardNumber);
}

function validateForm(form, cartItems) {
  clearMessage();

  if (cartItems.length === 0) {
    showMessage("Your cart is empty. Add an item before checking out.");
    return false;
  }

  form.querySelectorAll("input").forEach((input) => {
    input.setCustomValidity("");
  });

  const state = form.elements.state;
  const zip = form.elements.zip;
  const cardNumber = form.elements.cardNumber;
  const expiration = form.elements.expiration;
  const code = form.elements.code;

  if (!/^[A-Za-z]{2}$/.test(state.value.trim())) {
    state.setCustomValidity("Enter a two-letter state abbreviation.");
  }

  if (!/^[0-9]{5}$/.test(zip.value.trim())) {
    zip.setCustomValidity("Enter a 5-digit ZIP code.");
  }

  if (!validateCardNumber(cardNumber.value)) {
    cardNumber.setCustomValidity("Enter a valid card number.");
  }

  if (!validateExpiration(expiration.value.trim())) {
    expiration.setCustomValidity("Enter a future expiration date as MM/YY.");
  }

  if (!/^[0-9]{3,4}$/.test(code.value.trim())) {
    code.setCustomValidity("Enter a 3 or 4 digit security code.");
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    showMessage("Please fix the highlighted fields before placing your order.");
    return false;
  }

  return true;
}

function buildOrder(form, cartItems) {
  const totals = calculateOrderTotals(cartItems);
  const formData = new FormData(form);
  const values = Object.fromEntries(formData.entries());

  return {
    orderDate: new Date().toISOString(),
    fname: values.fname.trim(),
    lname: values.lname.trim(),
    street: values.street.trim(),
    city: values.city.trim(),
    state: values.state.trim().toUpperCase(),
    zip: values.zip.trim(),
    cardNumber: values.cardNumber.replace(/\s/g, ""),
    expiration: values.expiration.trim(),
    code: values.code.trim(),
    items: cartItems.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: toPrice(item.FinalPrice),
      quantity: 1,
    })),
    shipping: totals.shipping.toFixed(2),
    tax: totals.tax.toFixed(2),
    orderTotal: totals.total.toFixed(2),
  };
}

function getErrorMessage(data) {
  if (!data || typeof data !== "object") {
    return "The order could not be completed.";
  }

  if (data.message || data.error) {
    return data.message || data.error;
  }

  const fieldErrors = Object.values(data).filter(Boolean);
  if (fieldErrors.length) {
    return fieldErrors.join(" ");
  }

  return "The order could not be completed.";
}

async function submitOrder(order) {
  const response = await fetch(`${baseURL}checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data;
}

function disableForm(form, isDisabled) {
  form.querySelectorAll("input, button").forEach((element) => {
    element.disabled = isDisabled;
  });
}

async function handleCheckoutSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const cartItems = getCartItems();

  if (!validateForm(form, cartItems)) {
    return;
  }

  disableForm(form, true);
  showMessage("Placing your order...", "info");

  try {
    await submitOrder(buildOrder(form, cartItems));
    clearCart();
    updateOrderSummary([]);
    form.reset();
    showMessage("Success! Your order has been placed.", "success");
  } catch (error) {
    showMessage(`Checkout failed: ${error.message}`);
  } finally {
    disableForm(form, false);
  }
}

async function init() {
  await loadHeaderFooter();
  const checkoutForm = document.querySelector(".checkout-form");
  const cartItems = getCartItems();

  updateOrderSummary(cartItems);
  checkoutForm.addEventListener("submit", handleCheckoutSubmit);

  if (cartItems.length === 0) {
    showMessage("Your cart is empty. Add an item before checking out.", "info");
  }
}

init();
