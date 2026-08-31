/* =========================================================
   ProfitScout v2
   Product research starter engine
   ========================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "profitscout_saved_products";

  const productDatabase = {
    kitchen: [
      {
        name: "Reusable Silicone Food Storage Bags",
        buy: 3.5,
        sell: 16.99,
        competition: "Medium",
        demand: "High"
      },
      {
        name: "Digital Kitchen Scale",
        buy: 7,
        sell: 24.99,
        competition: "Medium",
        demand: "High"
      },
      {
        name: "Oil Sprayer Bottle",
        buy: 4,
        sell: 18.99,
        competition: "Medium",
        demand: "High"
      }
    ],

    toys: [
      {
        name: "Magnetic Building Blocks",
        buy: 8,
        sell: 29.99,
        competition: "Medium",
        demand: "High"
      },
      {
        name: "Kids Puzzle Set",
        buy: 5,
        sell: 19.99,
        competition: "Low",
        demand: "Medium"
      },
      {
        name: "Reusable Water Drawing Mat",
        buy: 6,
        sell: 22.99,
        competition: "Medium",
        demand: "High"
      }
    ],

    fitness: [
      {
        name: "Resistance Band Set",
        buy: 6,
        sell: 24.99,
        competition: "High",
        demand: "High"
      },
      {
        name: "Adjustable Hand Gripper",
        buy: 3,
        sell: 14.99,
        competition: "Medium",
        demand: "Medium"
      },
      {
        name: "Workout Resistance Handles",
        buy: 5,
        sell: 21.99,
        competition: "Medium",
        demand: "High"
      }
    ],

    beauty: [
      {
        name: "Reusable Makeup Sponges",
        buy: 3,
        sell: 15.99,
        competition: "High",
        demand: "High"
      },
      {
        name: "Travel Cosmetic Organizer",
        buy: 7,
        sell: 24.99,
        competition: "Medium",
        demand: "High"
      },
      {
        name: "Facial Ice Roller",
        buy: 4,
        sell: 19.99,
        competition: "High",
        demand: "High"
      }
    ],

    pets: [
      {
        name: "Slow Feeder Dog Bowl",
        buy: 6,
        sell: 24.99,
        competition: "Medium",
        demand: "High"
      },
      {
        name: "Pet Grooming Glove",
        buy: 3,
        sell: 14.99,
        competition: "Medium",
        demand: "High"
      },
      {
        name: "Interactive Pet Toy",
        buy: 5,
        sell: 21.99,
        competition: "High",
        demand: "High"
      }
    ],

    home: [
      {
        name: "Motion Sensor Closet Light",
        buy: 5,
        sell: 19.99,
        competition: "Medium",
        demand: "High"
      },
      {
        name: "Drawer Organizer Set",
        buy: 6,
        sell: 22.99,
        competition: "Medium",
        demand: "High"
      },
      {
        name: "Cable Management Box",
        buy: 5,
        sell: 18.99,
        competition: "Low",
        demand: "Medium"
      }
    ],

    electronics: [
      {
        name: "USB Rechargeable Reading Light",
        buy: 5,
        sell: 19.99,
        competition: "Medium",
        demand: "High"
      },
      {
        name: "Desktop Phone Stand",
        buy: 3,
        sell: 14.99,
        competition: "High",
        demand: "High"
      },
      {
        name: "Cable Organizer Kit",
        buy: 3,
        sell: 16.99,
        competition: "Medium",
        demand: "High"
      }
    ]
  };

  /* ---------------------------------------------------------
     Utility functions
  --------------------------------------------------------- */

  function money(value) {
    return "$" + Number(value).toFixed(2);
  }

  function getSavedProducts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
      return [];
    }
  }

  function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }

  function calculateProduct(product) {
    const profit = product.sell - product.buy;
    const margin = (profit / product.sell) * 100;

    let score = 50;

    if (margin >= 60) score += 20;
    else if (margin >= 45) score += 15;
    else if (margin >= 30) score += 10;

    if (product.demand === "High") score += 15;
    if (product.competition === "Low") score += 10;
    else if (product.competition === "Medium") score += 5;

    score = Math.min(score, 99);

    return {
      ...product,
      profit,
      margin,
      score
    };
  }

  function findCategory(input) {
    const text = input.toLowerCase();

    const aliases = {
      kitchen: ["kitchen", "cooking", "food", "restaurant"],
      toys: ["toy", "toys", "kids", "children", "game"],
      fitness: ["fitness", "gym", "workout", "exercise", "sports"],
      beauty: ["beauty", "makeup", "cosmetic", "skincare"],
      pets: ["pet", "pets", "dog", "cat", "animal"],
      home: ["home", "house", "storage", "organization", "organizing"],
      electronics: [
        "electronics",
        "tech",
        "phone",
        "computer",
        "usb",
        "gadget"
      ]
    };

    for (const category in aliases) {
      if (aliases[category].some(word => text.includes(word))) {
        return category;
      }
    }

    return null;
  }

  /* ---------------------------------------------------------
     Product scouting
  --------------------------------------------------------- */

  window.scoutProducts = function () {
    const input = document.getElementById("category");
    const results = document.getElementById("results");

    if (!input || !results) return;

    const query = input.value.trim();

    if (!query) {
      results.innerHTML = `
        <div class="scout-message">
          <strong>Enter a category first.</strong>
          <p>
            Try kitchen, toys, fitness, beauty, pets,
            home, or electronics.
          </p>
        </div>
      `;
      return;
    }

    const category = findCategory(query);

    if (!category) {
      results.innerHTML = `
        <div class="scout-message">
          <strong>We're scouting "${escapeHtml(query)}".</strong>
          <p>
            We don't have a matching starter category yet.
            Try <strong>kitchen</strong>, <strong>toys</strong>,
            <strong>fitness</strong>, <strong>beauty</strong>,
            <strong>pets</strong>, <strong>home</strong>, or
            <strong>electronics</strong>.
          </p>
        </div>
      `;
      return;
    }

    const products = productDatabase[category]
      .map(calculateProduct)
      .sort((a, b) => b.score - a.score);

    renderResults(products, category);
  };

  function renderResults(products, category) {
    const results = document.getElementById("results");

    if (!results) return;

    results.innerHTML = `
      <div class="results-header">
        <div>
          <div class="eyebrow">SCOUT RESULTS</div>
          <h3>
            ${capitalize(category)} opportunities
          </h3>
        </div>

        <div class="result-count">
          ${products.length} opportunities
        </div>
      </div>

      <div class="product-results">
        ${products.map(renderProductCard).join("")}
      </div>

      <p class="research-note">
        <strong>Important:</strong>
        These figures are estimates for research purposes.
        Always verify current supplier costs, marketplace fees,
        shipping, competition and demand before purchasing inventory.
      </p>

      <div class="saved-area">
        <button
          class="button secondary"
          type="button"
          onclick="showSavedProducts()">
          View Saved Products
        </button>
      </div>
    `;
  }

  function renderProductCard(product) {
    return `
      <article class="product-card">

        <div class="product-card-top">
          <span class="score">
            ${product.score}/100
          </span>

          <span class="demand">
            ${product.demand} demand
          </span>
        </div>

        <h3>${escapeHtml(product.name)}</h3>

        <div class="product-numbers">

          <div>
            <span>Estimated Buy</span>
            <strong>${money(product.buy)}</strong>
          </div>

          <div>
            <span>Estimated Sell</span>
            <strong>${money(product.sell)}</strong>
          </div>

          <div>
            <span>Est. Profit</span>
            <strong>${money(product.profit)}</strong>
          </div>

          <div>
            <span>Margin</span>
            <strong>${Math.round(product.margin)}%</strong>
          </div>

        </div>

        <div class="product-meta">
          <span>
            Competition: ${product.competition}
          </span>

          <span>
            Score: ${product.score}/100
          </span>
        </div>

        <button
          class="button primary save-product"
          type="button"
          onclick='saveProduct(${JSON.stringify(product)})'>
          Save Opportunity
        </button>

      </article>
    `;
  }

  /* ---------------------------------------------------------
     Saved products
  --------------------------------------------------------- */

  window.saveProduct = function (product) {
    const saved = getSavedProducts();

    const alreadySaved = saved.some(
      item => item.name === product.name
    );

    if (alreadySaved) {
      showNotice("This product is already saved.");
      return;
    }

    saved.push(product);
    saveProducts(saved);

    showNotice("Product saved to your scouting list!");
  };

  window.showSavedProducts = function () {
    const results = document.getElementById("results");

    if (!results) return;

    const saved = getSavedProducts();

    if (!saved.length) {
      results.innerHTML = `
        <div class="scout-message">
          <h3>No saved opportunities yet.</h3>
          <p>
            Scout some products and tap
            <strong>Save Opportunity</strong>
            when you find one you like.
          </p>
        </div>
      `;
      return;
    }

    results.innerHTML = `
      <div class="results-header">
        <div>
          <div class="eyebrow">MY SCOUTING LIST</div>
          <h3>Saved Opportunities</h3>
        </div>

        <button
          class="button secondary"
          type="button"
          onclick="clearSavedProducts()">
          Clear All
        </button>
      </div>

      <div class="product-results">
        ${saved.map((product, index) => `
          <article class="product-card">

            <span class="score">
              ${product.score}/100
            </span>

            <h3>${escapeHtml(product.name)}</h3>

            <div class="product-numbers">

              <div>
                <span>Buy</span>
                <strong>${money(product.buy)}</strong>
              </div>

              <div>
                <span>Sell</span>
                <strong>${money(product.sell)}</strong>
              </div>

              <div>
                <span>Profit</span>
                <strong>${money(product.profit)}</strong>
              </div>

              <div>
                <span>Margin</span>
                <strong>${Math.round(product.margin)}%</strong>
              </div>

            </div>

            <button
              class="button secondary"
              type="button"
              onclick="removeSavedProduct(${index})">
              Remove
            </button>

          </article>
        `).join("")}
      </div>
    `;
  };

  window.removeSavedProduct = function (index) {
    const saved = getSavedProducts();

    saved.splice(index, 1);

    saveProducts(saved);

    showSavedProducts();
  };

  window.clearSavedProducts = function () {
    if (!confirm("Clear all saved products?")) return;

    localStorage.removeItem(STORAGE_KEY);

    showSavedProducts();
  };

  /* ---------------------------------------------------------
     Pro waitlist
  --------------------------------------------------------- */

  window.showComingSoon = function () {
    const message = `
      <div class="scout-message">
        <h3>ProfitScout Pro is coming soon.</h3>
        <p>
          Pro will add advanced filters, saved research,
          deeper opportunity scoring and additional
          product research tools.
        </p>

        <button
          class="button primary"
          type="button"
          onclick="saveWaitlistInterest()">
          Join the Waitlist
        </button>
      </div>
    `;

    showNotice(message, true);
  };

  window.saveWaitlistInterest = function () {
    localStorage.setItem(
      "profitscout_waitlist",
      "interested"
    );

    showNotice(
      "You're on the ProfitScout Pro interest list!"
    );
  };

  /* ---------------------------------------------------------
     Helpful UI
  --------------------------------------------------------- */

  function showNotice(message, html = false) {
    let notice = document.getElementById("profitscout-notice");

    if (!notice) {
      notice = document.createElement("div");
      notice.id = "profitscout-notice";

      document.body.appendChild(notice);
    }

    if (html) {
      notice.innerHTML = message;
    } else {
      notice.textContent = message;
    }

    notice.classList.add("show");

    setTimeout(() => {
      notice.classList.remove("show");
    }, 4500);
  }

  function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* ---------------------------------------------------------
     Keyboard support
  --------------------------------------------------------- */

  document.addEventListener("DOMContentLoaded", function () {
    const category = document.getElementById("category");

    if (category) {
      category.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          window.scoutProducts();
        }
      });
    }

    /*
      Smooth scrolling for internal links.
    */

    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);

        if (target) {
          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      });
    });
  });

})();
