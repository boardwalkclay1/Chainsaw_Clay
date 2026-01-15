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
  payments: JSON.parse(localStorage.getItem("crm_payments") || "[]"),
  contracts: JSON.parse(localStorage.getItem("crm_contracts") || "[]"),

  save() {
    localStorage.setItem("crm_leads", JSON.stringify(this.leads));
    localStorage.setItem("crm_clients", JSON.stringify(this.clients));
    localStorage.setItem("crm_jobs", JSON.stringify(this.jobs));
    localStorage.setItem("crm_notifications", JSON.stringify(this.notifications));
    localStorage.setItem("crm_payments", JSON.stringify(this.payments));
    localStorage.setItem("crm_contracts", JSON.stringify(this.contracts));
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

/* ===========================
   ESTIMATE FORM → LEAD
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
   LEADS PAGE RENDER
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

/* ===========================
   CLIENT CREATION FROM LEADS (SIMPLE)
=========================== */
function ensureClientFromLead(lead) {
  let client = CRM.clients.find(c => c.email === lead.email && lead.email);
  if (!client) {
    client = {
      id: Date.now(),
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      address: lead.address,
      notes: "",
      jobs: []
    };
    CRM.clients.push(client);
    CRM.notify(`New client created: ${client.name}`);
    CRM.save();
  }
  return client;
}

/* ===========================
   CLIENTS PAGE RENDER
=========================== */
function renderClients() {
  const table = document.querySelector(".client-table");
  if (!table) return;

  CRM.clients.forEach((client) => {
    const row = document.createElement("div");
    row.className = "client-row";
    row.innerHTML = `
      <div>${client.name}</div>
      <div>${client.phone}</div>
      <div>${client.email || ""}</div>
      <div><a href="client-profile.html?clientId=${client.id}">Open</a></div>
    `;
    table.appendChild(row);
  });
}

/* ===========================
   CLIENT PROFILE PAGE
=========================== */
function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

function renderClientProfile() {
  const profileSection = document.querySelector(".client-profile");
  if (!profileSection) return;

  const clientId = parseInt(getQueryParam("clientId"), 10);
  const client = CRM.clients.find(c => c.id === clientId) || CRM.clients[0];

  if (!client) return;

  const infoDiv = profileSection.querySelector(".client-info");
  if (infoDiv) {
    infoDiv.innerHTML = `
      <p><strong>Name:</strong> ${client.name}</p>
      <p><strong>Phone:</strong> ${client.phone}</p>
      <p><strong>Email:</strong> ${client.email || ""}</p>
      <p><strong>Address:</strong> ${client.address || ""}</p>
    `;
  }

  const jobList = profileSection.querySelector(".job-list");
  if (jobList) {
    jobList.innerHTML = "";
    const jobs = CRM.jobs.filter(j => j.clientId === client.id);
    jobs.forEach(job => {
      const item = document.createElement("div");
      item.className = "job-item";
      item.innerHTML = `
        <p>${job.service} – $${job.price}</p>
        <a href="job-details.html?jobId=${job.id}">View Job</a>
      `;
      jobList.appendChild(item);
    });
  }

  const notesArea = profileSection.querySelector("textarea");
  if (notesArea) {
    notesArea.value = client.notes || "";
    notesArea.addEventListener("change", () => {
      client.notes = notesArea.value;
      CRM.save();
      CRM.notify(`Updated notes for ${client.name}`);
    });
  }
}

/* ===========================
   JOB DETAILS PAGE
=========================== */
function renderJobDetails() {
  const jobSection = document.querySelector(".job-details");
  if (!jobSection) return;

  const jobId = parseInt(getQueryParam("jobId"), 10);
  const job = CRM.jobs.find(j => j.id === jobId) || CRM.jobs[0];
  if (!job) return;

  const infoDiv = jobSection.querySelector(".job-info");
  if (infoDiv) {
    infoDiv.innerHTML = `
      <p><strong>Service:</strong> ${job.service}</p>
      <p><strong>Price:</strong> $${job.price}</p>
      <p><strong>Status:</strong> ${job.status}</p>
      <p><strong>Scheduled Date:</strong> ${job.date || "Not Set"}</p>
    `;
  }

  const descArea = jobSection.querySelector("textarea");
  if (descArea) {
    descArea.value = job.description || "";
    descArea.addEventListener("change", () => {
      job.description = descArea.value;
      CRM.save();
      CRM.notify(`Updated job description for job #${job.id}`);
    });
  }
}

/* ===========================
   PAYMENTS PAGE
=========================== */
function renderPayments() {
  const table = document.querySelector(".payment-table");
  if (!table) return;

  CRM.payments.forEach((p) => {
    const row = document.createElement("div");
    row.className = "payment-row";
    row.innerHTML = `
      <div>${p.clientName}</div>
      <div>${p.service}</div>
      <div>$${p.amount}</div>
      <div>${p.status}</div>
    `;
    table.appendChild(row);
  });
}

/* ===========================
   SIMPLE PAYMENT CREATION (FROM JOBS)
=========================== */
function createPaymentForJob(jobId, amount, status = "Pending") {
  const job = CRM.jobs.find(j => j.id === jobId);
  if (!job) return;

  const client = CRM.clients.find(c => c.id === job.clientId);
  const payment = {
    id: Date.now(),
    jobId,
    clientId: job.clientId,
    clientName: client ? client.name : "Unknown",
    service: job.service,
    amount,
    status
  };

  CRM.payments.push(payment);
  CRM.notify(`Payment created for ${payment.clientName}: $${amount}`);
  CRM.save();
}

/* ===========================
   CONTRACT GENERATOR (BASIC)
=========================== */
function generateContract(jobId) {
  const job = CRM.jobs.find(j => j.id === jobId);
  if (!job) return;

  const client = CRM.clients.find(c => c.id === job.clientId);
  const contract = {
    id: Date.now(),
    jobId,
    clientId: job.clientId,
    content: `
      Chainsaw Clay's Tree Service Contract

      Client: ${client ? client.name : ""}
      Address: ${client ? client.address : ""}

      Service: ${job.service}
      Description: ${job.description || ""}

      Price: $${job.price}
      Payment Terms: Deposit + balance on completion.

      Liability: Client acknowledges tree work involves inherent risks...
    `,
    signed: false
  };

  CRM.contracts.push(contract);
  CRM.notify(`Contract generated for ${client ? client.name : "client"}`);
  CRM.save();

  return contract;
}

/* ===========================
   SIGNATURE PAD (BASIC CANVAS)
=========================== */
function initSignaturePad() {
  const canvas = document.getElementById("signature-pad");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let drawing = false;

  canvas.addEventListener("mousedown", () => { drawing = true; });
  canvas.addEventListener("mouseup", () => { drawing = false; ctx.beginPath(); });
  canvas.addEventListener("mouseleave", () => { drawing = false; ctx.beginPath(); });

  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  });
}

/* ===========================
   NOTIFICATIONS PAGE
=========================== */
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

/* ===========================
   SETTINGS PAGE (STATIC SAVE)
=========================== */
function initSettings() {
  const section = document.querySelector(".settings-section");
  if (!section) return;

  const phoneInput = section.querySelector('input[type="text"]');
  const emailInput = section.querySelector('input[type="email"]');
  const areaTextarea = section.querySelectorAll("textarea")[0];
  const servicesTextarea = section.querySelectorAll("textarea")[1];
  const saveBtn = section.querySelector(".btn");

  const settings = JSON.parse(localStorage.getItem("crm_settings") || "{}");

  if (phoneInput) phoneInput.value = settings.phone || "";
  if (emailInput) emailInput.value = settings.email || "";
  if (areaTextarea) areaTextarea.value = settings.area || "";
  if (servicesTextarea) servicesTextarea.value = settings.services || "";

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const newSettings = {
        phone: phoneInput ? phoneInput.value : "",
        email: emailInput ? emailInput.value : "",
        area: areaTextarea ? areaTextarea.value : "",
        services: servicesTextarea ? servicesTextarea.value : ""
      };
      localStorage.setItem("crm_settings", JSON.stringify(newSettings));
      CRM.notify("Settings updated");
      alert("Settings saved.");
    });
  }
}

/* ===========================
   INITIALIZE PAGE‑SPECIFIC LOGIC
=========================== */
renderLeads();
renderClients();
renderClientProfile();
renderJobDetails();
renderPayments();
renderNotifications();
initSignaturePad();
initSettings();
