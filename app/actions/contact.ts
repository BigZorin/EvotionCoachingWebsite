"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export async function sendContactEmail(formData: ContactFormData) {
  try {
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
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e1839 0%, #2d2654 50%, #1e1839 100%); padding: 40px 30px; text-align: center;">
              <img src="https://evotion-coaching.nl/images/evotion-logo.png" alt="Evotion Coaching" style="height: 50px; margin-bottom: 20px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">🚨 Nieuwe Contactaanvraag</h1>
              <p style="color: #bad4e1; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Via evotion-coaching.nl</p>
            </div>
            
            <!-- Alert Banner -->
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px 30px; text-align: center; border-bottom: 3px solid #f59e0b;">
              <h2 style="color: #92400e; margin: 0; font-size: 18px; font-weight: 600;">⚡ URGENT - Nieuwe Lead</h2>
              <p style="color: #b45309; margin: 5px 0 0 0; font-size: 14px;">Reageer binnen 24 uur voor optimale conversie</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              
              <!-- Contact Info -->
              <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 30px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                <h3 style="color: #1e1839; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #bad4e1; padding-bottom: 10px;">👤 Contactgegevens</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #374151; width: 100px;">Naam:</td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 16px;">${formData.name}</td>
                  </tr>
                  <tr style="background-color: #f8fafc;">
                    <td style="padding: 10px 0; font-weight: 600; color: #374151;">Email:</td>
                    <td style="padding: 10px 0;">
                      <a href="mailto:${formData.email}" style="color: #1e1839; text-decoration: none; font-weight: 500;">${formData.email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #374151;">Telefoon:</td>
                    <td style="padding: 10px 0;">
                      ${formData.phone ? `<a href="tel:${formData.phone}" style="color: #1e1839; text-decoration: none; font-weight: 500;">${formData.phone}</a>` : '<span style="color: #6b7280; font-style: italic;">Niet opgegeven</span>'}
                    </td>
                  </tr>
                  <tr style="background-color: #f8fafc;">
                    <td style="padding: 10px 0; font-weight: 600; color: #374151;">Onderwerp:</td>
                    <td style="padding: 10px 0; color: #1f2937; font-weight: 500;">${formData.subject}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Message -->
              <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                <h3 style="color: #1e1839; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #bad4e1; padding-bottom: 10px;">💬 Bericht</h3>
                <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #bad4e1;">
                  <p style="margin: 0; color: #1f2937; line-height: 1.6; white-space: pre-wrap;">${formData.message}</p>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:${formData.email}" style="display: inline-block; background: linear-gradient(135deg, #1e1839 0%, #2d2654 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 8px 8px 0; box-shadow: 0 4px 6px rgba(30, 24, 57, 0.3);">
                  📧 Direct Antwoorden
                </a>
                ${
                  formData.phone
                    ? `
                <a href="tel:${formData.phone}" style="display: inline-block; background: linear-gradient(135deg, #bad4e1 0%, #93c5fd 100%); color: #1e1839; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 8px 8px 0; box-shadow: 0 4px 6px rgba(186, 212, 225, 0.4);">
                  📞 Direct Bellen
                </a>
                `
                    : ""
                }
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background: linear-gradient(135deg, #1e1839 0%, #2d2654 100%); padding: 30px; text-align: center;">
              <img src="https://evotion-coaching.nl/images/evotion-logo.png" alt="Evotion Coaching" style="height: 35px; margin-bottom: 15px; opacity: 0.9;">
              <h3 style="color: #ffffff; margin: 0 0 5px 0; font-size: 16px; font-weight: 600;">Evotion Coaching</h3>
              <p style="color: #bad4e1; margin: 0 0 20px 0; font-size: 13px; opacity: 0.8;">Transformeer je lichaam, transformeer je leven</p>
              
              <div style="border-top: 1px solid #374151; padding-top: 20px;">
                <p style="color: #9ca3af; margin: 0; font-size: 12px; line-height: 1.4;">
                  📧 info@evotion-coaching.nl | 📱 06 10 93 50 77<br>
                  📍 Friesland, Nederland
                </p>
              </div>
            </div>
            
          </div>
        </body>
        </html>
      `,
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
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e1839 0%, #2d2654 50%, #1e1839 100%); padding: 40px 30px; text-align: center;">
              <img src="https://evotion-coaching.nl/images/evotion-logo.png" alt="Evotion Coaching" style="height: 50px; margin-bottom: 20px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Bedankt voor je bericht!</h1>
              <p style="color: #bad4e1; margin: 15px 0 0 0; font-size: 16px; opacity: 0.9;">We nemen binnen 24 uur contact met je op</p>
            </div>
            
            <!-- Success Banner -->
            <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 20px 30px; text-align: center; border-bottom: 3px solid #22c55e;">
              <h2 style="color: #16a34a; margin: 0; font-size: 18px; font-weight: 600;">✅ Bericht Succesvol Ontvangen</h2>
              <p style="color: #15803d; margin: 5px 0 0 0; font-size: 14px;">Je aanvraag wordt met prioriteit behandeld</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              
              <h2 style="color: #1e1839; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">Hoi ${formData.name}! 👋</h2>
              
              <p style="color: #374151; font-size: 16px; margin-bottom: 25px;">
                Wat geweldig dat je contact met ons hebt opgenomen! We zijn enthousiast om je te helpen bij jouw transformatie naar een gezonder en fitter leven.
              </p>
              
              <!-- Message Summary -->
              <div style="background: #ffffff; border: 2px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <h4 style="color: #1e1839; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">📝 Jouw bericht:</h4>
                <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #bad4e1;">
                  <p style="margin: 0 0 8px 0; color: #4b5563; font-size: 14px;"><strong>Onderwerp:</strong> ${formData.subject}</p>
                  <p style="margin: 0; color: #4b5563; font-style: italic; line-height: 1.5;">"${formData.message}"</p>
                </div>
              </div>
              
              <!-- Process Steps -->
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border: 2px solid #bad4e1;">
                <h3 style="color: #1e1839; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; text-align: center;">🚀 Wat gebeurt er nu?</h3>
                
                <div style="margin: 15px 0;">
                  <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <div style="background: #1e1839; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; font-size: 12px;">1</div>
                    <p style="margin: 0; color: #374151; font-size: 15px;">We bekijken je bericht zorgvuldig</p>
                  </div>
                  <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <div style="background: #1e1839; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; font-size: 12px;">2</div>
                    <p style="margin: 0; color: #374151; font-size: 15px;">Een van onze coaches neemt binnen 24 uur contact op</p>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <div style="background: #bad4e1; color: #1e1839; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; font-size: 12px;">3</div>
                    <p style="margin: 0; color: #374151; font-size: 15px;">We plannen een gratis kennismakingsgesprek</p>
                  </div>
                </div>
              </div>
              
              <!-- Urgent Contact -->
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center; border: 2px solid #f59e0b;">
                <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">⚡ Heb je haast?</h4>
                <p style="color: #b45309; margin: 0 0 15px 0; font-size: 14px;">Bel ons direct of stuur een WhatsApp bericht!</p>
                
                <div style="margin: 15px 0;">
                  <a href="tel:0610935077" style="display: inline-block; background: #1e1839; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 0 6px 6px 0; font-size: 14px;">
                    📞 06 10 93 50 77
                  </a>
                  <a href="https://wa.me/31610935077" style="display: inline-block; background: #25D366; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 0 6px 6px 0; font-size: 14px;">
                    💬 WhatsApp
                  </a>
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #374151; font-size: 16px; margin-bottom: 8px;">
                  Met sportieve groet,
                </p>
                <p style="color: #1e1839; font-size: 18px; font-weight: 600; margin: 0;">
                  Team Evotion Coaching
                </p>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background: linear-gradient(135deg, #1e1839 0%, #2d2654 100%); padding: 30px; text-align: center;">
              <img src="https://evotion-coaching.nl/images/evotion-logo.png" alt="Evotion Coaching" style="height: 35px; margin-bottom: 15px; opacity: 0.9;">
              <h3 style="color: #ffffff; margin: 0 0 5px 0; font-size: 16px; font-weight: 600;">Evotion Coaching</h3>
              <p style="color: #bad4e1; margin: 0 0 20px 0; font-size: 13px; opacity: 0.8;">Jouw droomlichaam binnen handbereik</p>
              
              <div style="border-top: 1px solid #374151; padding-top: 20px;">
                <p style="color: #9ca3af; margin: 0; font-size: 12px; line-height: 1.4;">
                  📧 info@evotion-coaching.nl | 📱 06 10 93 50 77<br>
                  📍 Friesland, Nederland
                </p>
                <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 11px;">
                  © 2024 Evotion Coaching. Alle rechten voorbehouden.
                </p>
              </div>
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
