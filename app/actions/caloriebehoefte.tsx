"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface CalorieFormData {
  naam: string
  email: string
  telefoon: string
  geslacht: "man" | "vrouw"
  leeftijd: number
  gewicht: number
  lengte: number
  activiteit: string
  doel: string
}

interface CalorieResults {
  bmr: number
  tdee: number
  target: number
  protein: number
  carbs: number
  fat: number
  recommendedCoaching: string
}

export async function submitCalorieForm(formData: CalorieFormData, results: CalorieResults) {
  try {
    // Send notification email to Evotion team
    await resend.emails.send({
      from: "info@evotion-coaching.nl",
      to: "info@evotion-coaching.nl",
      subject: `🔥 Nieuwe Caloriebehoefte Berekening van ${formData.naam}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nieuwe Caloriebehoefte Berekening - Evotion Coaching</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e1839 0%, #2d2654 50%, #1e1839 100%); padding: 40px 30px; text-align: center;">
              <img src="https://evotion-coaching.nl/images/evotion-logo.png" alt="Evotion Coaching" style="height: 50px; margin-bottom: 20px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">🔥 Nieuwe Caloriebehoefte Lead</h1>
              <p style="color: #bad4e1; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Via caloriebehoefte calculator</p>
            </div>
            
            <!-- Alert Banner -->
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px 30px; text-align: center; border-bottom: 3px solid #f59e0b;">
              <h2 style="color: #92400e; margin: 0; font-size: 18px; font-weight: 600;">⚡ HOT LEAD - Calorie Calculator</h2>
              <p style="color: #b45309; margin: 5px 0 0 0; font-size: 14px;">Geïnteresseerd in ${results.recommendedCoaching.replace("-", " ")}</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              
              <!-- Contact Info -->
              <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 30px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                <h3 style="color: #1e1839; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #bad4e1; padding-bottom: 10px;">👤 Contactgegevens</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #374151; width: 100px;">Naam:</td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 16px;">${formData.naam}</td>
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
                      ${formData.telefoon ? `<a href="tel:${formData.telefoon}" style="color: #1e1839; text-decoration: none; font-weight: 500;">${formData.telefoon}</a>` : '<span style="color: #6b7280; font-style: italic;">Niet opgegeven</span>'}
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Personal Stats -->
              <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 30px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                <h3 style="color: #1e1839; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #bad4e1; padding-bottom: 10px;">📊 Persoonlijke Gegevens</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #374151; width: 120px;">Geslacht:</td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 16px; text-transform: capitalize;">${formData.geslacht}</td>
                  </tr>
                  <tr style="background-color: #f8fafc;">
                    <td style="padding: 10px 0; font-weight: 600; color: #374151;">Leeftijd:</td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 16px;">${formData.leeftijd} jaar</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #374151;">Gewicht:</td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 16px;">${formData.gewicht} kg</td>
                  </tr>
                  <tr style="background-color: #f8fafc;">
                    <td style="padding: 10px 0; font-weight: 600; color: #374151;">Lengte:</td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 16px;">${formData.lengte} cm</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #374151;">Activiteit:</td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 16px; text-transform: capitalize;">${formData.activiteit.replace("_", " ")}</td>
                  </tr>
                  <tr style="background-color: #f8fafc;">
                    <td style="padding: 10px 0; font-weight: 600; color: #374151;">Doel:</td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 16px; text-transform: capitalize;">${formData.doel}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Calculated Results -->
              <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 30px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                <h3 style="color: #1e1839; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #bad4e1; padding-bottom: 10px;">🔥 Berekende Resultaten</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-bottom: 20px;">
                  <div style="text-align: center; padding: 15px; background: #f0f9ff; border-radius: 8px;">
                    <div style="font-size: 24px; font-weight: bold; color: #1e1839;">${results.bmr}</div>
                    <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">BMR (kcal)</div>
                  </div>
                  <div style="text-align: center; padding: 15px; background: #f0f9ff; border-radius: 8px;">
                    <div style="font-size: 24px; font-weight: bold; color: #1e1839;">${results.tdee}</div>
                    <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">TDEE (kcal)</div>
                  </div>
                  <div style="text-align: center; padding: 15px; background: #dcfce7; border-radius: 8px;">
                    <div style="font-size: 24px; font-weight: bold; color: #16a34a;">${results.target}</div>
                    <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Doel (kcal)</div>
                  </div>
                </div>
                
                <h4 style="color: #1e1839; margin: 20px 0 10px 0; font-size: 16px; font-weight: 600;">Macronutriënten:</h4>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #374151;">Eiwitten:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${results.protein}g</td>
                  </tr>
                  <tr style="background-color: #f8fafc;">
                    <td style="padding: 8px 0; font-weight: 600; color: #374151;">Koolhydraten:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${results.carbs}g</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #374151;">Vetten:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${results.fat}g</td>
                  </tr>
                </table>
              </div>
              
              <!-- Recommended Coaching -->
              <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border: 2px solid #22c55e;">
                <h3 style="color: #16a34a; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; text-align: center;">🎯 Aanbevolen Coaching</h3>
                <div style="text-align: center;">
                  <div style="background: #ffffff; padding: 15px; border-radius: 8px; display: inline-block;">
                    <h4 style="color: #1e1839; margin: 0 0 5px 0; font-size: 16px; font-weight: 600; text-transform: capitalize;">
                      ${results.recommendedCoaching.replace("-", " ")}
                    </h4>
                    <p style="color: #6b7280; margin: 0; font-size: 14px;">Gebaseerd op doelen en activiteitsniveau</p>
                  </div>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:${formData.email}" style="display: inline-block; background: linear-gradient(135deg, #1e1839 0%, #2d2654 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 8px 8px 0; box-shadow: 0 4px 6px rgba(30, 24, 57, 0.3);">
                  📧 Direct Contact Opnemen
                </a>
                ${
                  formData.telefoon
                    ? `
                <a href="tel:${formData.telefoon}" style="display: inline-block; background: linear-gradient(135deg, #bad4e1 0%, #93c5fd 100%); color: #1e1839; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 8px 8px 0; box-shadow: 0 4px 6px rgba(186, 212, 225, 0.4);">
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

    // Send confirmation email to user with their results
    await resend.emails.send({
      from: "info@evotion-coaching.nl",
      to: formData.email,
      subject: `Je persoonlijke caloriebehoefte resultaten, ${formData.naam}! 🔥`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Je Caloriebehoefte Resultaten - Evotion Coaching</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e1839 0%, #2d2654 50%, #1e1839 100%); padding: 40px 30px; text-align: center;">
              <img src="https://evotion-coaching.nl/images/evotion-logo.png" alt="Evotion Coaching" style="height: 50px; margin-bottom: 20px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Je Persoonlijke Resultaten! 🔥</h1>
              <p style="color: #bad4e1; margin: 15px 0 0 0; font-size: 16px; opacity: 0.9;">Hier zijn je caloriebehoefte en voedingsadvies</p>
            </div>
            
            <!-- Success Banner -->
            <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 20px 30px; text-align: center; border-bottom: 3px solid #22c55e;">
              <h2 style="color: #16a34a; margin: 0; font-size: 18px; font-weight: 600;">✅ Berekening Voltooid</h2>
              <p style="color: #15803d; margin: 5px 0 0 0; font-size: 14px;">Jouw persoonlijke voedingsplan staat klaar</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              
              <h2 style="color: #1e1839; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">Hoi ${formData.naam}! 👋</h2>
              
              <p style="color: #374151; font-size: 16px; margin-bottom: 25px;">
                Bedankt voor het invullen van onze caloriebehoefte calculator! Op basis van jouw gegevens hebben we een persoonlijk voedingsadvies voor je samengesteld.
              </p>
              
              <!-- Calorie Results -->
              <div style="background: #ffffff; border: 2px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <h3 style="color: #1e1839; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; text-align: center;">🔥 Jouw Caloriebehoefte</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
                  <div style="text-align: center; padding: 20px; background: #f0f9ff; border-radius: 8px; border: 1px solid #e0f2fe;">
                    <div style="font-size: 28px; font-weight: bold; color: #1e1839; margin-bottom: 5px;">${results.bmr}</div>
                    <div style="font-size: 14px; color: #6b7280; font-weight: 500;">Basaal Metabolisme</div>
                    <div style="font-size: 12px; color: #9ca3af; margin-top: 2px;">kcal per dag</div>
                  </div>
                  <div style="text-align: center; padding: 20px; background: #f0f9ff; border-radius: 8px; border: 1px solid #e0f2fe;">
                    <div style="font-size: 28px; font-weight: bold; color: #1e1839; margin-bottom: 5px;">${results.tdee}</div>
                    <div style="font-size: 14px; color: #6b7280; font-weight: 500;">Dagelijks Verbruik</div>
                    <div style="font-size: 12px; color: #9ca3af; margin-top: 2px;">kcal per dag</div>
                  </div>
                  <div style="text-align: center; padding: 20px; background: #dcfce7; border-radius: 8px; border: 1px solid #bbf7d0;">
                    <div style="font-size: 28px; font-weight: bold; color: #16a34a; margin-bottom: 5px;">${results.target}</div>
                    <div style="font-size: 14px; color: #15803d; font-weight: 500;">Jouw Doel</div>
                    <div style="font-size: 12px; color: #16a34a; margin-top: 2px;">kcal per dag</div>
                  </div>
                </div>
              </div>
              
              <!-- Macronutrients -->
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border: 2px solid #bad4e1;">
                <h3 style="color: #1e1839; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; text-align: center;">🥗 Aanbevolen Macronutriënten</h3>
                
                <div style="background: #ffffff; padding: 20px; border-radius: 8px;">
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px;">
                    <div style="text-align: center;">
                      <div style="font-size: 24px; font-weight: bold; color: #1e1839; margin-bottom: 5px;">${results.protein}g</div>
                      <div style="font-size: 14px; color: #6b7280; font-weight: 500;">Eiwitten</div>
                      <div style="font-size: 12px; color: #9ca3af; margin-top: 2px;">${Math.round((results.protein * 4 * 100) / results.target)}% van calorieën</div>
                    </div>
                    <div style="text-align: center;">
                      <div style="font-size: 24px; font-weight: bold; color: #16a34a; margin-bottom: 5px;">${results.carbs}g</div>
                      <div style="font-size: 14px; color: #6b7280; font-weight: 500;">Koolhydraten</div>
                      <div style="font-size: 12px; color: #9ca3af; margin-top: 2px;">${Math.round((results.carbs * 4 * 100) / results.target)}% van calorieën</div>
                    </div>
                    <div style="text-align: center;">
                      <div style="font-size: 24px; font-weight: bold; color: #f59e0b; margin-bottom: 5px;">${results.fat}g</div>
                      <div style="font-size: 14px; color: #6b7280; font-weight: 500;">Vetten</div>
                      <div style="font-size: 12px; color: #9ca3af; margin-top: 2px;">${Math.round((results.fat * 9 * 100) / results.target)}% van calorieën</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Recommendation -->
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; border: 2px solid #f59e0b;">
                <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">🎯 Onze Aanbeveling Voor Jou</h3>
                <div style="background: #ffffff; padding: 20px; border-radius: 8px; display: inline-block; min-width: 250px;">
                  <h4 style="color: #1e1839; margin: 0 0 10px 0; font-size: 18px; font-weight: 600; text-transform: capitalize;">
                    ${results.recommendedCoaching.replace("-", " ")}
                  </h4>
                  <p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px;">
                    Gebaseerd op jouw doelen en activiteitsniveau
                  </p>
                  <a href="https://evotion-coaching.nl/${results.recommendedCoaching}" style="display: inline-block; background: #1e1839; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                    Bekijk Dit Programma
                  </a>
                </div>
              </div>
              
              <!-- Next Steps -->
              <div style="background: #ffffff; border: 2px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <h3 style="color: #1e1839; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">🚀 Volgende Stappen</h3>
                
                <div style="space-y: 15px;">
                  <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                    <div style="background: #1e1839; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; font-size: 12px; flex-shrink: 0;">1</div>
                    <div>
                      <h4 style="margin: 0 0 5px 0; color: #1e1839; font-size: 16px; font-weight: 600;">Start met je doelcalorieën</h4>
                      <p style="margin: 0; color: #6b7280; font-size: 14px;">Begin met ${results.target} calorieën per dag en monitor je voortgang</p>
                    </div>
                  </div>
                  
                  <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                    <div style="background: #1e1839; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; font-size: 12px; flex-shrink: 0;">2</div>
                    <div>
                      <h4 style="margin: 0 0 5px 0; color: #1e1839; font-size: 16px; font-weight: 600;">Focus op je macronutriënten</h4>
                      <p style="margin: 0; color: #6b7280; font-size: 14px;">Verdeel je calorieën over ${results.protein}g eiwit, ${results.carbs}g koolhydraten en ${results.fat}g vet</p>
                    </div>
                  </div>
                  
                  <div style="display: flex; align-items: flex-start;">
                    <div style="background: #bad4e1; color: #1e1839; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; font-size: 12px; flex-shrink: 0;">3</div>
                    <div>
                      <h4 style="margin: 0 0 5px 0; color: #1e1839; font-size: 16px; font-weight: 600;">Overweeg professionele begeleiding</h4>
                      <p style="margin: 0; color: #6b7280; font-size: 14px;">Voor optimale resultaten raden we ${results.recommendedCoaching.replace("-", " ")} aan</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Contact CTA -->
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
                  Heb je vragen over je resultaten of wil je persoonlijke begeleiding?
                </p>
                <div style="margin: 15px 0;">
                  <a href="tel:0610935077" style="display: inline-block; background: #1e1839; color: white; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 8px 8px 0; font-size: 14px;">
                    📞 Bel Direct: 06 10 93 50 77
                  </a>
                  <a href="https://wa.me/31610935077" style="display: inline-block; background: #25D366; color: white; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 8px 8px 0; font-size: 14px;">
                    💬 WhatsApp
                  </a>
                </div>
                <a href="https://evotion-coaching.nl/contact" style="display: inline-block; background: #bad4e1; color: #1e1839; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                  📧 Stuur een Bericht
                </a>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #374151; font-size: 16px; margin-bottom: 8px;">
                  Succes met je transformatie!
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
      message: "Je caloriebehoefte is berekend en we hebben je resultaten naar je e-mail gestuurd!",
    }
  } catch (error) {
    console.error("Error sending calorie form emails:", error)
    return {
      success: false,
      error:
        "Er ging iets mis bij het verzenden van je resultaten. Probeer het opnieuw of neem direct contact met ons op.",
    }
  }
}
