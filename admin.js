const API_BASE = 'http://localhost:3000/api';

let isLoggedIn = false;
let currentGuests = [];
let currentSettings = {};

// Toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  toastMessage.textContent = message;
  toast.className = `fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-2xl z-50 ${
    type === 'success' ? 'bg-green-600' : 'bg-red-600'
  } text-white`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
      isLoggedIn = true;
      document.getElementById('login-screen').classList.add('hidden');
      document.getElementById('dashboard-screen').classList.remove('hidden');
      loadDashboard();
    } else {
      errorEl.textContent = data.message;
      errorEl.classList.remove('hidden');
    }
  } catch (error) {
    errorEl.textContent = 'Connection error. Is the server running?';
    errorEl.classList.remove('hidden');
  }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  isLoggedIn = false;
  document.getElementById('dashboard-screen').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
});

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('border-emerald-900', 'text-emerald-950');
      b.classList.add('border-transparent', 'text-gray-600');
    });
    btn.classList.remove('border-transparent', 'text-gray-600');
    btn.classList.add('border-emerald-900', 'text-emerald-950');

    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    document.getElementById(`${tab}-tab`).classList.remove('hidden');
  });
});

// Load dashboard data
async function loadDashboard() {
  await Promise.all([loadGuests(), loadSettings()]);
}

// Load guests
async function loadGuests() {
  try {
    const response = await fetch(`${API_BASE}/guests`);
    const data = await response.json();

    if (data.success) {
      currentGuests = data.guests;
      renderGuestsTable();
      document.getElementById('total-guests').textContent = currentGuests.length;
    }
  } catch (error) {
    showToast('Failed to load guests', 'error');
  }
}

// Render guests table
function renderGuestsTable() {
  const tbody = document.getElementById('guests-table-body');

  if (currentGuests.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-4 py-8 text-center text-gray-500">
          <i class="fas fa-inbox text-4xl mb-3"></i>
          <p>No guests added yet. Click "Add Guest" to start.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = currentGuests.map(guest => `
    <tr class="hover:bg-gray-50">
      <td class="px-4 py-3 text-sm font-medium text-gray-900">${escapeHtml(guest.name)}</td>
      <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(guest.phone)}</td>
      <td class="px-4 py-3 text-sm text-gray-600">${new Date(guest.addedAt).toLocaleDateString()}</td>
      <td class="px-4 py-3 text-center space-x-2">
        <button onclick="sendInvitation('${guest.id}')" class="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
          <i class="fab fa-whatsapp mr-1"></i>Send
        </button>
        <button onclick="editGuest('${guest.id}')" class="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="deleteGuest('${guest.id}')" class="px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// Send invitation via WhatsApp
function sendInvitation(guestId) {
  const guest = currentGuests.find(g => g.id === guestId);
  if (!guest) return;

  let message = currentSettings.invitationMessage || '';
  message = message.replace(/\{\{guest_name\}\}/g, guest.name);
  message = message.replace(/\{\{invitation_url\}\}/g, currentSettings.invitationUrl || '');

  const whatsappUrl = `https://wa.me/${guest.phone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
  showToast(`Opening WhatsApp for ${guest.name}`);
}

// Add guest modal
document.getElementById('add-guest-btn').addEventListener('click', () => {
  document.getElementById('guest-modal-title').textContent = 'Add Guest';
  document.getElementById('guest-form').reset();
  document.getElementById('guest-id').value = '';
  document.getElementById('guest-modal').classList.remove('hidden');
});

// Edit guest
function editGuest(guestId) {
  const guest = currentGuests.find(g => g.id === guestId);
  if (!guest) return;

  document.getElementById('guest-modal-title').textContent = 'Edit Guest';
  document.getElementById('guest-id').value = guest.id;
  document.getElementById('guest-name').value = guest.name;
  document.getElementById('guest-phone').value = guest.phone;
  document.getElementById('guest-modal').classList.remove('hidden');
}

// Save guest (add or update)
document.getElementById('guest-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('guest-id').value;
  const name = document.getElementById('guest-name').value.trim();
  const phone = document.getElementById('guest-phone').value.trim();

  try {
    const url = id ? `${API_BASE}/guests/${id}` : `${API_BASE}/guests`;
    const method = id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone })
    });

    const data = await response.json();

    if (data.success) {
      document.getElementById('guest-modal').classList.add('hidden');
      await loadGuests();
      showToast(id ? 'Guest updated successfully' : 'Guest added successfully');
    } else {
      showToast(data.message, 'error');
    }
  } catch (error) {
    showToast('Failed to save guest', 'error');
  }
});

// Delete guest
async function deleteGuest(guestId) {
  const guest = currentGuests.find(g => g.id === guestId);
  if (!guest || !confirm(`Delete ${guest.name}?`)) return;

  try {
    const response = await fetch(`${API_BASE}/guests/${guestId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      await loadGuests();
      showToast('Guest deleted successfully');
    } else {
      showToast(data.message, 'error');
    }
  } catch (error) {
    showToast('Failed to delete guest', 'error');
  }
}

// Cancel modals
document.getElementById('cancel-guest-btn').addEventListener('click', () => {
  document.getElementById('guest-modal').classList.add('hidden');
});

document.getElementById('cancel-csv-btn').addEventListener('click', () => {
  document.getElementById('csv-modal').classList.add('hidden');
});

// Import CSV modal
document.getElementById('import-csv-btn').addEventListener('click', () => {
  document.getElementById('csv-form').reset();
  document.getElementById('csv-modal').classList.remove('hidden');
});

// Import CSV
document.getElementById('csv-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const csvData = document.getElementById('csv-data').value.trim();

  if (!csvData) {
    showToast('Please enter CSV data', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/guests/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csvData })
    });

    const data = await response.json();

    if (data.success) {
      document.getElementById('csv-modal').classList.add('hidden');
      await loadGuests();
      showToast(data.message);
      if (data.errors && data.errors.length > 0) {
        console.warn('Import errors:', data.errors);
      }
    } else {
      showToast(data.message, 'error');
    }
  } catch (error) {
    showToast('Failed to import guests', 'error');
  }
});

// Load settings
async function loadSettings() {
  try {
    const response = await fetch(`${API_BASE}/settings`);
    const data = await response.json();

    if (data.success) {
      currentSettings = data.settings;
      document.getElementById('whatsapp-number').value = currentSettings.whatsappNumber || '';
      document.getElementById('invitation-url').value = currentSettings.invitationUrl || '';
      document.getElementById('invitation-message').value = currentSettings.invitationMessage || '';
      document.getElementById('current-whatsapp').textContent = `+${currentSettings.whatsappNumber}`;
    }
  } catch (error) {
    showToast('Failed to load settings', 'error');
  }
}

// Save WhatsApp settings
document.getElementById('whatsapp-settings-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const whatsappNumber = document.getElementById('whatsapp-number').value.trim();
  const invitationUrl = document.getElementById('invitation-url').value.trim();

  try {
    const response = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whatsappNumber, invitationUrl })
    });

    const data = await response.json();

    if (data.success) {
      currentSettings = data.settings;
      document.getElementById('current-whatsapp').textContent = `+${currentSettings.whatsappNumber}`;
      showToast('WhatsApp settings saved successfully');
    } else {
      showToast(data.message, 'error');
    }
  } catch (error) {
    showToast('Failed to save settings', 'error');
  }
});

// Save message template
document.getElementById('message-settings-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const invitationMessage = document.getElementById('invitation-message').value;

  try {
    const response = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitationMessage })
    });

    const data = await response.json();

    if (data.success) {
      currentSettings = data.settings;
      showToast('Message template saved successfully');
    } else {
      showToast(data.message, 'error');
    }
  } catch (error) {
    showToast('Failed to save message template', 'error');
  }
});

// Change password
document.getElementById('password-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (newPassword !== confirmPassword) {
    showToast('New passwords do not match', 'error');
    return;
  }

  if (newPassword.length < 6) {
    showToast('Password must be at least 6 characters', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await response.json();

    if (data.success) {
      document.getElementById('password-form').reset();
      showToast('Password changed successfully');
    } else {
      showToast(data.message, 'error');
    }
  } catch (error) {
    showToast('Failed to change password', 'error');
  }
});

// Utility function
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Make functions globally accessible
window.sendInvitation = sendInvitation;
window.editGuest = editGuest;
window.deleteGuest = deleteGuest;
