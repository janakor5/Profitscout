===========================================================
*/


/* =========================================================
   STARTUP
========================================================= */

(function () {

    function startProfitScout() {

        console.log("ProfitScout: JavaScript started.");

        setupProductSearch();
        setupCalculator();
        setupResearchButtons();

        /*
         * Run calculator once when the page loads.
         */
        calculateProfit();

        console.log("ProfitScout: All systems ready.");
    }


    /*
     * Works whether this script loads before or after
     * the page has finished loading.
     */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startProfitScout);
    } else {
        startProfitScout();
    }


    /* =====================================================
       PRODUCT SEARCH
    ===================================================== */

    function setupProductSearch() {

        var buttons = Array.prototype.slice.call(
            document.querySelectorAll("button, a")
        );

        buttons.forEach(function (button) {

            var text = (
                button.textContent ||
                button.innerText ||
                ""
            ).trim().toLowerCase();

            if (
                text.includes("scout products") ||
                text.includes("search products") ||
                text.includes("find products")
            ) {

                /*
                 * Remove old listeners by replacing the element.
                 * This prevents duplicate old code from firing.
                 */
                var cleanButton = button.cloneNode(true);

                button.parentNode.replaceChild(
                    cleanButton,
                    button
                );

                cleanButton.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();

                        searchProducts(cleanButton);

                    }
                );

            }

        });

        /*
         * Also support forms.
         */
        document.querySelectorAll("form").forEach(function (form) {

            form.addEventListener("submit", function (event) {

                var submitButton = form.querySelector(
                    'button[type="submit"], input[type="submit"]'
                );

                if (!submitButton) {
                    return;
                }

                var text = (
                    submitButton.textContent ||
                    submitButton.value ||
                    ""
                ).toLowerCase();

                if (
                    text.includes("scout") ||
                    text.includes("search")
                ) {

                    event.preventDefault();

                    searchProducts(submitButton);
                }

            });

        });

    }


    function findProductInput(button) {

        /*
         * First look inside the same form/card.
         */
        var parent = button;

        for (var i = 0; i < 6 && parent; i++) {

            var localInput = parent.querySelector &&
                parent.querySelector(
                    'input[type="text"], input[type="search"]'
                );

            if (localInput) {
                return localInput;
            }

            parent = parent.parentElement;
        }


        /*
         * Look for likely product/category fields.
         */
        var inputs = Array.prototype.slice.call(
            document.querySelectorAll(
                'input[type="text"], input[type="search"]'
            )
        );


        for (var j = 0; j < inputs.length; j++) {

            var field = inputs[j];

            var placeholder = (
                field.getAttribute("placeholder") || ""
            ).toLowerCase();

            var name = (
                field.getAttribute("name") || ""
            ).toLowerCase();

            var id = (
                field.id || ""
            ).toLowerCase();

            if (
                placeholder.includes("product") ||
                placeholder.includes("category") ||
                placeholder.includes("search") ||
                name.includes("product") ||
                name.includes("category") ||
                id.includes("product") ||
                id.includes("category") ||
                id.includes("search")
            ) {

                return field;
            }

        }


        /*
         * Last resort:
         * use the first visible text input.
         */
        for (var k = 0; k < inputs.length; k++) {

            if (
                inputs[k].offsetParent !== null
            ) {
                return inputs[k];
            }

        }

        return null;
    }


    function searchProducts(button) {

        var input = findProductInput(button);

        if (!input) {

            alert(
                "ProfitScout couldn't find the product search box."
            );

            return;
        }


        var product = String(input.value || "").trim();


        if (!product) {

            alert(
                "Please enter a product or category first."
            );

            input.focus();

            return;
        }


        /*
         * Google Shopping.
         */
        var googleShoppingURL =
            "https://www.google.com/search?tbm=shop&q=" +
            encodeURIComponent(product);


        console.log(
            "ProfitScout searching for:",
            product
        );


        /*
         * Navigate directly.
         *
         * This avoids popup blockers that can stop
         * window.open() on mobile browsers.
         */
        window.location.href = googleShoppingURL;

    }


    /* =====================================================
       CALCULATOR
    ===================================================== */

    function setupCalculator() {

        var ids = [
            "sell",
            "buy",
            "referral",
            "fulfillment",
            "other",
            "monthlySales"
        ];


        ids.forEach(function (id) {

            var element = document.getElementById(id);

            if (!element) {
                return;
            }


            element.addEventListener(
                "input",
                calculateProfit
            );

            element.addEventListener(
                "change",
                calculateProfit
            );

        });

    }


    function numberValue(id) {

        var element = document.getElementById(id);

        if (!element) {
            return 0;
        }

        var value = parseFloat(element.value);

        if (isNaN(value)) {
            return 0;
        }

        return value;
    }


    function setText(id, value) {

        var element = document.getElementById(id);

        if (!element) {
            return;
        }

        element.textContent = value;
    }


    function money(value) {

        if (!isFinite(value)) {
            value = 0;
        }

        return value.toLocaleString(
            "en-US",
            {
                style: "currency",
                currency: "USD"
            }
        );

    }


    function calculateProfit() {

        /*
         * Input values.
         */
        var sell = numberValue("sell");

        var buy = numberValue("buy");

        var referral = numberValue("referral");

        var fulfillment = numberValue("fulfillment");

        var other = numberValue("other");

        var monthlySales = numberValue("monthlySales");


        /*
         * Total fees/costs.
         */
        var totalCosts =
            buy +
            referral +
            fulfillment +
            other;


        /*
         * Net profit per item.
         */
        var netProfit =
            sell -
            totalCosts;


        /*
         * Margin.
         */
        var margin = 0;

        if (sell > 0) {

            margin =
                (netProfit / sell) * 100;

        }


        /*
         * ROI.
         */
        var roi = 0;

        if (totalCosts > 0) {

            roi =
                (netProfit / totalCosts) * 100;

        }


        /*
         * Monthly profit.
         */
        var monthlyProfit =
            netProfit * monthlySales;


        /*
         * Update visible fields.
         */
        setText(
            "psNetProfit",
            money(netProfit)
        );


        setText(
            "psNetMargin",
            Math.round(margin) + "%"
        );


        setText(
            "psROI",
            Math.round(roi) + "%"
        );


        setText(
            "psMonthlyProfit",
            money(monthlyProfit)
        );


        /*
         * Optional Amazon fee output.
         */
        var amazonFee = document.getElementById(
            "psAmazonFee"
        );

        if (amazonFee) {

            /*
             * If referral fee is entered directly,
             * display that amount.
             */
            amazonFee.textContent =
                money(referral);

        }


        /*
         * Verdict.
         */
        updateVerdict(
            netProfit,
            margin,
            roi
        );

    }


    /* =====================================================
       VERDICT
    ===================================================== */

    function updateVerdict(
        netProfit,
        margin,
        roi
    ) {

        var verdict = document.getElementById(
            "psVerdict"
        );

        if (!verdict) {
            return;
        }


        /*
         * Remove previous classes.
         */
        verdict.classList.remove(
            "ps-verdict-avoid",
            "ps-verdict-maybe",
            "ps-verdict-worth",
            "ps-verdict-strong"
        );


        /*
         * Losing money.
         */
        if (netProfit <= 0) {

            verdict.textContent =
                "⛔ AVOID — This product loses money.";

            verdict.classList.add(
                "ps-verdict-avoid"
            );

            return;
        }


        /*
         * Excellent opportunity.
         */
        if (
            roi >= 100 &&
            margin >= 30
        ) {

            verdict.textContent =
                "🔥 STRONG BUY — Excellent profit potential.";

            verdict.classList.add(
                "ps-verdict-strong"
            );

            return;
        }


        /*
         * Good opportunity.
         */
        if (
            roi >= 50 &&
            margin >= 20
        ) {

            verdict.textContent =
                "✅ WORTH IT — Good profit potential.";

            verdict.classList.add(
                "ps-verdict-worth"
            );

            return;
        }


        /*
         * Everything else.
         */
        verdict.textContent =
            "⚠️ MAYBE — Review the numbers carefully.";

        verdict.classList.add(
            "ps-verdict-maybe"
        );

    }


    /* =====================================================
       RESEARCH BUTTONS
    ===================================================== */

    function setupResearchButtons() {

        document.addEventListener(
            "click",
            function (event) {

                var element = event.target.closest(
                    "button, a"
                );

                if (!element) {
                    return;
                }


                var text = (
                    element.textContent ||
                    element.innerText ||
                    ""
                ).trim().toLowerCase();


                if (
                    text.includes("research product") ||
                    text.includes("research")
                ) {

                    /*
                     * Don't hijack unrelated links.
                     */
                    if (
                        !text.includes("product") &&
                        !text.includes("research")
                    ) {
                        return;
                    }


                    event.preventDefault();

                    var product =
                        getProductName(element);


                    if (
                        !product ||
                        product === "product research"
                    ) {

                        product = prompt(
                            "What product do you want to research?"
                        );

                    }


                    if (product) {

                        showResearchModal(
                            product
                        );

                    }

                }

            }
        );

    }


    function getProductName(element) {

        var current = element;


        /*
         * Search nearby headings.
         */
        for (
            var i = 0;
            i < 8 && current;
            i++
        ) {

            var heading = current.querySelector &&
                current.querySelector(
                    "h1, h2, h3, h4, .product-name, .ps-product-name"
                );


            if (
                heading &&
                heading.textContent.trim()
            ) {

                return heading.textContent.trim();

            }


            current =
                current.parentElement;

        }


        return "Product Research";

    }


    /* =====================================================
       RESEARCH MODAL
    ===================================================== */

    function showResearchModal(product) {

        /*
         * Remove an existing modal.
         */
        var existing = document.getElementById(
            "profitScoutResearchModal"
        );

        if (existing) {
            existing.remove();
        }


        /*
         * Create overlay.
         */
        var overlay =
            document.createElement("div");

        overlay.id =
            "profitScoutResearchModal";


        overlay.style.position =
            "fixed";

        overlay.style.inset =
            "0";

        overlay.style.background =
            "rgba(10,15,30,.75)";

        overlay.style.zIndex =
            "999999";

        overlay.style.display =
            "flex";

        overlay.style.alignItems =
            "center";

        overlay.style.justifyContent =
            "center";

        overlay.style.padding =
            "20px";

        overlay.style.boxSizing =
            "border-box";


        /*
         * Modal.
         */
        var modal =
            document.createElement("div");


        modal.style.background =
            "#ffffff";

        modal.style.width =
            "min(560px, 100%)";

        modal.style.maxHeight =
            "90vh";

        modal.style.overflowY =
            "auto";

        modal.style.borderRadius =
            "22px";

        modal.style.padding =
            "28px";

        modal.style.boxSizing =
            "border-box";

        modal.style.position =
            "relative";


        /*
         * Close button.
         */
        var close =
            document.createElement("button");

        close.type =
            "button";

        close.textContent =
            "×";

        close.setAttribute(
            "aria-label",
            "Close"
        );

        close.style.position =
            "absolute";

        close.style.right =
            "16px";

        close.style.top =
            "10px";

        close.style.border =
            "0";

        close.style.background =
            "transparent";

        close.style.fontSize =
            "34px";

        close.style.cursor =
            "pointer";


        close.addEventListener(
            "click",
            function () {
                overlay.remove();
            }
        );


        /*
         * Title.
         */
        var title =
            document.createElement("h2");

        title.textContent =
            "Research: " + product;

        title.style.marginTop =
            "0";

        title.style.paddingRight =
            "35px";


        /*
         * Description.
         */
        var description =
            document.createElement("p");

        description.textContent =
            "Research this product across major shopping sources.";

        description.style.color =
            "#667085";


        /*
         * Search buttons.
         */
        var sources = [
            {
                name: "Google Shopping",
                url:
                    "https://www.google.com/search?tbm=shop&q="
            },
            {
                name: "Amazon",
                url:
                    "https://www.amazon.com/s?k="
            },
            {
                name: "eBay",
                url:
                    "https://www.ebay.com/sch/i.html?_nkw="
            },
            {
                name: "Walmart",
                url:
                    "https://www.walmart.com/search?q="
            }
        ];


        sources.forEach(
            function (source) {

                var link =
                    document.createElement("a");

                link.textContent =
                    "Search " + source.name;

                link.href =
                    source.url +
                    encodeURIComponent(product);

                link.target =
                    "_blank";

                link.rel =
                    "noopener noreferrer";


                link.style.display =
                    "block";

                link.style.padding =
                    "14px 16px";

                link.style.marginBottom =
                    "10px";

                link.style.borderRadius =
                    "12px";

                link.style.background =
                    "#f3f4f6";

                link.style.color =
                    "#111827";

                link.style.textDecoration =
                    "none";

                link.style.fontWeight =
                    "700";


                modal.appendChild(link);

            }
        );


        modal.appendChild(close);

        modal.appendChild(title);

        modal.appendChild(description);

        overlay.appendChild(modal);

        document.body.appendChild(overlay);


        /*
         * Close when clicking outside.
         */
        overlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === overlay
                ) {

                    overlay.remove();

                }

            }
        );

    }


})();


/* =========================================================
   PROFITSCOUT END
========================================================= */
