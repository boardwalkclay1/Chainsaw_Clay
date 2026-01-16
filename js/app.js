/* ============================================================
   1. CSS LEAF CURSOR (NO PNG)
   ------------------------------------------------------------
   A pure CSS leaf that follows the mouse smoothly.
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.createElement("div");
  cursor.id = "leaf-cursor";
  document.body.appendChild(cursor);

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + 6 + "px";
    cursor.style.top = e.clientY + 6 + "px";
  });
});


/* ============================================================
   2. FALLING LEAVES (CSS‑DRAWN)
   ------------------------------------------------------------
   Leaves fall on mouse move + click.
   Uses CSS leaf shape from style.css.
============================================================ */
function spawnLeaf(x, y, wind = 0) {
  const leaf = document.createElement("div");
  leaf.className = "falling-leaf";

  leaf.style.left = x + "px";
  leaf.style.top = y + "px";

  // Add wind drift
  leaf.style.setProperty("--wind", wind + "px");

  document.body.appendChild(leaf);

  setTimeout(() => leaf.remove(), 4000);
}

// Mouse movement leaves
document.addEventListener("mousemove", (e) => {
  if (Math.random() < 0.05) {
    const wind = (Math.random() * 40) - 20;
    spawnLeaf(e.clientX, e.clientY, wind);
  }
});

// Click burst
document.addEventListener("click", (e) => {
  for (let i = 0; i < 6; i++) {
    const wind = (Math.random() * 60) - 30;
    spawnLeaf(
      e.clientX + (Math.random() * 40 - 20),
      e.clientY + (Math.random() * 40 - 20),
      wind
    );
  }
});


/* ============================================================
   3. LOADING SCREEN LEAVES
   ------------------------------------------------------------
   Continuous falling leaves for loading.html
============================================================ */
function startLoadingLeaves() {
  const container = document.getElementById("loading-leaf-container");
  if (!container) return;

  setInterval(() => {
    const leaf = document.createElement("div");
    leaf.className = "loading-leaf";

    leaf.style.left = Math.random() * window.innerWidth + "px";
    leaf.style.top = "-40px";

    container.appendChild(leaf);

    setTimeout(() => leaf.remove(), 3000);
  }, 180);
}

startLoadingLeaves();


/* ============================================================
   4. ADMIN TAP UNLOCK
============================================================ */
let tapCount = 0;
const tapArea = document.getElementById("admin-tap");

if (tapArea) {
  tapArea.addEventListener("click", () => {
    tapCount++;
    if (tapCount >= 4) window.location.href = "admin.html";
    setTimeout(() => tapCount = 0, 1500);
  });
}


/* ============================================================
   5. CRM SYSTEM (Leads, Clients, Jobs, Contracts, Payments)
   ------------------------------------------------------------
   Your full CRM logic stays intact.
   This section plugs into your existing pages.
============================================================ */

const CRM = {
  leads: JSON.parse(localStorage.getItem("crm_leads") || "[]"),
  clients: JSON.parse(localStorage.getItem("crm_clients") || "[]"),
  jobs: JSON.parse(localStorage.getItem("crm_jobs") || "[]"),
  contracts: JSON.parse(localStorage.getItem("crm_contracts") || "[]"),
  payments: JSON.parse(localStorage.getItem("crm_payments") || "[]"),
  notifications: JSON.parse(localStorage.getItem("crm_notifications") || "[]"),

  save() {
    localStorage.setItem("crm_leads", JSON.stringify(this.leads));
    localStorage.setItem("crm_clients", JSON.stringify(this.clients));
    localStorage.setItem("crm_jobs", JSON.stringify(this.jobs));
    localStorage.setItem("crm_contracts", JSON.stringify(this.contracts));
    localStorage.setItem("crm_payments", JSON.stringify(this.payments));
    localStorage.setItem("crm_notifications", JSON.stringify(this.notifications));
  },

  notify(message) {
    this.notifications.unshift({
      id: Date.now(),
      message,
      time: new Date().toLocaleString()
    });
    this.save();
  }
};


/* ============================================================
   6. PAGE‑AWARE RENDERERS
============================================================ */

function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

function renderLeads() {
  const table = document.querySelector(".lead-table");
  if (!table) return;

  CRM.leads.forEach((lead) => {
    const row = document.createElement("div");
    row.className = "table-row";
    row.innerHTML = `
      <div>${lead.name}</div>
      <div>${lead.phone}</div>
      <div>${lead.service}</div>
      <div>${lead.status}</div>
    `;
    table.appendChild(row);
  });
}

function renderClients() {
  const table = document.querySelector(".client-table");
  if (!table) return;

  CRM.clients.forEach((client) => {
    const row = document.createElement("div");
    row.className = "table-row";
    row.innerHTML = `
      <div>${client.name}</div>
      <div>${client.phone}</div>
      <div>${client.email || ""}</div>
      <div><a href="client-profile.html?clientId=${client.id}">Open</a></div>
    `;
    table.appendChild(row);
  });
}

function renderNotifications() {
  const list = document.querySelector(".notification-list");
  if (!list) return;

  list.innerHTML = "";
  CRM.notifications.forEach((n) => {
    const item = document.createElement("div");
    item.className = "notification-item";
    item.textContent = `${n.time}: ${n.message}`;
    list.appendChild(item);
  });
}


/* ============================================================
   7. INITIALIZE PAGE LOGIC
============================================================ */
renderLeads();
renderClients();
renderNotifications();
startLoadingLeaves();
