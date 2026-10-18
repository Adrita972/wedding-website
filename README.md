# Wedding Invitation System with WhatsApp Integration

A complete wedding invitation website with an admin dashboard to manage guests and send personalized WhatsApp invitations.

## Features

✅ **Beautiful Wedding Invitation Website**
- Elegant design with countdown timer
- Event timeline and venue information
- Interactive RSVP form
- Floating WhatsApp contact button

✅ **Admin Dashboard**
- Secure login system (username/password authentication)
- Manage guest list (add, edit, delete)
- Import multiple guests via CSV
- Send personalized WhatsApp invitations with one click
- Update WhatsApp number anytime
- Customize invitation message template
- Change admin password

✅ **WhatsApp Integration**
- Your WhatsApp number: +8801357000757
- Personalized messages with guest names
- Direct WhatsApp Web integration
- Review messages before sending

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - **Main Wedding Website**: http://localhost:3000/index.html
   - **Admin Dashboard**: http://localhost:3000/admin.html

## Default Admin Credentials

```
Username: admin
Password: admin123
```

**⚠️ IMPORTANT**: Change the default password immediately after first login!

## Admin Dashboard Guide

### 1. Login
- Go to http://localhost:3000/admin.html
- Enter username and password
- Click "Login"

### 2. Manage Guests

#### Add Single Guest
1. Click "Add Guest" button
2. Enter guest name (e.g., "Farhan Ahmed")
3. Enter phone number with country code (e.g., "8801712345678")
4. Click "Save"

#### Import Multiple Guests (CSV)
1. Click "Import CSV" button
2. Enter guest data in format: `Name, Phone` (one per line)
   ```
   Farhan Ahmed, 8801712345678
   Ayesha Khan, 8801823456789
   Mehrab Hassan, 8801934567890
   ```
3. Click "Import"

#### Edit Guest
1. Click the blue "Edit" button next to any guest
2. Update information
3. Click "Save"

#### Delete Guest
1. Click the red "Trash" button
2. Confirm deletion

#### Send WhatsApp Invitation
1. Click the green "Send" button next to guest name
2. WhatsApp Web opens with pre-filled personalized message
3. Review the message
4. Click send in WhatsApp

### 3. Update Settings

#### WhatsApp Settings
1. Go to "Settings" tab
2. Update your WhatsApp number (format: 8801357000757)
3. Update invitation website URL
4. Click "Save WhatsApp Settings"

#### Customize Invitation Message
1. Go to "Settings" tab
2. Edit the message template
3. Use variables:
   - `{{guest_name}}` - Replaced with guest's name
   - `{{invitation_url}}` - Replaced with website URL
4. Click "Save Message Template"

Example message:
```
Hello {{guest_name}}!

You are warmly invited to our special event.

Please visit our invitation website:
{{invitation_url}}

We would be delighted to have you join us!

Best wishes.
```

#### Change Password
1. Go to "Settings" tab
2. Enter current password
3. Enter new password (min 6 characters)
4. Confirm new password
5. Click "Change Password"

## File Structure

```
wedding-website/
├── index.html          # Main wedding invitation website
├── admin.html          # Admin dashboard
├── admin.js            # Admin dashboard functionality
├── server.js           # Backend API server
├── package.json        # Node.js dependencies
├── README.md           # This file
└── data/               # Created automatically on first run
    ├── guests.json     # Guest database
    ├── settings.json   # App settings (WhatsApp number, message template)
    └── admin.json      # Admin credentials (hashed password)
```

## How It Works

### Guest Invitation Flow
1. You add guests to the admin dashboard
2. Click "Send" next to a guest's name
3. System generates personalized message with:
   - Guest's name
   - Your invitation website URL
4. WhatsApp Web opens with pre-filled message
5. You review and send the message

### WhatsApp Link Format
```
https://wa.me/[GUEST_PHONE]?text=[ENCODED_MESSAGE]
```

Example:
```
https://wa.me/8801712345678?text=Hello%20Farhan%20Ahmed!%0A%0AYou%20are%20warmly%20invited...
```

## Security Features

- Password hashing with bcrypt
- Admin authentication required
- No direct automated sending (manual review via WhatsApp Web)
- Environment-safe data storage
- CORS enabled for localhost development

## Customization

### Update WhatsApp Number
1. Login to admin dashboard
2. Settings → WhatsApp Settings
3. Update number
4. Save

The number will automatically update:
- Admin dashboard
- Main website floating button
- RSVP section
- All invitation links

### Customize Invitation Message
1. Login to admin dashboard
2. Settings → Invitation Message Template
3. Edit message
4. Use `{{guest_name}}` and `{{invitation_url}}` variables
5. Save

### Modify Website Design
Edit `index.html` - all design elements are preserved. The WhatsApp integration is non-invasive and doesn't affect your existing styling.

## Troubleshooting

### Server won't start
- Check if Node.js is installed: `node --version`
- Check if port 3000 is available
- Install dependencies: `npm install`

### Can't login to admin
- Check if server is running
- Use default credentials: admin/admin123
- Check browser console for errors

### WhatsApp button not working
- Ensure WhatsApp number is saved in settings
- Number format: country code + number (no + or spaces)
- Example: 8801357000757 (not +880 1357 000757)

### Guest import fails
- Check CSV format: `Name, Phone` (comma-separated)
- One guest per line
- No header row needed
- Phone numbers: country code + number

## Production Deployment

For production use:

1. **Change Default Password**
   - Login with admin/admin123
   - Go to Settings → Change Password
   - Use a strong password

2. **Update URLs**
   - Change `invitationUrl` to your actual domain
   - Update API_BASE in admin.js if deploying to different domain

3. **Secure Server**
   - Use HTTPS
   - Add rate limiting
   - Implement session management
   - Use environment variables for sensitive data

4. **Database**
   - Consider using a proper database (MongoDB, PostgreSQL)
   - Current JSON file storage is for development only

## WhatsApp Business API (Optional)

For automated sending without manual review, you can integrate WhatsApp Business Cloud API:

1. Register at https://developers.facebook.com
2. Create a WhatsApp Business App
3. Get API credentials (Access Token, Phone Number ID)
4. Store credentials in environment variables
5. Update server.js to call WhatsApp API

**Note**: Current implementation uses click-to-WhatsApp (manual review) which complies with WhatsApp policies and doesn't require API credentials.

## Support

For issues or questions:
- Check the troubleshooting section
- Review server console logs
- Check browser console for errors

## License

Private use for personal wedding invitation.

---

**Made with ❤️ for Mariam & Ahmed's Wedding**
