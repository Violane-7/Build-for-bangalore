# Email-Based Authentication Setup Guide

## Overview
This guide walks you through setting up Gmail SMTP email-based authentication for your Build For Bangalore Health App.

## Step 1: Enable 2FA on Gmail Account

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled
3. Ensure you can see "App passwords" option

## Step 2: Generate Gmail App Password

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer" (or your device)
3. Google will generate a 16-character password
4. Copy this password

## Step 3: Setup Environment Variables

1. Copy `.env.example` to `.env` in the project root:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your values:
   ```
   GMAIL_USER=hargunmadan9034@gmail.com
   GMAIL_PASSWORD=paste_your_16_character_app_password_here
   CLIENT_URL=http://localhost:3000
   JWT_SECRET=your_secure_random_secret_key
   ```

3. For production, use:
   ```
   CLIENT_URL=https://yourdomain.com
   ```

## Step 4: Install Dependencies

In the `server` directory:
```bash
npm install
```

## Step 5: Verify Setup

Test the email verification flow:

1. **Register a new user**: POST `/api/auth/register`
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123",
     "gender": "male",
     "dob": "1990-01-01"
   }
   ```

2. **Check the verification email** that's sent to the user's email

3. **Click the verification link** in the email

4. **Verify email with token**: POST `/api/auth/verify-email`
   ```json
   {
     "token": "token_from_email_link"
   }
   ```

5. **Login**: POST `/api/auth/login`
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

## Authentication Flow

```
1. User registers → verification email sent
2. User clicks verification link from email
3. Email is marked as verified in database
4. User can now login to dashboard
5. Dashboard is protected by PrivateRoute
```

## New Routes

### Register
- **POST** `/api/auth/register`
- Creates account and sends verification email
- Returns: `{ message, user }`

### Verify Email
- **POST** `/api/auth/verify-email`
- Verifies email token and marks user as verified
- Returns: `{ message, token, user }`

### Login
- **POST** `/api/auth/login`
- Requires verified email
- Returns: `{ token, user }`

### Resend Verification
- **POST** `/api/auth/resend-verification`
- Sends verification email again if expired
- Request: `{ email }`
- Returns: `{ message }`

## Frontend Changes

- Root path (`/`) now redirects to `/login`
- New verification page at `/verify-email`
- Email verification token in URL: `/verify-email?token=xxx`

## Troubleshooting

### Issue: "Less secure app access" error
**Solution**: Use Gmail App Password instead of regular password

### Issue: Verification email not received
**Solution**:
- Check spam folder
- Verify `GMAIL_USER` is correct
- Verify `GMAIL_PASSWORD` is the 16-character app password
- Use `/api/auth/resend-verification` endpoint

### Issue: Token expired error
**Solution**:
- Tokens expire after 24 hours
- Use resend-verification endpoint to get a new one

### Issue: Email already exists error
**Solution**:
- Email must be unique per user
- Try registering with a different email

## Security Notes

- Email verification tokens are 32-byte random hex strings
- Tokens expire after 24 hours
- Passwords are hashed with bcryptjs (10 salt rounds)
- JWT tokens expire after 7 days
- Never commit `.env` file with real credentials
- Use `.env.example` as template

## Production Deployment

For production:
1. Use environment-specific `.env` files
2. Set `CLIENT_URL` to your production domain
3. Use stronger `JWT_SECRET`
4. Consider using Gmail's domain/workspace SMTP for better deliverability
5. Add email rate limiting to prevent abuse
6. Use HTTPS everywhere
