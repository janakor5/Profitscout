/* =========================================================
   PROFITSCOUT - MAIN JAVASCRIPT
   ========================================================= */

/* ---------- PRODUCT DATA ---------- */

const products = [
  {
    name: "Reusable Silicone Food Storage Bags",
    categories: ["kitchen", "home", "storage"],
    buy: 3.50,
    sell: 16.99,
    demand: 90,
    competition: "Medium"
  },
  {
    name: "Bamboo Drawer Organizer",
    categories: ["kitchen", "home", "organization", "storage"],
    buy: 5.00,
    sell: 19.99,
    demand: 86,
    competition: "Medium"
  },
  {
    name: "Electric Milk Frother",
    categories: ["kitchen", "coffee", "home"],
    buy: 4.00,
    sell: 17.99,
    demand: 84,
    competition: "Medium"
  },
  {
    name: "Kitchen Sink Organizer",
    categories: ["kitchen", "home", "organization"],
    buy: 4.50,
    sell: 18.99,
    demand: 82,
    competition: "Medium"
  },
  {
    name: "Silicone Air Fryer Liners",
    categories: ["kitchen", "cooking", "home"],
    buy: 2.50,
    sell: 14.99,
    demand: 88,
    competition: "High"
  },
  {
    name: "Resistance Bands Set",
    categories: ["fitness", "exercise", "sports"],
    buy: 6.00,
    sell: 24.99,
    demand: 91,
    competition: "High"
  },
  {
    name: "Adjustable Phone Stand",
    categories: ["electronics", "office", "phone"],
    buy: 3.00,
    sell: 15.99,
    demand: 85,
    competition: "High"
  },
  {
    name: "LED Closet Lights",
    categories: ["home", "lighting", "organization"],
    buy: 4.00,
    sell: 19.99,
    demand: 87,
    competition: "Medium"
  },
  {
    name: "Pet Grooming Brush",
    categories: ["pets", "pet", "animals"],
    buy: 3.00,
    sell: 14.99,
    demand: 83,
    competition: "Medium"
  },
  {
    name: "Dog Car Seat Cover",
    categories: ["pets", "pet", "dogs", "auto"],
    buy: 8.00,
    sell: 29.99,
    demand: 81,
    competition: "Medium"
  },
  {
    name: "Kids Drawing Tablet",
    categories: ["kids", "toys", "children", "electronics"],
    buy: 8.00,
    sell: 29.99,
    demand: 89,
    competition: "High"
  },
  {
    name: "Magnetic Building Blocks",
    categories: ["kids", "toys", "children"],
    buy: 7.00,
    sell: 27.99,
    demand: 86,
    competition: "Medium"
  },
  {
    name: "Car Phone Mount",
    categories: ["auto", "car", "electronics", "phone"],
    buy: 4.00,
    sell: 18.99,
    demand: 88,
    competition: "High"
  },
  {
    name: "Trunk Organizer",
    categories: ["auto", "car", "organization"],
    buy: 7.00,
    sell: 24.99,
    demand: 84,
    competition: "Medium"
  },
  {
    name: "Travel Packing Cubes",
    categories: ["travel", "storage", "organization"],
    buy: 6.00,
    sell: 22.99,
    demand: 82,
    competition: "Medium"
  }
];


/* ---------- HELPER FUNCTIONS ---------- */

function money(value) {
  return "$" + Number(value).toFixed(2);
}

function calculateProfit(buy, sell) {
  return sell - buy;
}

function calculateMargin(buy, sell) {
  if (sell <= 0) return 0;
  return ((sell - buy) / sell) * 100;
}


/* ---------- MAIN SCOUT FUNCTION ---------- */

function scoutProducts() {

  const input = document.getElementById("category");
  const results = document.getElementById("results");

  if (!input || !results) {
    console.error("ProfitScout: category or results element not found.");
    return;
  }

  const category = input.value.trim().toLowerCase();

  if (!category) {
    results.innerHTML = `
      <div class="result-card">
        <h3>Enter a product category</h3>
        <p>
          Try something like <strong>kitchen</strong>,
          <strong>toys</strong>, <strong>fitness</strong>,
          <strong>pets</strong>, or <strong>home</strong>.
        </p>
      </div>
    `;

    results.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    return;
  }


  /* Find matching products */

  let matches = products.filter(product => {

    const searchableText =
      product.name.toLowerCase() +
      " " +
      product.categories.join(" ");

    return searchableText.includes(category);
  });


  /* If no exact matches, show general opportunities */

  if (matches.length === 0) {

    matches = products
      .sort((a, b) => b.demand - a.demand)
      .slice(0, 3);

    results.innerHTML = `
      <div class="result-card">
        <h3>No exact matches for "${escapeHTML(category)}"</h3>
        <p>
          Here are some high-demand products that may be worth researching.
        </p>
      </div>
    `;
  } else {

    results.innerHTML = `
      <div class="result-card">
        <h3>${escapeHTML(category.charAt(0).toUpperCase() + category.slice(1))} opportunities</h3>
        <p>
          ${matches.length} potential product opportunit${matches.length === 1 ? "y" : "ies"} found.
        </p>
      </div>
    `;
  }


  /* Add product cards */

  matches.forEach(product => {

    const profit = calculateProfit(product.buy, product.sell);
    const margin = calculateMargin(product.buy, product.sell);

    const card = document.createElement("div");

    card.className = "result-card";

    card.innerHTML = `
      <h3>${escapeHTML(product.name)}</h3>

      <p>
        <strong>Estimated Buy:</strong> ${money(product.buy)}
      </p>

      <p>
        <strong>Estimated Sell:</strong> ${money(product.sell)}
      </p>

      <p>
        <strong>Est. Profit:</strong> ${money(profit)}
      </p>

      <p>
        <strong>Margin:</strong> ${Math.round(margin)}%
      </p>

      <p>
        <strong>Demand:</strong> ${product.demand}/100
      </p>

      <p>
        <strong>Competition:</strong> ${product.competition}
      </p>

      <button
        class="button primary"
        type="button"
        onclick="saveOpportunity('${escapeAttribute(product.name)}')"
      >
        Save Opportunity
      </button>
    `;

    results.appendChild(card);
  });


  /* Move user to results */

  results.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


/* ---------- SAVE OPPORTUNITY ---------- */

function saveOpportunity(productName) {

  let saved = JSON.parse(
    localStorage.getItem("profitScoutSaved") || "[]"
  );

  if (!saved.includes(productName)) {
    saved.push(productName);

    localStorage.setItem(
      "profitScoutSaved",
      JSON.stringify(saved)
    );

    alert(productName + " has been saved to your opportunities.");
  } else {
    alert(productName + " is already saved.");
  }
}


/* ---------- PRO WAITLIST ---------- */

function showComingSoon() {

  alert(
    "ProfitScout Pro is coming soon!\n\n" +
    "The Pro version will include advanced product filters, " +
    "saved product lists, profit calculations and opportunity scoring."
  );
}


/* ---------- SAFE HTML HELPERS ---------- */

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return String(value).replace(/'/g, "\\'");
}


/* ---------- ENTER KEY ---------- */

document.addEventListener("DOMContentLoaded", function () {

  const categoryInput = document.getElementById("category");

  if (categoryInput) {

    categoryInput.addEventListener("keydown", function (event) {

      if (event.key === "Enter") {
        event.preventDefault();
        scoutProducts();
      }

    });

  }

});


/* =========================================================
   PROFIT CALCULATOR
   ========================================================= */

const sale = document.getElementById("sale");
const cost = document.getElementById("cost");
const fee = document.getElementById("fee");

const saleOut = document.getElementById("saleOut");
const costOut = document.getElementById("costOut");
const feeOut = document.getElementById("feeOut");
const profit = document.getElementById("profit");
const margin = document.getElementById("margin");


function updateCalc() {

  if (!sale || !cost || !fee) return;

  const s = Number(sale.value);
  const c = Number(cost.value);
  const f = Number(fee.value);

  const p = s - c - f;

  const m = s > 0
    ? (p / s) * 100
    : 0;

  if (saleOut) saleOut.textContent = money(s);
  if (costOut) costOut.textContent = money(c);
  if (feeOut) feeOut.textContent = money(f);
  if (profit) profit.textContent = money(p);
  if (margin) margin.textContent = Math.round(m) + "%";
}


if (sale && cost && fee) {

  sale.addEventListener("input", updateCalc);
  cost.addEventListener("input", updateCalc);
  fee.addEventListener("input", updateCalc);

  updateCalc();
}


/* =========================================================
   LEAD FORM
   ========================================================= */

const leadForm = document.getElementById("leadForm");

if (leadForm) {

  leadForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const message =
      document.getElementById("formMessage");

    if (message) {

      message.textContent =
        "Thanks! Your request has been captured. " +
        "Connect this form to your email or CRM before going live.";
    }

    leadForm.reset();

  });

}
