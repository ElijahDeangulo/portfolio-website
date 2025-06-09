# Email Setup Instructions

Your contact form is now ready to send real emails! Here's how to complete the setup:

## 1. Get a Resend API Key

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the API key

## 2. Set Up Environment Variable

Create a file called `.env.local` in your project root with:

```
RESEND_API_KEY=your_actual_api_key_here
```

## 3. Update Email Settings (Optional)

In `app/api/contact/route.ts`, you can customize:

- **Line 27**: Change `'ejdeangulo@gmail.com'` to your preferred email address
- **Line 26**: Update the "from" address (requires domain verification for custom domains)

## 4. Test the Contact Form

1. Save all files
2. Restart your development server: `npm run dev`
3. Navigate to the contact section
4. Fill out and submit the form
5. Check your email inbox!

## Features

✅ **Real email delivery** to your inbox  
✅ **Professional HTML formatting**  
✅ **Error handling** and validation  
✅ **Success/failure feedback** to users  
✅ **Timestamp** and sender info  

## Resend Free Tier

- 3,000 emails/month
- 100 emails/day
- Perfect for portfolio contact forms

## Troubleshooting

- If emails don't arrive, check your spam folder
- Verify your API key is correct in `.env.local`
- Check the browser console for any errors
- Restart the dev server after adding environment variables 