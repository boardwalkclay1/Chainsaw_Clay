/* ===========================
   ADMIN 4‑TAP UNLOCK
=========================== */
let tapCount = 0;
const tapArea = document.getElementById("admin-tap");

if (tapArea) {
  tapArea.addEventListener("click", () => {
    tapCount++;

    if (tapCount >= 4) {
      window.location.href = "admin.html";
    }

    setTimeout(() => {
      tapCount = 0;
    }, 1500);
  });
}

/* ===========================
   CRM STORAGE STRUCTURE
=========================== */
const CRM = {
  leads: JSON.parse(localStorage.getItem("crm_leads") || "[]"),
  clients: JSON.parse(localStorage.getItem("crm_clients") || "[]"),
  jobs: JSON.parse(localStorage.getItem("crm_jobs") || "[]"),
  notifications: JSON.parse(localStorage.getItem("crm_notifications") || "[]"),

  save() {
    localStorage.setItem("crm_leads", JSON.stringify(this.leads));
    localStorage.setItem("crm_clients", JSON.stringify(this.clients));
    localStorage.setItem("crm_jobs", JSON.stringify(this.jobs));
    localStorage.setItem("crm_notifications", JSON.stringify(this.notifications));
  },

  notify(message) {
    this.notifications.unshift({
      message,
      time: new Date().toLocaleString()
    });
    this.save();
  }
};

/* ===========================
   ESTIMATE FORM HANDLER
=========================== */
const estimateForm = document.getElementById("estimate-form");

if (estimateForm) {
  estimateForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(estimateForm);

    const lead = {
      id: Date.now(),
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      service: formData.get("service"),
      notes: formData.get("notes"),
      status: "New"
    };

    CRM.leads.push(lead);
    CRM.notify(`New estimate request from ${lead.name}`);
    CRM.save();

    alert("Your estimate request has been submitted!");
    estimateForm.reset();
  });
}

/* ===========================
   PAGE‑AWARE RENDERING
=========================== */
function renderLeads() {
  const table = document.querySelector(".lead-table");
  if (!table) return;

  CRM.leads.forEach((lead) => {
    const row = document.createElement("div");
    row.className = "lead-row";
    row.innerHTML = `
      <div>${lead.name}</div>
      <div>${lead.phone}</div>
      <div>${lead.service}</div>
      <div>${lead.status}</div>
    `;
    table.appendChild(row);
  });
}

function renderNotifications() {
  const list = document.querySelector(".notification-list");
  if (!list) return;

  CRM.notifications.forEach((n) => {
    const item = document.createElement("div");
    item.className = "notification-item";
    item.textContent = `${n.time}: ${n.message}`;
    list.appendChild(item);
  });
}

renderLeads();
renderNotifications();
