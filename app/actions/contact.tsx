"use server"

import { Resend } from "resend"
import { trackServerEvent } from "./analytics"
import { saveLeadToRedis } from "./leads"

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export async function sendContactEmail(formData: ContactFormData) {
  try {
    // Check if API key is available
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set")
      return {
        success: false,
        error: "Email service is niet beschikbaar. Bel ons direct op 06 10 93 50 77.",
      }
    }

    // Initialize Resend with API key check
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Send notification email to Evotion team
    await resend.emails.send({
      from: "info@evotion-coaching.nl",
      to: "info@evotion-coaching.nl",
      subject: `🚨 Nieuwe contactaanvraag van ${formData.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nieuwe Contactaanvraag - Evotion Coaching</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            
            <!-- Header -->
            <div style="background-color: #111827; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">🚨 Nieuwe Contactaanvraag</h1>
              <p style="color: #d1d5db; margin: 8px 0 0 0; font-size: 16px;">Via evotion-coaching.nl</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              
              <!-- Contact Info -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">👤 Contactgegevens</h2>
                
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 12px 0; color: #374151; font-size: 16px;"><strong style="color: #111827;">Naam:</strong> ${formData.name}</p>
                  <p style="margin: 0 0 12px 0; color: #374151; font-size: 16px;"><strong style="color: #111827;">Email:</strong> <a href="mailto:${formData.email}" style="color: #111827; text-decoration: underline;">${formData.email}</a></p>
                  ${formData.phone ? `<p style="margin: 0 0 12px 0; color: #374151; font-size: 16px;"><strong style="color: #111827;">Telefoon:</strong> <a href="tel:${formData.phone}" style="color: #111827; text-decoration: underline;">${formData.phone}</a></p>` : ""}
                  <p style="margin: 0; color: #374151; font-size: 16px;"><strong style="color: #111827;">Onderwerp:</strong> ${formData.subject}</p>
                </div>
                
                <div style="margin-top: 15px;">
                  <a href="mailto:${formData.email}" style="display: inline-block; background-color: #111827; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-right: 10px;">📧 Direct Antwoorden</a>
                  ${formData.phone ? `<a href="tel:${formData.phone}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 500;">📞 Direct Bellen</a>` : ""}
                </div>
              </div>
              
              <!-- Message -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">💬 Bericht</h2>
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-wrap;">${formData.message}</p>
                </div>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                © 2024 Evotion Coaching - info@evotion-coaching.nl
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `,
    })

    await trackServerEvent({
      type: "contact_submission",
      data: {
        name: formData.name,
        subject: formData.subject,
      },
      timestamp: new Date().toISOString(),
      path: "/contact",
    }).catch((err) => console.error("Failed to track contact submission:", err))

    await saveLeadToRedis({
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
      source: "contact_form",
      createdAt: new Date().toISOString(),
      data: {
        subject: formData.subject,
        messageSnippet: formData.message.substring(0, 100) + (formData.message.length > 100 ? "..." : ""),
      },
    })

    // Send confirmation email to customer
    await resend.emails.send({
      from: "info@evotion-coaching.nl",
      to: formData.email,
      subject: `Bedankt voor je bericht, ${formData.name}! 🚀`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bevestiging - Evotion Coaching</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            
            <!-- Header -->
            <div style="background-color: #111827; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Bedankt voor je bericht!</h1>
              <p style="color: #d1d5db; margin: 8px 0 0 0; font-size: 16px;">We nemen binnen 24 uur contact met je op</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              
              <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">Hoi ${formData.name}! 👋</h2>
              
              <p style="color: #374151; font-size: 16px; margin-bottom: 25px; line-height: 1.6;">
                Wat geweldig dat je contact met ons hebt opgenomen! We zijn enthousiast om je te helpen bij jouw transformatie naar een gezonder en fitter leven.
              </p>
              
              <!-- Message Summary -->
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 25px 0;">
                <h4 style="color: #111827; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">📝 Jouw bericht:</h4>
                <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;"><strong style="color: #111827;">Onderwerp:</strong> ${formData.subject}</p>
                  <p style="margin: 0; color: #374151; font-style: italic; line-height: 1.5;">"${formData.message}"</p>
                </div>
              </div>
              
              <!-- Process Steps -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 25px; margin: 25px 0; border: 1px solid #e5e7eb;">
                <h3 style="color: #111827; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; text-align: center;">🚀 Wat gebeurt er nu?</h3>
                
                <div style="margin: 15px 0;">
                  <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <div style="background-color: #111827; color: #ffffff; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 12px; font-size: 12px;">1</div>
                    <p style="margin: 0; color: #374151; font-size: 15px;">We bekijken je bericht zorgvuldig</p>
                  </div>
                  <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <div style="background-color: #111827; color: #ffffff; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 12px; font-size: 12px;">2</div>
                    <p style="margin: 0; color: #374151; font-size: 15px;">Een van onze coaches neemt binnen 24 uur contact op</p>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <div style="background-color: #6b7280; color: #ffffff; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 12px; font-size: 12px;">3</div>
                    <p style="margin: 0; color: #374151; font-size: 15px;">We plannen een gratis kennismakingsgesprek</p>
                  </div>
                </div>
              </div>
              
              <!-- Urgent Contact -->
              <div style="background-color: #111827; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
                <h4 style="color: #ffffff; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">⚡ Heb je haast?</h4>
                <p style="color: #d1d5db; margin: 0 0 15px 0; font-size: 14px;">Bel ons direct of stuur een WhatsApp bericht!</p>
                
                <div style="margin: 15px 0;">
                  <a href="tel:0610935077" style="display: inline-block; background-color: #ffffff; color: #111827; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 0 6px 6px 0; font-size: 14px;">
                    📞 06 10 93 50 77
                  </a>
                  <a href="https://wa.me/31610935077" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 0 6px 6px 0; font-size: 14px;">
                    💬 WhatsApp
                  </a>
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #374151; font-size: 16px; margin-bottom: 8px;">
                  Met sportieve groet,
                </p>
                <p style="color: #111827; font-size: 18px; font-weight: 600; margin: 0;">
                  Team Evotion Coaching
                </p>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                © 2024 Evotion Coaching - Jouw partner in gezondheid en fitness
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `,
    })

    return {
      success: true,
      message: "Bedankt voor je bericht! We nemen binnen 24 uur contact met je op.",
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      error:
        "Er ging iets mis bij het verzenden van je bericht. Probeer het opnieuw of bel ons direct op 06 10 93 50 77.",
    }
  }
}
