const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const GUESTS_FILE = path.join(DATA_DIR, 'guests.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Initialize files if they don't exist
function initializeFiles() {
  if (!fs.existsSync(GUESTS_FILE)) {
    fs.writeFileSync(GUESTS_FILE, JSON.stringify([], null, 2));
  }

  if (!fs.existsSync(SETTINGS_FILE)) {
    const defaultSettings = {
      whatsappNumber: '8801357000757',
      invitationUrl: 'http://localhost:3000/index.html',
      invitationMessage: `Hello {{guest_name}}!

You are warmly invited to our special event.

Please visit our invitation website for all the details:

{{invitation_url}}

We would be delighted to have you join us!

Best wishes.`
    };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
  }

  if (!fs.existsSync(ADMIN_FILE)) {
    // Default password: admin123
    const defaultAdmin = {
      username: 'admin',
      password: bcrypt.hashSync('admin123', 10)
    };
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(defaultAdmin, null, 2));
  }
}

initializeFiles();

// Helper functions
function readJSON(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}

// Authentication endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const admin = readJSON(ADMIN_FILE);

  if (!admin) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }

  if (username === admin.username && bcrypt.compareSync(password, admin.password)) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Change password endpoint
app.post('/api/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = readJSON(ADMIN_FILE);

  if (!admin) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }

  if (bcrypt.compareSync(currentPassword, admin.password)) {
    admin.password = bcrypt.hashSync(newPassword, 10);
    if (writeJSON(ADMIN_FILE, admin)) {
      res.json({ success: true, message: 'Password changed successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save new password' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Current password is incorrect' });
  }
});

// Get all guests
app.get('/api/guests', (req, res) => {
  const guests = readJSON(GUESTS_FILE);
  if (guests !== null) {
    res.json({ success: true, guests });
  } else {
    res.status(500).json({ success: false, message: 'Failed to read guests' });
  }
});

// Add a new guest
app.post('/api/guests', (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and phone are required' });
  }

  const guests = readJSON(GUESTS_FILE);
  if (guests === null) {
    return res.status(500).json({ success: false, message: 'Failed to read guests' });
  }

  const newGuest = {
    id: Date.now().toString(),
    name: name.trim(),
    phone: phone.trim(),
    addedAt: new Date().toISOString()
  };

  guests.push(newGuest);

  if (writeJSON(GUESTS_FILE, guests)) {
    res.json({ success: true, guest: newGuest });
  } else {
    res.status(500).json({ success: false, message: 'Failed to save guest' });
  }
});

// Update a guest
app.put('/api/guests/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and phone are required' });
  }

  const guests = readJSON(GUESTS_FILE);
  if (guests === null) {
    return res.status(500).json({ success: false, message: 'Failed to read guests' });
  }

  const index = guests.findIndex(g => g.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Guest not found' });
  }

  guests[index] = {
    ...guests[index],
    name: name.trim(),
    phone: phone.trim(),
    updatedAt: new Date().toISOString()
  };

  if (writeJSON(GUESTS_FILE, guests)) {
    res.json({ success: true, guest: guests[index] });
  } else {
    res.status(500).json({ success: false, message: 'Failed to update guest' });
  }
});

// Delete a guest
app.delete('/api/guests/:id', (req, res) => {
  const { id } = req.params;

  const guests = readJSON(GUESTS_FILE);
  if (guests === null) {
    return res.status(500).json({ success: false, message: 'Failed to read guests' });
  }

  const filteredGuests = guests.filter(g => g.id !== id);

  if (filteredGuests.length === guests.length) {
    return res.status(404).json({ success: false, message: 'Guest not found' });
  }

  if (writeJSON(GUESTS_FILE, filteredGuests)) {
    res.json({ success: true, message: 'Guest deleted successfully' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to delete guest' });
  }
});

// Import guests from CSV
app.post('/api/guests/import', (req, res) => {
  const { csvData } = req.body;

  if (!csvData) {
    return res.status(400).json({ success: false, message: 'CSV data is required' });
  }

  const guests = readJSON(GUESTS_FILE);
  if (guests === null) {
    return res.status(500).json({ success: false, message: 'Failed to read guests' });
  }

  const lines = csvData.trim().split('\n');
  const imported = [];
  const errors = [];

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const [name, phone] = line.split(',').map(s => s.trim());

    if (!name || !phone) {
      errors.push(`Line ${lineNum}: Missing name or phone`);
      return;
    }

    const newGuest = {
      id: Date.now().toString() + '_' + index,
      name,
      phone,
      addedAt: new Date().toISOString()
    };

    guests.push(newGuest);
    imported.push(newGuest);
  });

  if (writeJSON(GUESTS_FILE, guests)) {
    res.json({
      success: true,
      message: `Imported ${imported.length} guests`,
      imported,
      errors
    });
  } else {
    res.status(500).json({ success: false, message: 'Failed to save imported guests' });
  }
});

// Get settings
app.get('/api/settings', (req, res) => {
  const settings = readJSON(SETTINGS_FILE);
  if (settings !== null) {
    res.json({ success: true, settings });
  } else {
    res.status(500).json({ success: false, message: 'Failed to read settings' });
  }
});

// Update settings
app.put('/api/settings', (req, res) => {
  const { whatsappNumber, invitationUrl, invitationMessage } = req.body;

  const settings = readJSON(SETTINGS_FILE);
  if (settings === null) {
    return res.status(500).json({ success: false, message: 'Failed to read settings' });
  }

  if (whatsappNumber !== undefined) settings.whatsappNumber = whatsappNumber.trim();
  if (invitationUrl !== undefined) settings.invitationUrl = invitationUrl.trim();
  if (invitationMessage !== undefined) settings.invitationMessage = invitationMessage;

  if (writeJSON(SETTINGS_FILE, settings)) {
    res.json({ success: true, settings });
  } else {
    res.status(500).json({ success: false, message: 'Failed to save settings' });
  }
});

// Get public settings (for the main website)
app.get('/api/public/settings', (req, res) => {
  const settings = readJSON(SETTINGS_FILE);
  if (settings !== null) {
    res.json({
      success: true,
      whatsappNumber: settings.whatsappNumber
    });
  } else {
    res.status(500).json({ success: false, message: 'Failed to read settings' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🎉 Wedding Invitation Server is running!`);
  console.log(`📱 Main Website: http://localhost:${PORT}/index.html`);
  console.log(`⚙️  Admin Dashboard: http://localhost:${PORT}/admin.html`);
  console.log(`\n🔐 Default Admin Credentials:`);
  console.log(`   Username: admin`);
  console.log(`   Password: admin123`);
  console.log(`\n💡 Please change the default password after first login!\n`);
});
