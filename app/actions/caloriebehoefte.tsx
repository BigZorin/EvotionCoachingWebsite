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

export async function sendCaloriebehoefteEmail(data: CaloriebehoefteData) {
  try {
    // Email naar Evotion team
    const teamEmailResult = await resend.emails.send({
      from: "Evotion Website <noreply@evotion-coaching.nl>",
      to: ["info@evotion-coaching.nl"],
      subject: `🚨 NIEUWE LEAD: Caloriebehoefte berekening - ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🚨 NIEUWE LEAD ALERT!</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Caloriebehoefte Calculator</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
            <h2 style="color: #4c1d95; margin: 0 0 20px 0; font-size: 24px;">👤 Contactgegevens</h2>
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0 0 10px 0; font-size: 16px;"><strong>Naam:</strong> ${data.name}</p>
              <p style="margin: 0 0 10px 0; font-size: 16px;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #4c1d95;">${data.email}</a></p>
              ${data.phone ? `<p style="margin: 0; font-size: 16px;"><strong>Telefoon:</strong> <a href="tel:${data.phone}" style="color: #4c1d95;">${data.phone}</a></p>` : ""}
            </div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 30px;">
              <a href="mailto:${data.email}" style="background: #4c1d95; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">📧 Email</a>
              ${data.phone ? `<a href="tel:${data.phone}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">📞 Bellen</a>` : ""}
            </div>
          </div>

          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
            <h2 style="color: #4c1d95; margin: 0 0 20px 0; font-size: 24px;">📊 Persoonlijke Gegevens</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div style="background: #f1f5f9; padding: 15px; border-radius: 8px;">
                <p style="margin: 0; color: #64748b; font-size: 14px;">Leeftijd</p>
                <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: #1e293b;">${data.age} jaar</p>
              </div>
              <div style="background: #f1f5f9; padding: 15px; border-radius: 8px;">
                <p style="margin: 0; color: #64748b; font-size: 14px;">Geslacht</p>
                <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: #1e293b;">${data.gender === "man" ? "Man" : "Vrouw"}</p>
              </div>
              <div style="background: #f1f5f9; padding: 15px; border-radius: 8px;">
                <p style="margin: 0; color: #64748b; font-size: 14px;">Gewicht</p>
                <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: #1e293b;">${data.weight} kg</p>
              </div>
              <div style="background: #f1f5f9; padding: 15px; border-radius: 8px;">
                <p style="margin: 0; color: #64748b; font-size: 14px;">Lengte</p>
                <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: #1e293b;">${data.height} cm</p>
              </div>
            </div>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 15px;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">Activiteitsniveau</p>
              <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: bold; color: #1e293b;">${data.activityLevel}</p>
            </div>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 15px;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">Doel</p>
              <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: bold; color: #1e293b;">${data.goal}</p>
            </div>
          </div>

          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
            <h2 style="color: #4c1d95; margin: 0 0 20px 0; font-size: 24px;">🔥 Berekende Resultaten</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 20px; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: white; font-size: 14px; opacity: 0.9;">BMR</p>
                <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: white;">${Math.round(data.bmr)}</p>
                <p style="margin: 0; color: white; font-size: 12px; opacity: 0.8;">kcal/dag</p>
              </div>
              <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 20px; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: white; font-size: 14px; opacity: 0.9;">TDEE</p>
                <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: white;">${Math.round(data.tdee)}</p>
                <p style="margin: 0; color: white; font-size: 12px; opacity: 0.8;">kcal/dag</p>
              </div>
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: white; font-size: 14px; opacity: 0.9;">Doel</p>
                <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: white;">${Math.round(data.goalCalories)}</p>
                <p style="margin: 0; color: white; font-size: 12px; opacity: 0.8;">kcal/dag</p>
              </div>
            </div>
            
            <h3 style="color: #4c1d95; margin: 20px 0 15px 0; font-size: 18px;">🥗 Macronutriënten</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #f59e0b;">
                <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: bold;">Eiwitten</p>
                <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: #92400e;">${Math.round(data.protein)}g</p>
              </div>
              <div style="background: #dbeafe; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #3b82f6;">
                <p style="margin: 0; color: #1d4ed8; font-size: 14px; font-weight: bold;">Koolhydraten</p>
                <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: #1d4ed8;">${Math.round(data.carbs)}g</p>
              </div>
              <div style="background: #dcfce7; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #22c55e;">
                <p style="margin: 0; color: #15803d; font-size: 14px; font-weight: bold;">Vetten</p>
                <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: #15803d;">${Math.round(data.fat)}g</p>
              </div>
            </div>
          </div>

          <div style="background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%); padding: 25px; border-radius: 12px; text-align: center;">
            <h3 style="color: white; margin: 0 0 15px 0; font-size: 20px;">🎯 Aanbevolen Coaching</h3>
            <p style="color: #e0e7ff; margin: 0 0 20px 0; font-size: 16px;">
              ${
                data.goal.includes("afvallen") || data.goal.includes("gewichtsverlies")
                  ? "Perfect voor ons 12-weken Vetverlies Programma!"
                  : data.goal.includes("spieropbouw")
                    ? "Ideaal voor ons Premium Coaching Programma!"
                    : "Geschikt voor ons Online Coaching Programma!"
              }
            </p>
            <p style="color: white; margin: 0; font-size: 14px; font-weight: bold;">⚡ Neem binnen 24 uur contact op voor beste conversie!</p>
          </div>
        </div>
      `,
    })

    // Bevestigingsmail naar gebruiker
    const userEmailResult = await resend.emails.send({
      from: "Evotion Coaching <noreply@evotion-coaching.nl>",
      to: [data.email],
      subject: `✅ Je persoonlijke caloriebehoefte resultaten - ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🎉 Je Resultaten zijn Klaar!</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Persoonlijke Caloriebehoefte</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
            <h2 style="color: #4c1d95; margin: 0 0 15px 0; font-size: 24px;">Hoi ${data.name}! 👋</h2>
            <p style="color: #64748b; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
              Bedankt voor het invullen van onze caloriebehoefte calculator! Hieronder vind je jouw persoonlijke resultaten 
              op basis van je gegevens. Deze cijfers geven je een goed startpunt voor je fitness journey.
            </p>
          </div>

          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
            <h2 style="color: #4c1d95; margin: 0 0 20px 0; font-size: 24px;">🔥 Jouw Caloriebehoefte</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 25px;">
              <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 20px; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: white; font-size: 14px; opacity: 0.9;">BMR (Basisstofwisseling)</p>
                <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: white;">${Math.round(data.bmr)}</p>
                <p style="margin: 0; color: white; font-size: 12px; opacity: 0.8;">kcal/dag</p>
              </div>
              <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 20px; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: white; font-size: 14px; opacity: 0.9;">TDEE (Totale behoefte)</p>
                <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: white;">${Math.round(data.tdee)}</p>
                <p style="margin: 0; color: white; font-size: 12px; opacity: 0.8;">kcal/dag</p>
              </div>
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: white; font-size: 14px; opacity: 0.9;">Voor jouw doel</p>
                <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: white;">${Math.round(data.goalCalories)}</p>
                <p style="margin: 0; color: white; font-size: 12px; opacity: 0.8;">kcal/dag</p>
              </div>
            </div>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #4c1d95; margin: 0 0 15px 0; font-size: 18px;">📝 Wat betekenen deze cijfers?</h3>
              <ul style="color: #64748b; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li><strong>BMR:</strong> Calorieën die je lichaam in rust verbrandt</li>
                <li><strong>TDEE:</strong> Totale calorieën inclusief activiteit</li>
                <li><strong>Doel:</strong> Aangepaste calorieën voor jouw specifieke doel</li>
              </ul>
            </div>
          </div>

          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
            <h2 style="color: #4c1d95; margin: 0 0 20px 0; font-size: 24px;">🥗 Aanbevolen Macronutriënten</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #f59e0b;">
                <p style="margin: 0; color: #92400e; font-size: 16px; font-weight: bold;">Eiwitten</p>
                <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold; color: #92400e;">${Math.round(data.protein)}g</p>
                <p style="margin: 5px 0 0 0; color: #92400e; font-size: 14px;">${Math.round(((data.protein * 4) / data.goalCalories) * 100)}% van calorieën</p>
              </div>
              <div style="background: #dbeafe; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #3b82f6;">
                <p style="margin: 0; color: #1d4ed8; font-size: 16px; font-weight: bold;">Koolhydraten</p>
                <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold; color: #1d4ed8;">${Math.round(data.carbs)}g</p>
                <p style="margin: 5px 0 0 0; color: #1d4ed8; font-size: 14px;">${Math.round(((data.carbs * 4) / data.goalCalories) * 100)}% van calorieën</p>
              </div>
              <div style="background: #dcfce7; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #22c55e;">
                <p style="margin: 0; color: #15803d; font-size: 16px; font-weight: bold;">Vetten</p>
                <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold; color: #15803d;">${Math.round(data.fat)}g</p>
                <p style="margin: 5px 0 0 0; color: #15803d; font-size: 14px;">${Math.round(((data.fat * 9) / data.goalCalories) * 100)}% van calorieën</p>
              </div>
            </div>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px;">
              <h3 style="color: #4c1d95; margin: 0 0 15px 0; font-size: 18px;">💡 Tips voor succes:</h3>
              <ul style="color: #64748b; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>Verdeel je eiwitten over de dag voor optimale spieropbouw</li>
                <li>Eet koolhydraten rond je trainingen voor energie</li>
                <li>Kies gezonde vetten zoals noten, avocado en olijfolie</li>
                <li>Drink voldoende water (35ml per kg lichaamsgewicht)</li>
              </ul>
            </div>
          </div>

          <div style="background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
            <h2 style="color: white; margin: 0 0 15px 0; font-size: 24px;">🚀 Klaar voor de Volgende Stap?</h2>
            <p style="color: #e0e7ff; margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">
              Deze cijfers zijn een geweldig startpunt, maar voor optimale resultaten heb je een persoonlijk plan nodig. 
              Onze coaches helpen je om deze getallen om te zetten in een praktisch, haalbaar programma.
            </p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
              <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
                <h4 style="color: white; margin: 0 0 10px 0; font-size: 16px;">✅ Wat je krijgt:</h4>
                <ul style="color: #e0e7ff; margin: 0; padding-left: 20px; font-size: 14px; text-align: left;">
                  <li>Persoonlijk voedingsplan</li>
                  <li>Trainingsschema op maat</li>
                  <li>Wekelijkse begeleiding</li>
                  <li>24/7 support via app</li>
                </ul>
              </div>
              <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
                <h4 style="color: white; margin: 0 0 10px 0; font-size: 16px;">🎯 Resultaten:</h4>
                <ul style="color: #e0e7ff; margin: 0; padding-left: 20px; font-size: 14px; text-align: left;">
                  <li>Duurzaam gewichtsverlies</li>
                  <li>Meer energie & focus</li>
                  <li>Betere gezondheid</li>
                  <li>Zelfvertrouwen boost</li>
                </ul>
              </div>
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
              <a href="https://wa.me/31610935077?text=Hoi%20Martin%2C%20ik%20heb%20net%20mijn%20caloriebehoefte%20berekend%20en%20wil%20graag%20meer%20weten%20over%20jullie%20coaching%20programma%27s!" 
                 style="background: #25d366; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                💬 WhatsApp Chat
              </a>
              <a href="tel:+31610935077" 
                 style="background: white; color: #4c1d95; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                📞 Direct Bellen
              </a>
            </div>
          </div>

          <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center;">
            <h3 style="color: #4c1d95; margin: 0 0 15px 0; font-size: 20px;">📞 Contact Opties</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 0 0 5px 0; color: #64748b; font-size: 14px;">WhatsApp</p>
                <p style="margin: 0; color: #4c1d95; font-weight: bold;">+31 6 10935077</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #64748b; font-size: 14px;">Email</p>
                <p style="margin: 0; color: #4c1d95; font-weight: bold;">info@evotion-coaching.nl</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #64748b; font-size: 14px;">Website</p>
                <p style="margin: 0; color: #4c1d95; font-weight: bold;">evotion-coaching.nl</p>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #94a3b8; font-size: 14px; margin: 0;">
              © 2024 Evotion Coaching - Jouw partner in gezondheid en fitness
            </p>
          </div>
        </div>
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
