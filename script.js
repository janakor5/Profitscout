const sale = document.getElementById("sale");
const cost = document.getElementById("cost");
const fee = document.getElementById("fee");
const saleOut = document.getElementById("saleOut");
const costOut = document.getElementById("costOut");
const feeOut = document.getElementById("feeOut");
const profit = document.getElementById("profit");
const margin = document.getElementById("margin");

function money(n){ return "$" + Math.round(n); }
function updateCalc(){
  const s = Number(sale.value), c = Number(cost.value), f = Number(fee.value);
  const p = s - c - f;
  const m = s > 0 ? (p / s) * 100 : 0;
  saleOut.textContent = money(s);
  costOut.textContent = money(c);
  feeOut.textContent = money(f);
  profit.textContent = money(p);
  margin.textContent = Math.round(m) + "%";
}
[sale,cost,fee].forEach(x => x.addEventListener("input", updateCalc));
updateCalc();

document.getElementById("leadForm").addEventListener("submit", function(e){
  e.preventDefault();
  const msg = document.getElementById("formMessage");
  msg.textContent = "Thanks! Your request is captured in this demo. Connect this form to your email/CRM before going live.";
  this.reset();
});
