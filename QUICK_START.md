# Quick Start Guide - Wedding Invitation System

## 🎉 Your System is Ready!

The WhatsApp invitation system has been successfully integrated into your wedding website.

## 📱 Your WhatsApp Details
- **Number**: +8801357000757
- **Contact Link**: https://wa.me/8801357000757

---

## 🚀 Getting Started (3 Simple Steps)

### Step 1: Start the Server
```bash
cd "C:\Users\Adrita\Documents\wedding website"
npm start
```

**Server will be running at:**
- Main Website: http://localhost:3000/index.html
- Admin Dashboard: http://localhost:3000/admin.html

### Step 2: Login to Admin Dashboard
1. Open http://localhost:3000/admin.html in your browser
2. **Default Login:**
   - Username: `admin`
   - Password: `admin123`
3. ⚠️ **IMPORTANT**: Change this password immediately in Settings!

### Step 3: Add Your Guests
**Option A - Add Single Guest:**
1. Click "Add Guest" button
2. Enter name: `Farhan Ahmed`
3. Enter phone: `8801712345678` (with country code, no spaces)
4. Click Save

**Option B - Import Multiple Guests (CSV):**
1. Click "Import CSV" button
2. Paste guest data in this format:
   ```
   Farhan Ahmed, 8801712345678
   Ayesha Khan, 8801823456789
   Mehrab Hassan, 8801934567890
   ```
3. Click Import

---

## 📨 Sending Invitations

### How to Send an Invitation:
1. Go to Guest Management tab
2. Find the guest you want to invite
3. Click the green **"Send"** button next to their name
4. WhatsApp Web opens with a personalized message
5. Review the message (guest name and website URL are auto-filled)
6. Click send in WhatsApp

### The invitation message will look like:
```
Hello Farhan Ahmed!

You are warmly invited to our special event.

Please visit our invitation website for all the details:

http://localhost:3000/index.html

We would be delighted to have you join us!

Best wishes.
```

---

## ⚙️ Customize Your Settings

### Update Your WhatsApp Number:
1. Go to Settings tab
2. Enter new number (e.g., `8801357000757`)
3. Click "Save WhatsApp Settings"
4. Changes apply everywhere automatically!

### Customize Invitation Message:
1. Go to Settings tab
2. Edit the message template
3. Use these variables:
   - `{{guest_name}}` → Guest's actual name
   - `{{invitation_url}}` → Your website URL
4. Click "Save Message Template"

### Example Custom Message:
```
Assalamu Alaikum {{guest_name}}!

Mariam & Ahmed cordially invite you to their wedding celebration.

View full invitation: {{invitation_url}}

Your presence will make our day special.

JazakAllah Khair!
```

---

## 🎨 What's Been Added to Your Website

### 1. Floating WhatsApp Contact Button
- Green button in bottom-right corner
- Always visible on the main website
- Opens direct chat with you on WhatsApp
- Uses your WhatsApp number: +8801357000757

### 2. Dynamic RSVP System
- RSVP form now connects to your WhatsApp
- Guests can fill their name and send confirmation
- Pre-formatted message opens in WhatsApp Web

### 3. Admin Dashboard
- Complete guest management system
- Secure login (username/password)
- Send personalized invitations with one click
- Import bulk guests via CSV
- Update settings anytime

---

## 📋 Daily Workflow

### Morning Routine:
1. Start server: `npm start`
2. Open admin dashboard: http://localhost:3000/admin.html
3. Login with your credentials

### Adding New Guests:
1. Click "Add Guest"
2. Enter details
3. Click Save

### Sending Invitations:
1. Click green "Send" button
2. Review message in WhatsApp
3. Send!

### End of Day:
- Server can keep running
- Or press `Ctrl+C` in terminal to stop

---

## 🔒 Security Checklist

✅ **Change Default Password**
1. Login to admin dashboard
2. Go to Settings → Change Password
3. Enter current: `admin123`
4. Enter new password (min 6 characters)
5. Save

✅ **Keep Data Secure**
- Your guest data is stored in `data/guests.json`
- Admin credentials in `data/admin.json` (password is encrypted)
- Settings in `data/settings.json`

✅ **Backup Your Data**
- Copy the entire `data` folder regularly
- Keep backups of guest list

---

## 💡 Tips & Tricks

### Guest Phone Number Format:
✅ Correct: `8801712345678` (country code + number)
❌ Wrong: `+880 1712 345678` (no + or spaces)
❌ Wrong: `01712345678` (missing country code)

### CSV Import Format:
```
Name, Phone
Farhan Ahmed, 8801712345678
Ayesha Khan, 8801823456789
```
- Comma-separated
- One guest per line
- No header needed

### Customize for Your Language:
- Edit message template in Settings
- Use Bengali, Arabic, or any language
- Variables `{{guest_name}}` work in any language

---

## 🆘 Troubleshooting

### Server Not Starting?
```bash
# Check if port 3000 is free
netstat -ano | findstr :3000

# Kill process if needed, then restart
npm start
```

### Can't Login?
- Use default: `admin` / `admin123`
- Clear browser cache
- Check if server is running

### WhatsApp Link Not Working?
- Ensure number format: `8801357000757`
- No + or spaces
- Update in Settings → Save

### CSV Import Failing?
- Check format: `Name, Phone`
- Remove any header row
- One guest per line
- Comma separator

---

## 📞 Quick Access Links

- **Main Website**: http://localhost:3000/index.html
- **Admin Dashboard**: http://localhost:3000/admin.html
- **Your WhatsApp**: https://wa.me/8801357000757

---

## 🎊 You're All Set!

Your complete WhatsApp invitation system is ready to use. Start adding guests and sending beautiful personalized invitations!

**Need help?** Check the detailed README.md file for more information.

---

**Congratulations on your wedding! 💒 May your celebration be blessed and joyful! 🎉**
