# Safar Traders website

## Local development

```bash
npm install
npm run dev
npm run build
```

Copy `.env.example` to `.env.local` and populate the required service credentials. Never commit or share `.env.local`.

## Environment variables

- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`: public site settings.
- `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`: sourcing-assistant configuration.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `LEAD_NOTIFY_EMAIL`, `LEAD_FROM_EMAIL`: lead-email delivery. The site returns a WhatsApp/email fallback when SMTP is unavailable.
- `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_BUSINESS_RECIPIENT`, `WHATSAPP_BUYER_TEMPLATE_NAME`: optional WhatsApp Cloud API delivery.

## Deployment

Deploy on Vercel or another Node.js-compatible host. Add the same variables through the host's encrypted environment-variable settings, then run `npm run build`. Configure SMTP before publishing so quote and contact submissions reach the team.

Rotate any API key that has been exposed or copied outside a trusted secret manager.
