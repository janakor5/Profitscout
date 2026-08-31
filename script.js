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
/* =========================================================
   PROFITSCOUT - UPGRADED PRODUCT RESULTS
   ========================================================= */

function upgradedScoutProducts() {

  const input = document.getElementById("category");
  const results = document.getElementById("results");

  if (!input || !results) return;

  const category = input.value.trim().toLowerCase();

  if (!category) {
    results.innerHTML = `
      <div class="result-card">
        <h3>Enter a category first</h3>
        <p>Try Kitchen, Home, Pets, Fitness, Toys, Auto, or Travel.</p>
      </div>
    `;
    return;
  }

  let matches = products.filter(product => {

    const text =
      product.name.toLowerCase() +
      " " +
      product.categories.join(" ");

    return text.includes(category);
  });

  if (matches.length === 0) {
    matches = [...products]
      .sort((a, b) => b.demand - a.demand)
      .slice(0, 5);
  }

  function renderProducts(list) {

    let html = `
      <div class="result-card">
        <h2>
          ${category.charAt(0).toUpperCase() + category.slice(1)}
          Opportunities
        </h2>

        <p>
          ${list.length} products worth researching
        </p>

        <div style="display:flex;gap:8px;flex-wrap:wrap;margin:15px 0;">

          <button
            type="button"
            class="button primary"
            onclick="sortProfitScout('profit')">
            Highest Profit
          </button>

          <button
            type="button"
            class="button primary"
            onclick="sortProfitScout('demand')">
            Highest Demand
          </button>

          <button
            type="button"
            class="button primary"
            onclick="sortProfitScout('margin')">
            Highest Margin
          </button>

        </div>
      </div>
    `;

    list.forEach(product => {

      const profit =
        Number(product.sell) - Number(product.buy);

      const margin =
        product.sell > 0
          ? (profit / product.sell) * 100
          : 0;

      const opportunityScore =
        Math.round(
          (Number(product.demand) * 0.5) +
          (Math.min(margin, 100) * 0.3) +
          (product.competition === "Low"
            ? 20
            : product.competition === "Medium"
              ? 12
              : 6)
        );

      const estimatedMonthlySales =
        Math.max(
          10,
          Math.round(product.demand * 2.5)
        );

      const estimatedMonthlyProfit =
        Math.round(
          estimatedMonthlySales * profit
        );

      html += `
        <div class="result-card">

          <h2>${product.name}</h2>

          <p>
            <strong>Opportunity Score:</strong>
            ${opportunityScore}/100
          </p>

          <p>
            <strong>Estimated Buy:</strong>
            $${Number(product.buy).toFixed(2)}
          </p>

          <p>
            <strong>Estimated Sell:</strong>
            $${Number(product.sell).toFixed(2)}
          </p>

          <p>
            <strong>Profit Per Sale:</strong>
            $${profit.toFixed(2)}
          </p>

          <p>
            <strong>Margin:</strong>
            ${Math.round(margin)}%
          </p>

          <p>
            <strong>Demand:</strong>
            ${product.demand}/100
          </p>

          <p>
            <strong>Competition:</strong>
            ${product.competition}
          </p>

          <hr>

          <p>
            <strong>Estimated Monthly Sales:</strong>
            ${estimatedMonthlySales}
          </p>

          <p>
            <strong>Estimated Monthly Profit:</strong>
            $${estimatedMonthlyProfit.toLocaleString()}
          </p>

          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:15px;">

            <button
              type="button"
              class="button primary"
              onclick="saveOpportunity('${product.name.replace(/'/g, "\\'")}')">
              Save Opportunity
            </button>

            <button
              type="button"
              class="button primary"
              onclick="researchProduct('${product.name.replace(/'/g, "\\'")}')">
              Research Product
            </button>

          </div>

        </div>
      `;
    });

    results.innerHTML = html;

    results.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  window.currentProfitScoutResults = matches;

  renderProducts(matches);
}


/* ---------- SORT RESULTS ---------- */

function sortProfitScout(type) {

  if (!window.currentProfitScoutResults) return;

  const sorted = [...window.currentProfitScoutResults];

  if (type === "profit") {

    sorted.sort((a, b) =>
      (b.sell - b.buy) - (a.sell - a.buy)
    );

  } else if (type === "demand") {

    sorted.sort((a, b) =>
      b.demand - a.demand
    );

  } else if (type === "margin") {

    sorted.sort((a, b) => {

      const marginA =
        ((a.sell - a.buy) / a.sell) * 100;

      const marginB =
        ((b.sell - b.buy) / b.sell) * 100;

      return marginB - marginA;
    });
  }

  window.currentProfitScoutResults = sorted;

  /* Re-run the display using the selected order */

  const results = document.getElementById("results");

  if (!results) return;

  const category =
    document.getElementById("category")?.value || "Product";

  let html = `
    <div class="result-card">

      <h2>
        ${category.charAt(0).toUpperCase() + category.slice(1)}
        Opportunities
      </h2>

      <p>Sorted by ${type}.</p>

      <div style="display:flex;gap:8px;flex-wrap:wrap;margin:15px 0;">

        <button
          type="button"
          class="button primary"
          onclick="sortProfitScout('profit')">
          Highest Profit
        </button>

        <button
          type="button"
          class="button primary"
          onclick="sortProfitScout('demand')">
          Highest Demand
        </button>

        <button
          type="button"
          class="button primary"
          onclick="sortProfitScout('margin')">
          Highest Margin
        </button>

      </div>

    </div>
  `;

  sorted.forEach(product => {

    const profit =
      product.sell - product.buy;

    const margin =
      (profit / product.sell) * 100;

    const opportunityScore =
      Math.round(
        product.demand * 0.5 +
        Math.min(margin, 100) * 0.3 +
        (product.competition === "Low"
          ? 20
          : product.competition === "Medium"
            ? 12
            : 6)
      );

    const monthlySales =
      Math.max(10, Math.round(product.demand * 2.5));

    const monthlyProfit =
      Math.round(monthlySales * profit);

    html += `
      <div class="result-card">

        <h2>${product.name}</h2>

        <p><strong>Opportunity Score:</strong> ${opportunityScore}/100</p>

        <p><strong>Buy:</strong> $${product.buy.toFixed(2)}</p>

        <p><strong>Sell:</strong> $${product.sell.toFixed(2)}</p>

        <p><strong>Profit:</strong> $${profit.toFixed(2)}</p>

        <p><strong>Margin:</strong> ${Math.round(margin)}%</p>

        <p><strong>Demand:</strong> ${product.demand}/100</p>

        <p><strong>Competition:</strong> ${product.competition}</p>

        <hr>

        <p>
          <strong>Estimated Monthly Profit:</strong>
          $${monthlyProfit.toLocaleString()}
        </p>

        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:15px;">

          <button
            type="button"
            class="button primary"
            onclick="saveOpportunity('${product.name.replace(/'/g, "\\'")}')">
            Save Opportunity
          </button>

          <button
            type="button"
            class="button primary"
            onclick="researchProduct('${product.name.replace(/'/g, "\\'")}')">
            Research Product
          </button>

        </div>

      </div>
    `;
  });

  results.innerHTML = html;
}


/* ---------- PRODUCT RESEARCH ---------- */

function researchProduct(productName) {

  const searchURL =
    "https://www.google.com/search?q=" +
    encodeURIComponent(
      productName +
      " wholesale supplier Amazon selling price"
    );

  window.open(searchURL, "_blank");
}


/* ---------- REPLACE THE ORIGINAL SCOUT FUNCTION ---------- */

window.scoutProducts = upgradedScoutProducts;
/* =========================================================
   PROFITSCOUT RESEARCH + ROI UPGRADE
   ========================================================= */

(function () {
  "use strict";

  function getProductName(button) {
    let current = button;

    for (let i = 0; i < 8 && current; i++) {
      const heading = current.querySelector("h1, h2, h3, h4, h5");

      if (heading && heading.textContent.trim()) {
        return heading.textContent.trim();
      }

      current = current.parentElement;
    }

    return "Product Research";
  }

  function money(value) {
    return "$" + Number(value || 0).toFixed(2);
  }

  function createResearchModal(productName) {
    const old = document.getElementById("profitscoutResearchModal");
    if (old) old.remove();

    const modal = document.createElement("div");
    modal.id = "profitscoutResearchModal";

    modal.innerHTML = `
      <div class="ps-modal-overlay">
        <div class="ps-modal">

          <button class="ps-close" id="psCloseResearch">×</button>

          <div class="ps-modal-title">
            🔎 Product Research
          </div>

          <div class="ps-product-name">
            ${productName}
          </div>

          <div class="ps-research-links">

            <a target="_blank"
              href="https://www.amazon.com/s?k=${encodeURIComponent(productName)}">
              🛒 Search Amazon
            </a>

            <a target="_blank"
              href="https://www.google.com/search?tbm=shop&q=${encodeURIComponent(productName)}">
              🛍️ Compare Prices
            </a>

            <a target="_blank"
              href="https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(productName)}">
              📦 Search eBay
            </a>

            <a target="_blank"
              href="https://www.walmart.com/search?q=${encodeURIComponent(productName)}">
              🏪 Search Walmart
            </a>

          </div>

          <hr>

          <h3>💰 Profit & ROI Calculator</h3>

          <label>
            Selling Price
            <input id="psSellPrice" type="number" step="0.01" value="16.99">
          </label>

          <label>
            Product Cost
            <input id="psBuyCost" type="number" step="0.01" value="3.50">
          </label>

          <label>
            Amazon Referral Fee %
            <input id="psReferral" type="number" step="0.1" value="15">
          </label>

          <label>
            Shipping / Fulfillment Per Sale
            <input id="psFulfillment" type="number" step="0.01" value="3.50">
          </label>

          <label>
            Other Cost Per Sale
            <input id="psOtherCost" type="number" step="0.01" value="0">
          </label>

          <label>
            Estimated Monthly Sales
            <input id="psMonthlySales" type="number" step="1" value="225">
          </label>

          <div class="ps-results">

            <div>
              <span>Amazon Fee</span>
              <strong id="psAmazonFee">$0.00</strong>
            </div>

            <div>
              <span>Net Profit / Sale</span>
              <strong id="psNetProfit">$0.00</strong>
            </div>

            <div>
              <span>Net Margin</span>
              <strong id="psNetMargin">0%</strong>
            </div>

            <div>
              <span>ROI</span>
              <strong id="psROI">0%</strong>
            </div>

            <div>
              <span>Estimated Monthly Profit</span>
              <strong id="psMonthlyProfit">$0.00</strong>
            </div>

            <div class="ps-verdict" id="psVerdict">
              RESEARCHING...
            </div>

          </div>

          <p class="ps-disclaimer">
            Estimates only. Actual Amazon fees, fulfillment, shipping,
            returns, storage and other costs can vary.
          </p>

        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const sell = document.getElementById("psSellPrice");
    const buy = document.getElementById("psBuyCost");
    const referral = document.getElementById("psReferral");
    const fulfillment = document.getElementById("psFulfillment");
    const other = document.getElementById("psOtherCost");
    const monthlySales = document.getElementById("psMonthlySales");

    function calculate() {

      const sellingPrice = Number(sell.value) || 0;
      const buyCost = Number(buy.value) || 0;
      const referralPercent = Number(referral.value) || 0;
      const fulfillmentCost = Number(fulfillment.value) || 0;
      const otherCost = Number(other.value) || 0;
      const units = Number(monthlySales.value) || 0;

      const amazonFee =
        sellingPrice * (referralPercent / 100);

      const netProfit =
        sellingPrice -
        buyCost -
        amazonFee -
        fulfillmentCost -
        otherCost;

      const margin =
        sellingPrice > 0
          ? (netProfit / sellingPrice) * 100
          : 0;

      const investment =
        buyCost + fulfillmentCost + otherCost;

      const roi =
        investment > 0
          ? (netProfit / investment) * 100
          : 0;

      const monthlyProfit =
        netProfit * units;

      document.getElementById("psAmazonFee").textContent =
        money(amazonFee);

      document.getElementById("psNetProfit").textContent =
        money(netProfit);

      document.getElementById("psNetMargin").textContent =
        Math.round(margin) + "%";

      document.getElementById("psROI").textContent =
        Math.round(roi) + "%";

      document.getElementById("psMonthlyProfit").textContent =
        money(monthlyProfit);

      const verdict =
        document.getElementById("psVerdict");

      if (netProfit <= 0) {

        verdict.textContent = "🚫 AVOID";
        verdict.className = "ps-verdict avoid";

      } else if (roi >= 100 && margin >= 20) {

        verdict.textContent = "🔥 STRONG OPPORTUNITY";
        verdict.className = "ps-verdict strong";

      } else if (roi >= 50 && margin >= 15) {

        verdict.textContent = "✅ WORTH RESEARCHING";
        verdict.className = "ps-verdict good";

      } else {

        verdict.textContent = "⚠️ MAYBE — RESEARCH MORE";
        verdict.className = "ps-verdict maybe";
      }
    }

    [
      sell,
      buy,
      referral,
      fulfillment,
      other,
      monthlySales
    ].forEach(input => {
      input.addEventListener("input", calculate);
    });

    calculate();

    document
      .getElementById("psCloseResearch")
      .addEventListener("click", () => {
        modal.remove();
      });

    modal
      .querySelector(".ps-modal-overlay")
      .addEventListener("click", function (event) {
        if (event.target === this) {
          modal.remove();
        }
      });
  }

  /* Intercept Research Product buttons before the old
     Google-search action runs. */

  document.addEventListener(
    "click",
    function (event) {

      const element = event.target.closest(
        "button, a"
      );

      if (!element) return;

      const text =
        element.textContent
          .trim()
          .toLowerCase();

      if (
        text.includes("research product") ||
        text.includes("research this product")
      ) {

        event.preventDefault();
        event.stopImmediatePropagation();

        const productName =
          getProductName(element);

        createResearchModal(productName);
      }

    },
    true
  );


  /* Add the research-modal styling */

  const style = document.createElement("style");

  style.textContent = `

    .ps-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(10, 15, 30, 0.72);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
      overflow-y: auto;
    }

    .ps-modal {
      position: relative;
      width: min(560px, 100%);
      max-height: 92vh;
      overflow-y: auto;
      background: white;
      border-radius: 24px;
      padding: 26px;
      box-sizing: border-box;
      box-shadow: 0 20px 60px rgba(0,0,0,.30);
      font-family: Arial, sans-serif;
    }

    .ps-close {
      position: absolute;
      right: 18px;
      top: 12px;
      border: 0;
      background: transparent;
      font-size: 34px;
      cursor: pointer;
      color: #555;
    }

    .ps-modal-title {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 8px;
      padding-right: 35px;
    }

    .ps-product-name {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 20px;
      color: #596275;
    }

    .ps-research-links {
      display: grid;
      gap: 10px;
    }

    .ps-research-links a {
      display: block;
      padding: 14px 16px;
      border-radius: 12px;
      background: #6754e9;
      color: white;
      text-decoration: none;
      font-weight: 700;
      text-align: center;
    }

    .ps-modal hr {
      border: 0;
      border-top: 1px solid #ddd;
      margin: 24px 0;
    }

    .ps-modal h3 {
      margin-bottom: 15px;
    }

    .ps-modal label {
      display: block;
      font-weight: 700;
      margin: 13px 0;
      color: #374151;
    }

    .ps-modal input {
      width: 100%;
      box-sizing: border-box;
      margin-top: 6px;
      padding: 13px;
      border: 1px solid #ccd2dc;
      border-radius: 10px;
      font-size: 17px;
    }

    .ps-results {
      margin-top: 22px;
      border-radius: 16px;
      background: #f4f5fb;
      padding: 16px;
    }

    .ps-results > div {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      padding: 10px 0;
      border-bottom: 1px solid #ddd;
    }

    .ps-results > div:last-child {
      border-bottom: 0;
    }

    .ps-verdict {
      display: block !important;
      text-align: center;
      font-size: 21px;
      font-weight: 900;
      margin-top: 10px;
      padding: 14px;
      border-radius: 12px;
    }

    .ps-verdict.strong {
      background: #d9f7df;
      color: #12652b;
    }

    .ps-verdict.good {
      background: #e2f4ff;
      color: #075985;
    }

    .ps-verdict.maybe {
      background: #fff3cd;
      color: #856404;
    }

    .ps-verdict.avoid {
      background: #ffe0e0;
      color: #9b1c1c;
    }

    .ps-disclaimer {
      font-size: 12px;
      color: #6b7280;
      line-height: 1.5;
      margin-top: 16px;
    }

  `;

  document.head.appendChild(style);

})();
