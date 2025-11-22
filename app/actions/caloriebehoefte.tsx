"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface CaloriebehoefteData {
  name: string
  email: string
  phone?: string
  age: number
  gender: "man" | "vrouw"
  weight: number
  height: number
  activityLevel: string
  goal: string
  bmr: number
  tdee: number
  goalCalories: number
  protein: number
  carbs: number
  fat: number
}

export async function submitCaloriebehoefte(formData: FormData) {
  try {
    // Check if API key is available
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set")
      return {
        success: false,
        error: "Email service is niet beschikbaar. Bel ons direct op 06 10 93 50 77.",
      }
    }

    // Extract data from FormData
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const age = Number(formData.get("age"))
    const gender = formData.get("gender") as "male" | "female"
    const weight = Number(formData.get("weight"))
    const height = Number(formData.get("height"))
    const activityLevel = formData.get("activityLevel") as string
    const goal = formData.get("goal") as string
    const bmr = Number(formData.get("bmr"))
    const tdee = Number(formData.get("tdee"))
    const goalCalories = Number(formData.get("goalCalories"))

    const protein = weight * 1.8
    const fat = weight * 1

    // Calculate remaining calories for carbs
    const proteinCalories = protein * 4
    const fatCalories = fat * 9
    const remainingCalories = Math.max(0, goalCalories - proteinCalories - fatCalories)
    const carbs = remainingCalories / 4

    const data = {
      name,
      email,
      phone,
      age,
      gender: gender === "male" ? "man" : "vrouw",
      weight,
      height,
      activityLevel,
      goal,
      bmr,
      tdee,
      goalCalories,
      protein,
      carbs,
      fat,
    }

    // Email naar Evotion team
    const teamEmailResult = await resend.emails.send({
      from: "Evotion Website <noreply@evotion-coaching.nl>",
      to: ["info@evotion-coaching.nl"],
      subject: `🚨 NIEUWE LEAD: Caloriebehoefte berekening - ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nieuwe Lead - Evotion Coaching</title>
          <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; width: 100%; }
            .header { background-color: #111827; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
            .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
            @media only screen and (max-width: 480px) {
              .grid-2, .grid-3 { grid-template-columns: 1fr !important; }
              .content { padding: 20px !important; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            
            <!-- Header -->
            <div class="header">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">🚨 NIEUWE LEAD</h1>
              <p style="color: #d1d5db; margin: 8px 0 0 0; font-size: 16px;">Caloriebehoefte Calculator</p>
            </div>
            
            <!-- Content -->
            <div class="content">
              
              <!-- Contact Info -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Contactgegevens</h2>
                
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 12px 0; color: #374151; font-size: 16px;"><strong style="color: #111827;">Naam:</strong> ${data.name}</p>
                  <p style="margin: 0 0 12px 0; color: #374151; font-size: 16px;"><strong style="color: #111827;">Email:</strong> <a href="mailto:${data.email}" style="color: #111827; text-decoration: underline;">${data.email}</a></p>
                  ${data.phone ? `<p style="margin: 0; color: #374151; font-size: 16px;"><strong style="color: #111827;">Telefoon:</strong> <a href="tel:${data.phone}" style="color: #111827; text-decoration: underline;">${data.phone}</a></p>` : ""}
                </div>
                
                <div style="margin-top: 15px;">
                  <a href="mailto:${data.email}" style="display: inline-block; background-color: #111827; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-right: 10px;">📧 Email</a>
                  ${data.phone ? `<a href="tel:${data.phone}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 500;">📞 Bellen</a>` : ""}
                </div>
              </div>

              <!-- Personal Data -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Persoonlijke Gegevens</h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 15px;">
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Leeftijd</p>
                    <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">${data.age} jaar</p>
                  </div>
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Geslacht</p>
                    <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">${data.gender === "man" ? "Man" : "Vrouw"}</p>
                  </div>
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Gewicht</p>
                    <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">${data.weight} kg</p>
                  </div>
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Lengte</p>
                    <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">${data.height} cm</p>
                  </div>
                </div>
                
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; margin-bottom: 12px;">
                  <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Activiteitsniveau</p>
                  <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 500;">${data.activityLevel}</p>
                </div>
                
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Doel</p>
                  <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 500;">${data.goal}</p>
                </div>
              </div>

              <!-- Results -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Berekende Resultaten</h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin-bottom: 20px;">
                  <div style="background-color: #111827; padding: 20px; border-radius: 6px; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #d1d5db; font-size: 14px; font-weight: 500;">BMR</p>
                    <p style="margin: 0 0 3px 0; color: #ffffff; font-size: 20px; font-weight: 600;">${Math.round(data.bmr)}</p>
                    <p style="margin: 0; color: #d1d5db; font-size: 12px;">kcal/dag</p>
                  </div>
                  <div style="background-color: #374151; padding: 20px; border-radius: 6px; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #d1d5db; font-size: 14px; font-weight: 500;">TDEE</p>
                    <p style="margin: 0 0 3px 0; color: #ffffff; font-size: 20px; font-weight: 600;">${Math.round(data.tdee)}</p>
                    <p style="margin: 0; color: #d1d5db; font-size: 12px;">kcal/dag</p>
                  </div>
                  <div style="background-color: #059669; padding: 20px; border-radius: 6px; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #ffffff; font-size: 14px; font-weight: 500;">Doel</p>
                    <p style="margin: 0 0 3px 0; color: #ffffff; font-size: 20px; font-weight: 600;">${Math.round(data.goalCalories)}</p>
                    <p style="margin: 0; color: #ffffff; font-size: 12px;">kcal/dag</p>
                  </div>
                </div>
                
                <h3 style="color: #111827; margin: 20px 0 15px 0; font-size: 18px; font-weight: 600;">Macronutriënten</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Eiwitten</p>
                    <p style="margin: 0 0 3px 0; color: #111827; font-size: 18px; font-weight: 600;">${Math.round(data.protein)}g</p>
                  </div>
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Koolhydraten</p>
                    <p style="margin: 0 0 3px 0; color: #111827; font-size: 18px; font-weight: 600;">${Math.round(data.carbs)}g</p>
                  </div>
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Vetten</p>
                    <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">${Math.round(data.fat)}g</p>
                  </div>
                </div>
              </div>
              
              <!-- Recommendation -->
              <div style="background-color: #111827; padding: 25px; border-radius: 8px; text-align: center;">
                <h3 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Aanbevolen Coaching</h3>
                <p style="color: #d1d5db; margin: 0 0 15px 0; font-size: 16px;">
                  ${
                    data.goal.includes("afvallen") || data.goal.includes("gewichtsverlies")
                      ? "Perfect voor ons 12-weken Vetverlies Programma!"
                      : data.goal.includes("spieropbouw")
                        ? "Ideaal voor ons Premium Coaching Programma!"
                        : "Geschikt voor ons Online Coaching Programma!"
                  }
                </p>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                © 2025 Evotion Coaching - info@evotion-coaching.nl
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `,
    })

    // Bevestigingsmail naar gebruiker
    const userEmailResult = await resend.emails.send({
      from: "Evotion Coaching <noreply@evotion-coaching.nl>",
      to: [data.email],
      subject: `✅ Je persoonlijke caloriebehoefte resultaten - ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Je Caloriebehoefte Resultaten - Evotion Coaching</title>
          <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; width: 100%; }
            .header { background-color: #111827; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
            @media only screen and (max-width: 480px) {
              .grid-3 { grid-template-columns: 1fr !important; }
              .content { padding: 20px !important; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            
            <!-- Header -->
            <div class="header">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">🎉 Je Resultaten zijn Klaar!</h1>
              <p style="color: #d1d5db; margin: 8px 0 0 0; font-size: 16px;">Persoonlijke Caloriebehoefte</p>
            </div>
            
            <!-- Content -->
            <div class="content">
              
              <!-- Welcome -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #111827; margin: 0 0 15px 0; font-size: 22px; font-weight: 600;">Hoi ${data.name}! 👋</h2>
                <p style="color: #374151; margin: 0; font-size: 16px; line-height: 1.6;">
                  Bedankt voor het invullen van onze caloriebehoefte calculator! Hieronder vind je jouw persoonlijke resultaten 
                  op basis van je gegevens. Deze cijfers geven je een goed startpunt voor je fitness journey.
                </p>
              </div>

              <!-- Results -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">🔥 Jouw Caloriebehoefte</h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 25px;">
                  <div style="background-color: #111827; padding: 20px; border-radius: 6px; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #d1d5db; font-size: 14px; font-weight: 500;">BMR (Basisstofwisseling)</p>
                    <p style="margin: 0 0 3px 0; color: #ffffff; font-size: 22px; font-weight: 600;">${Math.round(data.bmr)}</p>
                    <p style="margin: 0; color: #d1d5db; font-size: 12px;">kcal/dag</p>
                  </div>
                  <div style="background-color: #374151; padding: 20px; border-radius: 6px; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #d1d5db; font-size: 14px; font-weight: 500;">TDEE (Totale behoefte)</p>
                    <p style="margin: 0 0 3px 0; color: #ffffff; font-size: 22px; font-weight: 600;">${Math.round(data.tdee)}</p>
                    <p style="margin: 0; color: #d1d5db; font-size: 12px;">kcal/dag</p>
                  </div>
                  <div style="background-color: #059669; padding: 20px; border-radius: 6px; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #ffffff; font-size: 14px; font-weight: 500;">Voor jouw doel</p>
                    <p style="margin: 0 0 3px 0; color: #ffffff; font-size: 22px; font-weight: 600;">${Math.round(data.goalCalories)}</p>
                    <p style="margin: 0; color: #ffffff; font-size: 12px;">kcal/dag</p>
                  </div>
                </div>
                
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb;">
                  <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">📝 Wat betekenen deze cijfers?</h3>
                  <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.6;">
                    <li style="margin-bottom: 8px;"><strong style="color: #111827;">BMR:</strong> Calorieën die je lichaam in rust verbrandt</li>
                    <li style="margin-bottom: 8px;"><strong style="color: #111827;">TDEE:</strong> Totale calorieën inclusief activiteit</li>
                    <li><strong style="color: #111827;">Doel:</strong> Aangepaste calorieën voor jouw specifieke doel</li>
                  </ul>
                </div>
              </div>

              <!-- Macros -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">🥗 Aanbevolen Macronutriënten</h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 20px;">
                  <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Eiwitten</p>
                    <p style="margin: 0 0 3px 0; color: #111827; font-size: 24px; font-weight: 600;">${Math.round(data.protein)}g</p>
                    <p style="margin: 0; color: #6b7280; font-size: 12px;">${Math.round(((data.protein * 4) / data.goalCalories) * 100)}% van calorieën</p>
                  </div>
                  <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Koolhydraten</p>
                    <p style="margin: 0 0 3px 0; color: #111827; font-size: 24px; font-weight: 600;">${Math.round(data.carbs)}g</p>
                    <p style="margin: 0; color: #6b7280; font-size: 12px;">${Math.round(((data.carbs * 4) / data.goalCalories) * 100)}% van calorieën</p>
                  </div>
                  <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Vetten</p>
                    <p style="margin: 0 0 3px 0; color: #111827; font-size: 24px; font-weight: 600;">${Math.round(data.fat)}g</p>
                    <p style="margin: 0; color: #6b7280; font-size: 12px;">${Math.round(((data.fat * 9) / data.goalCalories) * 100)}% van calorieën</p>
                  </div>
                </div>
                
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb;">
                  <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">💡 Tips voor succes:</h3>
                  <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.6;">
                    <li style="margin-bottom: 8px;">Verdeel je eiwitten over de dag voor optimale spieropbouw</li>
                    <li style="margin-bottom: 8px;">Eet koolhydraten rond je trainingen voor energie</li>
                    <li style="margin-bottom: 8px;">Kies gezonde vetten zoals noten, avocado en olijfolie</li>
                    <li>Drink voldoende water (35ml per kg lichaamsgewicht)</li>
                  </ul>
                </div>
              </div>

              <!-- CTA -->
              <div style="background-color: #111827; padding: 25px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
                <h2 style="color: #ffffff; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">🚀 Klaar voor de Volgende Stap?</h2>
                <p style="color: #d1d5db; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                  Deze cijfers zijn een geweldig startpunt, maar voor optimale resultaten heb je een persoonlijk plan nodig. 
                  Onze coaches helpen je om deze getallen om te zetten in een praktisch, haalbaar programma.
                </p>
                
                <div style="margin-bottom: 20px;">
                  <div style="display: inline-block; background-color: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px; margin: 0 10px 10px 0; text-align: left; vertical-align: top; width: 200px;">
                    <h4 style="color: #ffffff; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">✅ Wat je krijgt:</h4>
                    <ul style="color: #d1d5db; margin: 0; padding-left: 15px; font-size: 13px; line-height: 1.4;">
                      <li>Persoonlijk voedingsplan</li>
                      <li>Trainingsschema op maat</li>
                      <li>Wekelijkse begeleiding</li>
                      <li>24/7 support via app</li>
                    </ul>
                  </div>
                  <div style="display: inline-block; background-color: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px; margin: 0 10px 10px 0; text-align: left; vertical-align: top; width: 200px;">
                    <h4 style="color: #ffffff; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">🎯 Resultaten:</h4>
                    <ul style="color: #d1d5db; margin: 0; padding-left: 15px; font-size: 13px; line-height: 1.4;">
                      <li>Duurzaam gewichtsverlies</li>
                      <li>Meer energie & focus</li>
                      <li>Betere gezondheid</li>
                      <li>Zelfvertrouwen boost</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <a href="https://wa.me/31610935077?text=Hoi%20Martin%2C%20ik%20heb%20net%20mijn%20caloriebehoefte%20berekend%20en%20wil%20graag%20meer%20weten%20over%20jullie%20coaching%20programma%27s!" 
                     style="display: inline-block; background-color: #25d366; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 0 8px 8px 0;">
                    💬 WhatsApp Chat
                  </a>
                  <a href="tel:+31610935077" 
                     style="display: inline-block; background-color: #ffffff; color: #111827; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 0 8px 8px 0;">
                    📞 Direct Bellen
                  </a>
                </div>
              </div>

              <!-- Contact -->
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📞 Contact Opties</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                  <div>
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">WhatsApp</p>
                    <p style="margin: 0; color: #111827; font-weight: 600;">+31 6 10935077</p>
                  </div>
                  <div>
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Email</p>
                    <p style="margin: 0; color: #111827; font-weight: 600;">info@evotion-coaching.nl</p>
                  </div>
                  <div>
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Website</p>
                    <p style="margin: 0; color: #111827; font-weight: 600;">evotion-coaching.nl</p>
                  </div>
                </div>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                © 2025 Evotion Coaching - Jouw partner in gezondheid en fitness
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `,
    })

    return {
      success: true,
      message: "Emails verzonden! Check je inbox voor je persoonlijke resultaten.",
      teamEmailId: teamEmailResult.data?.id,
      userEmailId: userEmailResult.data?.id,
    }
  } catch (error) {
    console.error("Error sending caloriebehoefte emails:", error)
    return {
      success: false,
      error: "Er ging iets mis bij het verzenden van de emails.",
    }
  }
}

export async function sendCaloriebehoefteEmail(data: CaloriebehoefteData) {
  try {
    // Check if API key is available
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set")
      return {
        success: false,
        error: "Email service is niet beschikbaar. Bel ons direct op 06 10 93 50 77.",
      }
    }

    // Email naar Evotion team
    const teamEmailResult = await resend.emails.send({
      from: "Evotion Website <noreply@evotion-coaching.nl>",
      to: ["info@evotion-coaching.nl"],
      subject: `🚨 NIEUWE LEAD: Caloriebehoefte berekening - ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nieuwe Lead - Evotion Coaching</title>
          <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; width: 100%; }
            .header { background-color: #111827; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
            .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
            @media only screen and (max-width: 480px) {
              .grid-2, .grid-3 { grid-template-columns: 1fr !important; }
              .content { padding: 20px !important; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            
            <!-- Header -->
            <div class="header">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">🚨 NIEUWE LEAD</h1>
              <p style="color: #d1d5db; margin: 8px 0 0 0; font-size: 16px;">Caloriebehoefte Calculator</p>
            </div>
            
            <!-- Content -->
            <div class="content">
              
              <!-- Contact Info -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Contactgegevens</h2>
                
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 12px 0; color: #374151; font-size: 16px;"><strong style="color: #111827;">Naam:</strong> ${data.name}</p>
                  <p style="margin: 0 0 12px 0; color: #374151; font-size: 16px;"><strong style="color: #111827;">Email:</strong> <a href="mailto:${data.email}" style="color: #111827; text-decoration: underline;">${data.email}</a></p>
                  ${data.phone ? `<p style="margin: 0; color: #374151; font-size: 16px;"><strong style="color: #111827;">Telefoon:</strong> <a href="tel:${data.phone}" style="color: #111827; text-decoration: underline;">${data.phone}</a></p>` : ""}
                </div>
                
                <div style="margin-top: 15px;">
                  <a href="mailto:${data.email}" style="display: inline-block; background-color: #111827; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-right: 10px;">📧 Email</a>
                  ${data.phone ? `<a href="tel:${data.phone}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 500;">📞 Bellen</a>` : ""}
                </div>
              </div>

              <!-- Personal Data -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Persoonlijke Gegevens</h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 15px;">
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Leeftijd</p>
                    <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">${data.age} jaar</p>
                  </div>
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Geslacht</p>
                    <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">${data.gender === "man" ? "Man" : "Vrouw"}</p>
                  </div>
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Gewicht</p>
                    <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">${data.weight} kg</p>
                  </div>
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Lengte</p>
                    <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">${data.height} cm</p>
                  </div>
                </div>
                
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; margin-bottom: 12px;">
                  <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Activiteitsniveau</p>
                  <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 500;">${data.activityLevel}</p>
                </div>
                
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Doel</p>
                  <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 500;">${data.goal}</p>
                </div>
              </div>

              <!-- Results -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Berekende Resultaten</h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin-bottom: 20px;">
                  <div style="background-color: #111827; padding: 20px; border-radius: 6px; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #d1d5db; font-size: 14px; font-weight: 500;">BMR</p>
                    <p style="margin: 0 0 3px 0; color: #ffffff; font-size: 20px; font-weight: 600;">${Math.round(data.bmr)}</p>
                    <p style="margin: 0; color: #d1d5db; font-size: 12px;">kcal/dag</p>
                  </div>
                  <div style="background-color: #374151; padding: 20px; border-radius: 6px; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #d1d5db; font-size: 14px; font-weight: 500;">TDEE</p>
                    <p style="margin: 0 0 3px 0; color: #ffffff; font-size: 20px; font-weight: 600;">${Math.round(data.tdee)}</p>
                    <p style="margin: 0; color: #d1d5db; font-size: 12px;">kcal/dag</p>
                  </div>
                  <div style="background-color: #059669; padding: 20px; border-radius: 6px; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #ffffff; font-size: 14px; font-weight: 500;">Doel</p>
                    <p style="margin: 0 0 3px 0; color: #ffffff; font-size: 20px; font-weight: 600;">${Math.round(data.goalCalories)}</p>
                    <p style="margin: 0; color: #ffffff; font-size: 12px;">kcal/dag</p>
                  </div>
                </div>
                
                <h3 style="color: #111827; margin: 20px 0 15px 0; font-size: 18px; font-weight: 600;">Macronutriënten</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Eiwitten</p>
                    <p style="margin: 0 0 3px 0; color: #111827; font-size: 18px; font-weight: 600;">${Math.round(data.protein)}g</p>
                  </div>
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Koolhydraten</p>
                    <p style="margin: 0 0 3px 0; color: #111827; font-size: 18px; font-weight: 600;">${Math.round(data.carbs)}g</p>
                  </div>
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Vetten</p>
                    <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">${Math.round(data.fat)}g</p>
                  </div>
                </div>
              </div>

              <!-- Recommendation -->
              <div style="background-color: #111827; padding: 25px; border-radius: 8px; text-align: center;">
                <h3 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Aanbevolen Coaching</h3>
                <p style="color: #d1d5db; margin: 0 0 15px 0; font-size: 16px;">
                  ${
                    data.goal.includes("afvallen") || data.goal.includes("gewichtsverlies")
                      ? "Perfect voor ons 12-weken Vetverlies Programma!"
                      : data.goal.includes("spieropbouw")
                        ? "Ideaal voor ons Premium Coaching Programma!"
                        : "Geschikt voor ons Online Coaching Programma!"
                  }
                </p>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                © 2025 Evotion Coaching - info@evotion-coaching.nl
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `,
    })

    // Bevestigingsmail naar gebruiker
    const userEmailResult = await resend.emails.send({
      from: "Evotion Coaching <noreply@evotion-coaching.nl>",
      to: [data.email],
      subject: `✅ Je persoonlijke caloriebehoefte resultaten - ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Je Caloriebehoefte Resultaten - Evotion Coaching</title>
          <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; width: 100%; }
            .header { background-color: #111827; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
            @media only screen and (max-width: 480px) {
              .grid-3 { grid-template-columns: 1fr !important; }
              .content { padding: 20px !important; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            
            <!-- Header -->
            <div class="header">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">🎉 Je Resultaten zijn Klaar!</h1>
              <p style="color: #d1d5db; margin: 8px 0 0 0; font-size: 16px;">Persoonlijke Caloriebehoefte</p>
            </div>
            
            <!-- Content -->
            <div class="content">
              
              <!-- Welcome -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #111827; margin: 0 0 15px 0; font-size: 22px; font-weight: 600;">Hoi ${data.name}! 👋</h2>
                <p style="color: #374151; margin: 0; font-size: 16px; line-height: 1.6;">
                  Bedankt voor het invullen van onze caloriebehoefte calculator! Hieronder vind je jouw persoonlijke resultaten 
                  op basis van je gegevens. Deze cijfers geven je een goed startpunt voor je fitness journey.
                </p>
              </div>

              <!-- Results -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">🔥 Jouw Caloriebehoefte</h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 25px;">
                  <div style="background-color: #111827; padding: 20px; border-radius: 6px; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #d1d5db; font-size: 14px; font-weight: 500;">BMR (Basisstofwisseling)</p>
                    <p style="margin: 0 0 3px 0; color: #ffffff; font-size: 22px; font-weight: 600;">${Math.round(data.bmr)}</p>
                    <p style="margin: 0; color: #d1d5db; font-size: 12px;">kcal/dag</p>
                  </div>
                  <div style="background-color: #374151; padding: 20px; border-radius: 6px; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #d1d5db; font-size: 14px; font-weight: 500;">TDEE (Totale behoefte)</p>
                    <p style="margin: 0 0 3px 0; color: #ffffff; font-size: 22px; font-weight: 600;">${Math.round(data.tdee)}</p>
                    <p style="margin: 0; color: #d1d5db; font-size: 12px;">kcal/dag</p>
                  </div>
                  <div style="background-color: #059669; padding: 20px; border-radius: 6px; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #ffffff; font-size: 14px; font-weight: 500;">Voor jouw doel</p>
                    <p style="margin: 0 0 3px 0; color: #ffffff; font-size: 22px; font-weight: 600;">${Math.round(data.goalCalories)}</p>
                    <p style="margin: 0; color: #ffffff; font-size: 12px;">kcal/dag</p>
                  </div>
                </div>
                
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb;">
                  <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">📝 Wat betekenen deze cijfers?</h3>
                  <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.6;">
                    <li style="margin-bottom: 8px;"><strong style="color: #111827;">BMR:</strong> Calorieën die je lichaam in rust verbrandt</li>
                    <li style="margin-bottom: 8px;"><strong style="color: #111827;">TDEE:</strong> Totale calorieën inclusief activiteit</li>
                    <li><strong style="color: #111827;">Doel:</strong> Aangepaste calorieën voor jouw specifieke doel</li>
                  </ul>
                </div>
              </div>

              <!-- Macros -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">🥗 Aanbevolen Macronutriënten</h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 20px;">
                  <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Eiwitten</p>
                    <p style="margin: 0 0 3px 0; color: #111827; font-size: 24px; font-weight: 600;">${Math.round(data.protein)}g</p>
                    <p style="margin: 0; color: #6b7280; font-size: 12px;">${Math.round(((data.protein * 4) / data.goalCalories) * 100)}% van calorieën</p>
                  </div>
                  <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Koolhydraten</p>
                    <p style="margin: 0 0 3px 0; color: #111827; font-size: 24px; font-weight: 600;">${Math.round(data.carbs)}g</p>
                    <p style="margin: 0; color: #6b7280; font-size: 12px;">${Math.round(((data.carbs * 4) / data.goalCalories) * 100)}% van calorieën</p>
                  </div>
                  <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Vetten</p>
                    <p style="margin: 0 0 3px 0; color: #111827; font-size: 24px; font-weight: 600;">${Math.round(data.fat)}g</p>
                    <p style="margin: 0; color: #6b7280; font-size: 12px;">${Math.round(((data.fat * 9) / data.goalCalories) * 100)}% van calorieën</p>
                  </div>
                </div>
                
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb;">
                  <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">💡 Tips voor succes:</h3>
                  <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.6;">
                    <li style="margin-bottom: 8px;">Verdeel je eiwitten over de dag voor optimale spieropbouw</li>
                    <li style="margin-bottom: 8px;">Eet koolhydraten rond je trainingen voor energie</li>
                    <li style="margin-bottom: 8px;">Kies gezonde vetten zoals noten, avocado en olijfolie</li>
                    <li>Drink voldoende water (35ml per kg lichaamsgewicht)</li>
                  </ul>
                </div>
              </div>

              <!-- CTA -->
              <div style="background-color: #111827; padding: 25px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
                <h2 style="color: #ffffff; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">🚀 Klaar voor de Volgende Stap?</h2>
                <p style="color: #d1d5db; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                  Deze cijfers zijn een geweldig startpunt, maar voor optimale resultaten heb je een persoonlijk plan nodig. 
                  Onze coaches helpen je om deze getallen om te zetten in een praktisch, haalbaar programma.
                </p>
                
                <div style="margin-bottom: 20px;">
                  <div style="display: inline-block; background-color: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px; margin: 0 10px 10px 0; text-align: left; vertical-align: top; width: 200px;">
                    <h4 style="color: #ffffff; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">✅ Wat je krijgt:</h4>
                    <ul style="color: #d1d5db; margin: 0; padding-left: 15px; font-size: 13px; line-height: 1.4;">
                      <li>Persoonlijk voedingsplan</li>
                      <li>Trainingsschema op maat</li>
                      <li>Wekelijkse begeleiding</li>
                      <li>24/7 support via app</li>
                    </ul>
                  </div>
                  <div style="display: inline-block; background-color: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px; margin: 0 10px 10px 0; text-align: left; vertical-align: top; width: 200px;">
                    <h4 style="color: #ffffff; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">🎯 Resultaten:</h4>
                    <ul style="color: #d1d5db; margin: 0; padding-left: 15px; font-size: 13px; line-height: 1.4;">
                      <li>Duurzaam gewichtsverlies</li>
                      <li>Meer energie & focus</li>
                      <li>Betere gezondheid</li>
                      <li>Zelfvertrouwen boost</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <a href="https://wa.me/31610935077?text=Hoi%20Martin%2C%20ik%20heb%20net%20mijn%20caloriebehoefte%20berekend%20en%20wil%20graag%20meer%20weten%20over%20jullie%20coaching%20programma%27s!" 
                     style="display: inline-block; background-color: #25d366; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 0 8px 8px 0;">
                    💬 WhatsApp Chat
                  </a>
                  <a href="tel:+31610935077" 
                     style="display: inline-block; background-color: #ffffff; color: #111827; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 0 8px 8px 0;">
                    📞 Direct Bellen
                  </a>
                </div>
              </div>

              <!-- Contact -->
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📞 Contact Opties</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                  <div>
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">WhatsApp</p>
                    <p style="margin: 0; color: #111827; font-weight: 600;">+31 6 10935077</p>
                  </div>
                  <div>
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Email</p>
                    <p style="margin: 0; color: #111827; font-weight: 600;">info@evotion-coaching.nl</p>
                  </div>
                  <div>
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Website</p>
                    <p style="margin: 0; color: #111827; font-weight: 600;">evotion-coaching.nl</p>
                  </div>
                </div>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                © 2025 Evotion Coaching - Jouw partner in gezondheid en fitness
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `,
    })

    return {
      success: true,
      message: "Emails verzonden! Check je inbox voor je persoonlijke resultaten.",
      teamEmailId: teamEmailResult.data?.id,
      userEmailId: userEmailResult.data?.id,
    }
  } catch (error) {
    console.error("Error sending caloriebehoefte emails:", error)
    return {
      success: false,
      error: "Er ging iets mis bij het verzenden van de emails.",
    }
  }
}
