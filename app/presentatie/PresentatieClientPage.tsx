"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Target,
  Zap,
  TrendingUp,
  Heart,
  Smartphone,
  GraduationCap,
  MessageCircle,
  Video,
  BarChart3,
  Users,
  Repeat,
  Settings,
  UtensilsCrossed,
  ExternalLink,
  Apple,
  Dumbbell,
  Pill,
  Clock,
  Award,
  Trophy,
  Medal,
} from "lucide-react"

interface Slide {
  id: number
  title: string
  subtitle?: string
  type: string
  phases?: {
    name: string
    duration: string
    icon: any
  }[]
  modularExplanation?: {
    title: string
    subtitle: string
    points: {
      icon: any
      title: string
      description: string
    }[]
    vision: string
  }
  transformations?: {
    name: string
    image: string
  }[]
  rating?: number
  totalReviews?: number
  reviews?: {
    name: string
    date: string
    rating: number
    text: string
  }[]
  benefits?: {
    icon: any
    title: string
    description: string
    features: string[]
    value: number
  }[]
  benefitDetail?: {
    icon: any
    title: string
    description: string
    features: string[]
    value: number
    detailedDescription: string
    highlights: string[]
    link?: string
    showMockup?: boolean // Added flag
  }
  duration?: string
  icon?: any
  content?: {
    goal?: string
    highlights?: string[]
    result?: string
    title?: string
    subtitle?: string
    points?: {
      icon: any
      title: string
      description: string
    }[]
    goals?: {
      title: string
      description: string
      details: string[]
    }[]
    benefits?: string[]
  }
  goals?: {
    title: string
    description: string
    details: string[]
  }[]
  vision?: {
    title: string
    text: string
    tagline: string
  }
  mission?: {
    title: string
    text: string
    goals: string[]
  }
  coreValues?: {
    icon: any
    title: string
    description: string
  }[]
  // Added benefitCards for intro slide
  benefitCards?: {
    icon: any
    title: string
    description: string
    value: number
  }[]
  // Added coach section
  coach?: {
    name: string
    role: string
    image: string
    experience: string
    tagline: string
    highlights: {
      icon: string
      text: string
    }[]
    certifications?: {
      title: string
      institution: string
      year: string
      link?: string
      badge?: string
      highlight?: boolean
      skills: string[]
    }[]
    featuredCertification?: {
      title: string
      institution: string
      year: string
      link?: string
      badge?: string
      highlight?: boolean
      skills: string[]
    }
    // Added for Zorin
    achievements?: {
      title: string
      badge?: string
      highlight?: boolean
      items: string[]
    }[]
  }
}

const slides: Slide[] = [
  // Slide 0: Intro
  {
    id: 0,
    title: "Welkom bij Evotion Coaching",
    subtitle: "Jouw Transformatiereis van 6-12 Maanden",
    type: "intro",
  },
  {
    id: 1,
    title: "Jouw Coach: Martin Langenberg",
    subtitle: "Gecertificeerd Expert in Metabolisme, Hormonen & Transformatie",
    type: "coach",
    coach: {
      name: "Martin Langenberg",
      role: "Head Coach & Oprichter",
      image: "/images/martin-langenberg.png",
      experience: "25+ jaar ervaring in krachttraining",
      tagline:
        "Personal trainer en coach die drukke professionals helpt om fit en gezond te blijven — met een aanpak die écht past bij jouw leven.",
      highlights: [
        { icon: "Clock", text: "25+ jaar ervaring in krachttraining" },
        { icon: "GraduationCap", text: "Gecertificeerd via N1 Education" },
        { icon: "Heart", text: "Specialist voor drukke ouders en ondernemers" },
        { icon: "Award", text: "Gecertificeerd via Metabolism School" },
      ],
      certifications: [
        {
          title: "Metabolism School",
          institution: "Sam Miller",
          year: "2025",
          link: "https://metabolismschool.com/",
          badge: "UNIEK IN NEDERLAND",
          highlight: true,
          skills: [
            "Diepgaand begrip van het menselijk metabolisme en energiehuishouding",
            "Hormoonbalans en de impact op vetverbranding en spieropbouw",
            "Metabole flexibiliteit optimaliseren voor betere prestaties",
            "Schildklierfunctie en stofwisseling ondersteunen via voeding",
            "Stress, cortisol en hun effect op lichaamscompositie",
            "Praktische strategieën voor metabole gezondheid op lange termijn",
          ],
        },
        {
          title: "Nutrition and Program Design",
          institution: "N1 Education",
          year: "2024",
          highlight: false,
          skills: [
            "Geavanceerde voedingsstrategieën voor verschillende doelen",
            "Periodisering van training en voeding",
            "Individuele programmering op basis van lichaamssignalen",
            "Evidence-based benadering van supplementatie",
          ],
        },
        {
          title: "Personal Trainer Cursus",
          institution: "Menno Henselmans",
          year: "2024",
          highlight: false,
          skills: [
            "Wetenschappelijk onderbouwde trainingsmethodieken",
            "Optimale trainingsfrequentie en volume",
            "Spieropbouw en krachtontwikkeling",
            "Periodisering en progressive overload",
          ],
        },
        {
          title: "Practical Nutrition Level 1 & 2",
          institution: "Frank den Blanken",
          year: "2024",
          highlight: false,
          skills: [
            "Praktische toepassing van voedingsprincipes",
            "Macro- en micronutriënten optimalisatie",
            "Voedingscoaching en gedragsverandering",
            "Maaltijdplanning en voedingsschema's",
          ],
        },
        {
          title: "Personal Trainer Academie",
          institution: "Frank den Blanken",
          year: "2024",
          highlight: false,
          skills: [
            "Cliëntbegeleiding en communicatie",
            "Trainingsanalyse en bewegingsleer",
            "Blessurepreventie en herstel",
            "Langetermijn klantrelaties opbouwen", // Updated skill
          ],
        },
      ],
      featuredCertification: {
        title: "Metabolism School",
        institution: "Sam Miller",
        year: "2025",
        link: "https://metabolismschool.com/",
        badge: "UNIEK IN NEDERLAND",
        highlight: true,
        skills: [
          "Diepgaand begrip van het menselijk metabolisme en energiehuishouding",
          "Hormoonbalans en de impact op vetverbranding en spieropbouw",
          "Metabole flexibiliteit optimaliseren voor betere prestaties",
          "Schildklierfunctie en stofwisseling ondersteunen via voeding",
          "Stress, cortisol en hun effect op lichaamscompositie",
          "Praktische strategieën voor metabole gezondheid op lange termijn",
        ],
      },
    },
  },
  // Slide 2: Coach - Zorin
  {
    id: 2,
    title: "Jouw Coach: Zorin Wijnands",
    subtitle: "6x Nederlands Kampioen Powerlifting & Transformatie Expert",
    type: "coach",
    coach: {
      name: "Zorin Wijnands",
      role: "Coach & Atleet",
      image: "/images/zorin-foto.png",
      experience: "6x Nederlands Kampioen Powerlifting",
      tagline:
        "Van 64kg naar 134kg, van hobby naar 6x Nederlands Kampioen. Met jarenlange ervaring op het hoogste niveau help ik jou je doelen te bereiken.",
      highlights: [
        { icon: "Trophy", text: "6x Nederlands Kampioen Powerlifting" },
        { icon: "Medal", text: "2e plaats EK 2019 + Gouden medaille Deadlift" },
        { icon: "TrendingUp", text: "Eigen transformatie: 64kg → 134kg" },
        { icon: "Target", text: "Team Nederland EK 2019" },
      ],
      achievements: [
        {
          title: "Powerlifting Prestaties",
          badge: "6X NEDERLANDS KAMPIOEN",
          highlight: true,
          items: [
            "Nederlands Kampioen 2018, 2019, 2020, 2021, 2023, 2024",
            "2e plaats Europees Kampioenschap 2019",
            "Gouden medaille Deadlift op EK 2019",
            "Team Nederland vertegenwoordiger",
            "306kg Deadlift WR poging op EK",
          ],
        },
        {
          title: "Personal Records",
          highlight: false,
          items: ["Squat: 260kg", "Bench Press: 193kg", "Deadlift: 340kg", "Totaal: 793kg"],
        },
        {
          title: "Eigen Transformatie",
          highlight: false,
          items: [
            "Startgewicht: 64kg",
            "Huidig gewicht: 134kg",
            "70kg spiermassa erbij",
            "Jarenlange toewijding en discipline",
          ],
        },
        {
          title: "Gecoacht door de Besten",
          highlight: false,
          items: ["Elbert Vastenburg", "Jordi Snijders", "Pjotr Van Der Hoek", "Richard Bell", "Nicky Gorissen"],
        },
      ],
      certifications: [
        {
          title: "Personal Trainer Cursus",
          institution: "Menno Henselmans",
          year: "2023",
          highlight: true,
          badge: "WETENSCHAPPELIJK ONDERBOUWD",
          skills: [
            "Wetenschappelijk onderbouwde trainingsmethodieken",
            "Optimale trainingsfrequentie en volume",
            "Spieropbouw en krachtontwikkeling",
            "Periodisering en progressive overload",
          ],
        },
      ],
    },
  },
  // Slide 3: Modulair programma (was slide 2)
  {
    id: 3,
    title: "Ons Modulair Coachingprogramma",
    subtitle: "5 Flexibele Fases naar Jouw Doel",
    type: "overview",
    phases: [
      { name: "A: Onboarding", duration: "±1 week", icon: Play },
      { name: "B: Herstel", duration: "4-8 weken", icon: Heart },
      { name: "C: Voorbereiding", duration: "2-4 weken", icon: Target },
      { name: "D: Doelfase", duration: "8-12 weken (kan cyclisch herhaald worden)", icon: Zap },
      { name: "E: Optimalisatie", duration: "4-8 weken", icon: TrendingUp },
    ],
    modularExplanation: {
      title: "Waarom Modulair?",
      subtitle: "Jouw Unieke Reis, Geen Standaard Kalender",
      points: [
        {
          icon: Users,
          title: "Iedereen is Uniek",
          description:
            "Jouw lichaam, doelen en uitgangsituatie zijn anders dan die van een ander. Een standaard 8-weken programma werkt daarom niet voor iedereen.",
        },
        {
          icon: Settings,
          title: "Het Programma Past zich aan Jou Aan",
          description:
            "Niet andersom. Elke fase duurt precies zo lang als jij nodig hebt om optimaal resultaat te behalen. Geen haast, geen druk.",
        },
        {
          icon: Repeat,
          title: "Cyclisch & Flexibel",
          description:
            "Bereik een doel, consolideer het resultaat, en start daarna aan een nieuw doel. Alles binnen jouw 6-12 maanden traject.",
        },
      ],
      vision:
        "Onze visie: Duurzame transformatie ontstaat niet door iedereen in hetzelfde keurslijf te persen, maar door een programma te creëren dat zich aanpast aan jouw persoonlijke situatie, tempo en ambities. Zo bereik je niet alleen je doel, maar leer je ook hoe je dit voor altijd kunt behouden.",
    },
  },
  // Slide 4: Fase A - Onboarding (was slide 3)
  {
    id: 4,
    title: "Fase A: Onboarding",
    duration: "±1 week",
    icon: Play,
    type: "phase",
    content: {
      goal: "Een sterke basis leggen en kennismaken met de coach en alle tools",
      highlights: [
        "Uitgebreide intake en persoonlijk gesprek",
        "Op maat gemaakt trainings- en voedingsschema",
        "Toegang tot de Evotion Coaching App",
        "Toegang tot e-learning portal en klanten support",
        "Beginmetingen: gewicht, omvang en foto's",
        "Duidelijk plan van aanpak voor de komende maanden",
      ],
      result: "Je weet precies wat te doen en hoe je vooruitgang wordt bijgehouden",
    },
  },
  // Slide 5: Fase B - Herstel (was slide 4)
  {
    id: 5,
    title: "Fase B: Herstel / Restoration",
    duration: "4-8 weken",
    icon: Heart,
    type: "phase",
    content: {
      goal: "Metabolisme en gezonde gewoontes herstellen na eerdere diëten of ongezonde leefstijl",
      highlights: [
        "Reverse dieting: calorie-inname geleidelijk verhogen",
        "Herstel van hormonale balans en stofwisseling",
        "Opbouwen van gezonde eet- en beweeggewoonten",
        "Focus op slaapritme en stressreductie",
        "Lichte training met nadruk op techniek",
        "Wekelijkse check-ins voor monitoring en support",
      ],
      result: "Je lichaam is uit de 'spaarstand' en je voelt je energiek en gemotiveerd",
    },
  },
  // Slide 6: Fase C - Voorbereiding (was slide 5)
  {
    id: 6,
    title: "Fase C: Voorbereiding",
    duration: "2-4 weken",
    icon: Target,
    type: "phase",
    content: {
      goal: "Mentaal en fysiek klaarstomen voor de naderende intensieve doelgerichte fase",
      highlights: [
        "Trainingsintensiteit geleidelijk opschalen",
        "Voedingsregime aanscherpen richting specifieke doel",
        "Concrete subdoelen en realistische verwachtingen stellen",
        "Strategieën leren voor mogelijke plateaus via e-learning",
        "Mentale voorbereiding op de komende uitdaging",
        "Intensievere check-ins en coach feedback",
      ],
      result: "Je bent lichamelijk optimaal belastbaar en mentaal scherp aan de start",
    },
  },
  // Slide 7: Fase D - Doelfase (was slide 6)
  {
    id: 7,
    title: "Fase D: Doelfase",
    duration: "8-12 weken (kan cyclisch herhaald worden)",
    icon: Zap,
    type: "phase-goals",
    goals: [
      {
        title: "Vetverlies",
        description: "Afslanken op een verantwoorde, duurzame manier",
        details: [
          "Gematigd calorisch tekort (~20% onder onderhoud)",
          "Gezond tempo: ~0,5 kg per week",
          "Krachttraining om spiermassa te behouden",
          "Verhoogde activiteit en cardio",
          "Wekelijkse monitoring en bijsturing",
        ],
      },
      {
        title: "Spieropbouw",
        description: "Toename in spiermassa en kracht",
        details: [
          "Calorisch overschot (10-20% boven onderhoud)",
          "Intensieve krachttraining met progressive overload",
          "1,6-2g eiwit per kg lichaamsgewicht",
          "Focus op hypertrofie-range (6-12 reps)",
          "Voldoende rust voor spiergroei",
        ],
      },
      {
        title: "Herstel",
        description: "Actief herstel van blessure of overbelasting",
        details: [
          "Specifieke fysiotherapie-oefeningen",
          "Mobiliteitstraining en core-stability",
          "Optimale voeding voor weefselherstel",
          "Anti-inflammatoire voedingsmiddelen",
          "Stressmanagement en slaapoptimalisatie",
        ],
      },
      {
        title: "Energie & Vitaliteit",
        description: "Dagelijks energieniveau verhogen",
        details: [
          "Slaappatronen verbeteren (7-8 uur)",
          "Stabiele bloedsuikerspiegel door juiste voeding",
          "Matig-intensieve cardio voor conditie",
          "Balans tussen activiteit en ontspanning",
          "Focus op duurzame leefstijl-aanpassingen",
        ],
      },
    ],
  },
  // Slide 8: Fase E - Optimalisatie (was slide 7)
  {
    id: 8,
    title: "Fase E: Optimalisatie",
    duration: "4-8 weken",
    icon: TrendingUp,
    type: "phase",
    content: {
      goal: "Behaalde resultaten verankeren en verdere fine-tuning",
      highlights: [
        "Nieuwe balans vinden: gewicht stabiliseren",
        "Onderhoudsplan ontwikkelen voor lange termijn",
        "Evaluatie en zelfreflectie van het traject",
        "Verfijnen van techniek en gewoontes",
        "Zelfstandig kunnen handhaven van resultaten",
        "Afsluiting met complete transformatie-analyse",
      ],
      result: "Je hebt je doel bereikt én de vaardigheden om dit te behouden",
    },
  },
  // Slide 9: Flexibiliteit (was slide 8)
  {
    id: 9,
    title: "Flexibel & Cyclisch Programma",
    type: "flexibility",
    content: {
      title: "Maximale Flexibiliteit voor Jouw Reis",
      points: [
        {
          icon: Calendar,
          title: "Niet Kalendergebonden",
          description: "Je kunt op elk moment instromen en het programma past zich aan jouw tempo aan",
        },
        {
          icon: Target,
          title: "Meerdere Doelen Bereiken",
          description: "Na fase E kun je terugkeren naar fase C voor een nieuw doel binnen de 12 maanden",
        },
        {
          icon: CheckCircle2,
          title: "Gepersonaliseerd Traject",
          description: "Elke fase duurt zo lang als jij nodig hebt voor optimale resultaten",
        },
      ],
    },
  },
  // Slide 10: Waarde Overzicht intro (was slide 9)
  {
    id: 10,
    title: "Wat Je Krijgt Tijdens het Traject",
    subtitle: "Volledige Ondersteuning voor Jouw Transformatie",
    type: "benefits-intro",
    benefitCards: [
      {
        icon: Smartphone,
        title: "Evotion Coaching App",
        description: "Jouw trainingsschema's, voedingsplannen en directe communicatie met je coach in één app.",
        value: 600,
      },
      {
        icon: GraduationCap,
        title: "E-Learning Portal",
        description: "Uitgebreide kennisbank met lessen over training, voeding, mindset en meer.",
        value: 750,
      },
      {
        icon: UtensilsCrossed,
        title: "Voedingvervanger Tool",
        description: "Gemakkelijk voeding vervangen met alternatieven die bij je macro's passen.",
        value: 200,
      },
      {
        icon: MessageCircle,
        title: "Klanten Support Portal",
        description: "Stel vragen en krijg persoonlijke video-antwoorden van je coach.",
        value: 400,
      },
      {
        icon: Video,
        title: "Wekelijkse Check-ins",
        description: "Regelmatige evaluaties van je voortgang met bijsturing waar nodig.",
        value: 1200,
      },
      {
        icon: BarChart3,
        title: "Voortgangsanalyses",
        description: "Gedetailleerde inzichten in je ontwikkeling met visuele grafieken.",
        value: 350,
      },
      {
        icon: Apple,
        title: "Persoonlijk Voedingsschema",
        description: "Op maat gemaakt voedingsplan afgestemd op jouw doelen en voorkeuren.",
        value: 400,
      },
      {
        icon: Dumbbell,
        title: "Persoonlijk Trainingsschema",
        description: "Gepersonaliseerd trainingsplan met video-uitleg voor elke oefening.",
        value: 500,
      },
      {
        icon: Pill,
        title: "Supplementen Schema",
        description: "Advies over welke supplementen nuttig zijn voor jouw specifieke doelen.",
        value: 150,
      },
    ],
  },
  // Slide 11: Evotion Coaching App (was 11)
  {
    id: 11,
    title: "De Evotion Coaching App",
    type: "benefit-detail",
    benefitDetail: {
      icon: Smartphone,
      title: "De Evotion Coaching App",
      description:
        "Jouw persoonlijke trainingsschema's, voedingsplannen en directe communicatie met je coach. Alles in één app.",
      features: [
        "Gepersonaliseerde workouts met video-instructies",
        "Voedingsplannen en macro-tracking",
        "Real-time voortgangsmonitoring",
        "Direct contact met je coach via chat",
      ],
      value: 600,
      detailedDescription:
        "De Evotion Coaching App is het kloppende hart van jouw transformatie. Met deze krachtige tool heb je 24/7 toegang tot al je trainingsschema's, voedingsplannen en directe communicatie met je persoonlijke coach. De app is speciaal ontwikkeld om jou de beste ervaring te geven tijdens je reis.",
      highlights: [
        "Trainingsschema's met gedetailleerde video-instructies voor elke oefening",
        "Voedingsplannen op maat met automatische macro-berekeningen",
        "Foto-uploads voor voortgangsmonitoring en feedback",
        "Chat-functie voor directe vragen aan je coach",
        "Notificaties en herinneringen om je op schema te houden",
        "Uitgebreide statistieken en grafieken van je voortgang",
      ],
      showMockup: true, // Added flag
    },
  },
  // Slide 12: E-Learning Portal (was 12)
  {
    id: 12,
    title: "E-Learning Portal",
    type: "benefit-detail",
    benefitDetail: {
      icon: GraduationCap,
      title: "E-Learning Portal (12weken.evotion-coaching.nl)",
      description:
        "Toegang tot onze complete kennisbank met lessen over training, voeding, mindset en meer. Bouw zelfkennis op.",
      features: [
        "Gestructureerde lessen per onderwerp",
        "Handleidingen en interactieve tools",
        "Wetenschappelijk onderbouwde informatie",
        "Op je eigen tempo leren",
      ],
      value: 750,
      detailedDescription:
        "Kennis is macht, en met ons E-Learning Portal krijg je toegang tot een schat aan informatie. Van de basis van training en voeding tot geavanceerde strategieën voor mindset en gedragsverandering. Alles wat je nodig hebt om niet alleen resultaat te behalen, maar ook te begrijpen waarom.",
      highlights: [
        "Uitgebreide modules over training, voeding, mindset en herstel",
        "Wetenschappelijk onderbouwde informatie in begrijpelijke taal",
        "Interactieve quizzen om je kennis te testen",
        "Downloadbare handleidingen en checklists",
        "Video-lessen van ervaren coaches",
        "Toegang tot nieuwe content die regelmatig wordt toegevoegd",
      ],
      link: "https://12weken.evotion-coaching.nl",
    },
  },
  // Slide 13: Voedingvervanger Tool (was 13)
  {
    id: 13,
    title: "Voedingvervanger Tool",
    type: "benefit-detail",
    benefitDetail: {
      icon: UtensilsCrossed,
      title: "Voedingvervanger Tool",
      description:
        "Gemakkelijk voeding vervangen met alternatieven die passen bij jouw macro's en voorkeuren. Nooit meer vastzitten aan dezelfde maaltijden.",
      features: [
        "Slimme voedingsalternatieven zoeken",
        "Behoud je macro's met andere producten",
        "Rekening houden met allergieën en voorkeuren",
        "Database met honderden voedingsmiddelen",
      ],
      value: 200,
      detailedDescription:
        "Beu van steeds dezelfde maaltijden? Met de Voedingvervanger Tool kun je in seconden alternatieven vinden die perfect passen bij je macro's. Of je nu een allergie hebt, bepaalde voedingsmiddelen niet lekker vindt, of gewoon wat variatie wilt - deze tool maakt het makkelijk.",
      highlights: [
        "Zoek direct alternatieven voor elk voedingsmiddel",
        "Behoud exact dezelfde macro's met andere producten",
        "Filter op allergieën en dieetvoorkeuren",
        "Database met honderden Nederlandse voedingsmiddelen",
        "Ontdek nieuwe ingrediënten die bij jouw doelen passen",
        "Maak variatie in je maaltijden zonder extra rekenwerk",
      ],
      link: "https://voedingvervanger.evotion-coaching.nl",
    },
  },
  // Slide 14: Klanten Support Portal (was 14)
  {
    id: 14,
    title: "Klanten Support Portal",
    type: "benefit-detail",
    benefitDetail: {
      icon: MessageCircle,
      title: "Klanten Support Portal",
      description:
        "Stel je vragen en krijg antwoorden in video-format. Persoonlijk en uitgebreid beantwoord door je coach.",
      features: [
        "Video-antwoorden op al je vragen",
        "Persoonlijke uitleg en voorbeelden",
        "Toegang tot eerdere Q&A's",
        "Snelle reactietijd van je coach",
      ],
      value: 400,
      detailedDescription:
        "Heb je een vraag? Via het Klanten Support Portal krijg je persoonlijke video-antwoorden van je coach. Geen standaard tekst-replies, maar echte uitleg met voorbeelden en demonstraties. Plus toegang tot een uitgebreide bibliotheek van eerder gestelde vragen.",
      highlights: [
        "Stel elke vraag die je hebt over training, voeding of mindset",
        "Ontvang persoonlijke video-antwoorden van je coach",
        "Visuele uitleg met demonstraties waar nodig",
        "Doorzoekbare bibliotheek van eerdere Q&A's",
        "Leer van vragen die andere klanten hebben gesteld",
        "Snelle reactietijd, meestal binnen 24-48 uur",
      ],
      link: "https://klanten.evotion-coaching.nl",
    },
  },
  // Slide 15: Wekelijkse Check-ins (was 15)
  {
    id: 15,
    title: "Wekelijkse Check-ins",
    type: "benefit-detail",
    benefitDetail: {
      icon: Video,
      title: "Wekelijkse Check-ins",
      description:
        "Regelmatige evaluaties van je voortgang met je persoonlijke coach. Bijsturen waar nodig, vieren van successen.",
      features: [
        "Wekelijkse video-gesprekken of voice notes",
        "Bespreking van voortgang en uitdagingen",
        "Aanpassingen aan programma indien nodig",
        "Motivatie en accountability",
      ],
      value: 1200,
      detailedDescription:
        "De wekelijkse check-ins zijn het fundament van jouw succes. Elke week nemen we samen je voortgang door, bespreken we uitdagingen en vieren we successen. Dit is waar de magie gebeurt - persoonlijke aandacht en bijsturing op het moment dat je het nodig hebt.",
      highlights: [
        "Wekelijkse persoonlijke feedback van je coach",
        "Analyse van je trainingen, voeding en voortgang",
        "Direct bijsturen als iets niet werkt",
        "Motivatie en accountability om door te zetten",
        "Vieren van kleine en grote overwinningen",
        "Ruimte voor al je vragen en zorgen",
      ],
    },
  },
  // Slide 16: Voortgangsanalyses (was 16)
  {
    id: 16,
    title: "Voortgangsanalyses",
    type: "benefit-detail",
    benefitDetail: {
      icon: BarChart3,
      title: "Voortgangsanalyses",
      description:
        "Gedetailleerde inzichten in je ontwikkeling. Van gewicht en omvang tot kracht en uithoudingsvermogen.",
      features: [
        "Wekelijkse metingen en analyses",
        "Visuele grafieken en trends",
        "Voor-en-na vergelijkingen",
        "Data-gedreven bijsturingen",
      ],
      value: 350,
      detailedDescription:
        "Wat niet gemeten wordt, kan niet verbeterd worden. Met onze uitgebreide voortgangsanalyses heb je altijd inzicht in hoe je ervoor staat. Van lichaamssamenstelling tot krachtprestaties - alles wordt bijgehouden en gevisualiseerd.",
      highlights: [
        "Wekelijkse weging en omvangmetingen",
        "Foto-vergelijkingen voor visuele voortgang",
        "Grafieken en trends van al je data",
        "Analyse vaniteitsvolume en intensiteit",
        "Voedingscompliance tracking",
        "Maandelijkse overzichten van je transformatie",
      ],
    },
  },
  {
    id: 17,
    title: "Persoonlijk Voedingsschema",
    type: "benefit-detail",
    benefitDetail: {
      icon: Apple,
      title: "Persoonlijk Voedingsschema",
      description:
        "Een volledig op maat gemaakt voedingsplan dat is afgestemd op jouw doelen, voorkeuren en levensstijl.",
      features: [
        "Op maat berekende macro's en calorieën",
        "Rekening met allergieën en voorkeuren",
        "Flexibele maaltijdopties",
        "Aanpasbaar aan je levensstijl",
      ],
      value: 400,
      detailedDescription:
        "Voeding is de sleutel tot jouw transformatie. Daarom krijg je een volledig gepersonaliseerd voedingsschema dat perfect aansluit bij jouw doelen. Of je nu wilt afvallen, spiermassa wilt opbouwen of je gezondheid wilt verbeteren - je voedingsplan wordt op maat gemaakt.",
      highlights: [
        "Calorieën en macro's berekend op basis van jouw doelen",
        "Rekening houden met allergieën, intoleranties en voorkeuren",
        "Flexibele opties voor ontbijt, lunch, diner en snacks",
        "Makkelijk te volgen zonder ingewikkelde recepten",
        "Regelmatige aanpassingen op basis van je voortgang",
        "Ruimte voor sociale momenten en flexibiliteit",
      ],
    },
  },
  {
    id: 18,
    title: "Persoonlijk Trainingsschema",
    type: "benefit-detail",
    benefitDetail: {
      icon: Dumbbell,
      title: "Persoonlijk Trainingsschema",
      description:
        "Een gepersonaliseerd trainingsplan met video-uitleg voor elke oefening, afgestemd op jouw niveau en doelen.",
      features: [
        "Trainingsplan op maat voor jouw doelen",
        "Video-instructies voor elke oefening",
        "Progressieve overbelasting ingebouwd",
        "Aanpasbaar aan je beschikbare tijd",
      ],
      value: 500,
      detailedDescription:
        "Elk lichaam is anders, en daarom krijg je een trainingsschema dat volledig is afgestemd op jouw niveau, doelen en beschikbare tijd. Van beginners tot gevorderden - je training wordt zo opgebouwd dat je consistent vooruitgang boekt.",
      highlights: [
        "Trainingsplan volledig op maat gemaakt voor jouw doelen",
        "Video-instructies met uitleg van de juiste techniek",
        "Progressieve overbelasting voor continue vooruitgang",
        "Flexibel schema passend bij jouw agenda",
        "Alternatieve oefeningen voor thuistraining of sportschool",
        "Regelmatige aanpassingen op basis van je voortgang en feedback",
      ],
    },
  },
  {
    id: 19,
    title: "Supplementen Schema",
    type: "benefit-detail",
    benefitDetail: {
      icon: Pill,
      title: "Supplementen Schema",
      description: "Duidelijk advies over welke supplementen nuttig zijn voor jouw specifieke doelen en situatie.",
      features: [
        "Persoonlijk supplementenadvies",
        "Gebaseerd op wetenschappelijk bewijs",
        "Geen onnodige producten",
        "Timing en dosering uitgelegd",
      ],
      value: 150,
      detailedDescription:
        "De supplementenindustrie is verwarrend en vol marketing. Wij geven je eerlijk, wetenschappelijk onderbouwd advies over welke supplementen daadwerkelijk nuttig kunnen zijn voor jouw specifieke doelen. Geen onnodige producten, alleen wat echt werkt.",
      highlights: [
        "Eerlijk advies gebaseerd op wetenschappelijk onderzoek",
        "Alleen supplementen die daadwerkelijk meerwaarde bieden",
        "Duidelijke uitleg over timing en dosering",
        "Rekening houden met jouw specifieke situatie en doelen",
        "Geen pushen van onnodige of dure producten",
        "Advies over betrouwbare merken en leveranciers",
      ],
    },
  },
  {
    id: 20,
    title: "Totale Waarde van het Traject",
    type: "benefits-total",
    benefits: [
      { icon: Smartphone, title: "Evotion Coaching App", description: "", features: [], value: 600 },
      { icon: GraduationCap, title: "E-Learning Portal", description: "", features: [], value: 750 },
      { icon: UtensilsCrossed, title: "Voedingvervanger Tool", description: "", features: [], value: 200 },
      { icon: MessageCircle, title: "Klanten Support Portal", description: "", features: [], value: 400 },
      { icon: Video, title: "Wekelijkse Check-ins", description: "", features: [], value: 1200 },
      { icon: BarChart3, title: "Voortgangsanalyses", description: "", features: [], value: 350 },
      { icon: Apple, title: "Persoonlijk Voedingsschema", description: "", features: [], value: 400 },
      { icon: Dumbbell, title: "Persoonlijk Trainingsschema", description: "", features: [], value: 500 },
      { icon: Pill, title: "Supplementen Schema", description: "", features: [], value: 150 },
    ],
  },
  {
    id: 21,
    title: "Bewezen Transformaties",
    subtitle: "Echte Resultaten van Onze Klanten",
    type: "transformations",
    transformations: [
      { name: "Martin", image: "/images/martin-20achtergrond-20transformatie.png" },
      { name: "Kim", image: "/images/kim-20achtergrond-20transformatie.png" },
      { name: "Salim", image: "/images/salim-20achtergrond-20transformatie.png" },
      { name: "Wouter", image: "/images/wouter-20achtergrond-20transformatie.png" },
    ],
  },
  {
    id: 22,
    title: "Wat Onze Klanten Zeggen",
    subtitle: "Google Reviews - Gemiddeld 5,0 Sterren",
    type: "reviews",
    rating: 5.0,
    totalReviews: 7,
    reviews: [
      {
        name: "Ingrid Eekhof",
        date: "8 maanden geleden",
        rating: 5,
        text: "Ik sport nu 7 maanden onder begeleiding van Martin. Wat mij betreft weet Martin heel goed de balans te bewaren tussen een nuchtere professionele benadering en persoonlijke betrokkenheid. De wekelijkse feedback motiveert mij iedere keer weer om door te gaan. De Evotion App is gebruiksvriendelijk en overzichtelijk. Je voedings- en trainingschema kan je 'loggen' om zo een goed inzicht te krijgen in je resultaten en groei. En stuur je een trainingsfilmpje door met een vraag? Je hoeft nooit lang te wachten, vrijwel direct wordt deze door Martin beantwoord. Martin, bedankt.",
      },
      {
        name: "Marcel MPW",
        date: "3 maanden geleden",
        rating: 5,
        text: "Martin is een uitstekende coach. Hij doet en zegt wat hij belooft. Hij geeft ook oprechte feedback. Dat vind ik fijn. Hij zegt dingen als: je betaalt me niet om je vriend te zijn, ik ben je coach, en we gaan doelen bereiken.",
      },
      {
        name: "Kim Altena",
        date: "8 maanden geleden",
        rating: 5,
        text: "Dit is echt een prachtig cadeau om jezelf te geven als je je helemaal down voelt en je afvraagt wat je nog meer kan helpen om gezonder te leven wat betreft je voeding en beweging. Ik dacht dat ik het goed en verstandig deed, maar dat leverde geen resultaten op.",
      },
      {
        name: "Wouter Baerveldt",
        date: "8 maanden geleden",
        rating: 5,
        text: "Ik heb een zeer positieve ervaring met Martin's post-natale training! Hij heeft uitgebreurde kennis van sport, voeding en mindset, en hij communiceert dit op een toegankelijke maar toch rechtstreekse manier. Ik heb al geweldige resultaten behaald onder zijn begeleiding!",
      },
      {
        name: "Hessel Van Der Molen",
        date: "8 maanden geleden",
        rating: 5,
        text: "Ik ben heel blij met Martin Langenberg als personal coach...hoewel ik hem soms zou kunnen wurgen (LOL). Hij is streng...en zegt het zoals het is.",
      },
      {
        name: "Casper Lenten",
        date: "8 maanden geleden",
        rating: 5,
        text: "Professioneel advies en uitstekende resultaten. Zeer aan te bevelen als je een verschil wilt maken in je levensstijl en gezondheid.",
      },
      {
        name: "Salim Mardine",
        date: "8 maanden geleden",
        rating: 5,
        text: "Anders 💪🏼🫡",
      },
      {
        name: "App Gebruiker",
        date: "Recent",
        rating: 5,
        text: "Eyy Martin ik wil jou bedanken voor de kennis die je mij hebt gegeven. ik had van mezelf nooit verwacht dat dit zo veel zou helpen om dingen daadwerkelijk te doen. Door jou is mijn knop omgegaan. daar zal ik jou voor altijd dankbaar voor zijn",
      },
      {
        name: "App Gebruiker",
        date: "Recent",
        rating: 5,
        text: "Hoi Martin, super bedankt weer voor je feedback. Ik vind je een hartstikke fijne coach. To the point, altijd betrokken, nuchter. Je manier van benadering wat betreft de kracht loyaliteit werkt bij mij heel goed. Ik vertrouw het proces wat je aanbiedt en merk dat ik mijn best hiervoor wil doen. Dank je wel.",
      },
      {
        name: "App Gebruiker",
        date: "Recent",
        rating: 5,
        text: "Thanks voor de feedback! Fijne manier ook zo via Loom. Ik zie de aangepaste trainingen, leuk! Zin om daarmee van start te gaan deze week 💪",
      },
    ],
  },
  {
    id: 23,
    title: "Jouw Transformatie Begint Nu",
    type: "cta",
    content: {
      title: "Klaar om te Starten?",
      subtitle: "Ontdek wat Evotion Coaching voor jou kan betekenen",
      benefits: [
        "Persoonlijke intake en doelanalyse",
        "Op maat gemaakt plan voor jouw situatie",
        "Toegang tot de Evotion Coaching App",
        "Toegang tot e-learning en support portals",
        "Begeleiding door ervaren coaches",
        "Wekelijkse check-ins en voortgangsanalyses",
        "Duurzame resultaten die je leven veranderen",
      ],
    },
  },
]

export default function PresentatieClientPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const slide = slides[currentSlide]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Presentation Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls Bar */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">
              Slide {currentSlide + 1} / {slides.length}
            </span>
            <Button variant="outline" size="sm" onClick={toggleFullscreen} className="text-xs bg-transparent">
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevSlide} disabled={currentSlide === 0}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextSlide} disabled={currentSlide === slides.length - 1}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Slide Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[70vh]">
          {/* Intro Slide */}
          {slide.type === "intro" && (
            <div className="relative h-full min-h-[70vh] flex flex-col items-center justify-center overflow-hidden">
              {/* Video Background */}
              <div className="absolute inset-0 z-0">
                <div className="relative w-full h-full">
                  <iframe
                    src="https://www.youtube.com/embed/SpTe8MThxVc?autoplay=1&mute=1&loop=1&playlist=SpTe8MThxVc&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
                    className="absolute inset-0 w-full h-full object-cover scale-150"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{ pointerEvents: "none" }}
                    title="Evotion Coaching introductievideo"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1e1839]/80 via-[#1e1839]/70 to-[#1e1839]/80"></div>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 max-w-4xl text-center space-y-8 p-12 text-white">
                <div className="inline-block px-6 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm">
                  Evotion Coaching Programma
                </div>
                <h1 className="text-6xl md:text-7xl font-bold leading-tight text-balance">{slide.title}</h1>
                <p className="text-2xl md:text-3xl text-slate-200 text-balance">{slide.subtitle}</p>
                <div className="pt-8">
                  <Button
                    size="lg"
                    onClick={nextSlide}
                    className="bg-white text-[#1e1839] hover:bg-slate-100 px-8 py-6 text-lg rounded-xl"
                  >
                    Start Presentatie
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Coach Slide */}
          {slide.type === "coach" && slide.coach && (
            <div className="relative h-full overflow-y-auto">
              {/* Hero Section */}
              <div className="relative bg-gradient-to-br from-[#1e1839] via-[#2a1f4d] to-[#1e1839] text-white py-16 px-6 md:px-10">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
                    <img
                      src={slide.coach.image || "/placeholder.svg"}
                      alt={slide.coach.name}
                      className="w-full object-cover leading-7 my-0 h-72"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight text-balance">{slide.title}</h2>
                    <p className="text-xl md:text-2xl text-slate-200 mt-3 text-balance">{slide.subtitle}</p>
                    <p className="text-lg md:text-xl italic text-white/90 mt-6 max-w-3xl leading-relaxed text-balance">
                      &ldquo;{slide.coach.tagline}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlights Section */}
              <div className="bg-white px-6 md:px-10 py-12">
                <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
                  {slide.coach.highlights.map((highlight, idx) => {
                    const IconComponent =
                      highlight.icon === "Clock"
                        ? Clock
                        : highlight.icon === "GraduationCap"
                          ? GraduationCap
                          : highlight.icon === "Heart"
                            ? Heart
                            : highlight.icon === "Award"
                              ? Award
                              : highlight.icon === "Trophy" // For Zorin
                                ? Trophy
                                : highlight.icon === "Medal" // For Zorin
                                  ? Medal
                                  : highlight.icon === "TrendingUp" // For Zorin
                                    ? TrendingUp
                                    : highlight.icon === "Target" // For Zorin
                                      ? Target
                                      : null
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-4 bg-slate-50 border-2 border-slate-200 rounded-xl p-6 hover:border-[#1e1839]/30 hover:shadow-lg transition-all duration-300"
                      >
                        {IconComponent && (
                          <div className="w-12 h-12 bg-[#1e1839] rounded-xl flex items-center justify-center shrink-0">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <p className="text-sm font-semibold text-slate-700 leading-tight text-balance">
                          {highlight.text}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Certifications Section */}
              {slide.coach.certifications && slide.coach.certifications.length > 0 && (
                <div className="bg-gradient-to-b from-slate-50 to-slate-100 px-6 md:px-10 py-12">
                  <div className="max-w-6xl mx-auto space-y-8">
                    <h3 className="text-3xl font-bold text-slate-900 text-center mb-8">
                      {slide.coach.name.split(" ")[0]}'s Certificeringen & Expertise
                    </h3>

                    {slide.coach.certifications.map((cert, idx) => (
                      <div
                        key={idx}
                        className={`bg-white rounded-2xl p-8 shadow-lg border-2 ${cert.highlight ? "border-[#1e1839]" : "border-slate-200"}`}
                      >
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                          <div className="shrink-0">
                            <div
                              className={`w-24 h-24 ${cert.highlight ? "bg-[#1e1839]" : "bg-slate-700"} rounded-2xl flex items-center justify-center`}
                            >
                              <GraduationCap className="w-12 h-12 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-2xl font-bold text-slate-900">{cert.title}</h4>
                            <p className="text-lg text-slate-600 mt-1">
                              {cert.institution} ({cert.year})
                            </p>
                            {cert.link && (
                              <a
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline font-semibold"
                              >
                                Bekijk de opleiding <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                          {cert.badge && (
                            <div className="shrink-0">
                              <span className="bg-yellow-400 text-black text-sm font-bold px-4 py-2 rounded-full shadow-md">
                                {cert.badge}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="mt-6 pt-6 border-t-2 border-slate-200">
                          <h5 className="text-lg font-bold text-slate-900 mb-4">
                            {slide.coach.name.split(" ")[0]} beheerst:
                          </h5>
                          <ul className="grid md:grid-cols-2 gap-3">
                            {cert.skills.map((skill, skillIdx) => (
                              <li key={skillIdx} className="flex items-start gap-2 text-slate-700 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-[#1e1839] shrink-0 mt-0.5" />
                                <span>{skill}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements Section (for Zorin) - Same style as Martin's certifications */}
              {slide.coach.achievements && slide.coach.achievements.length > 0 && (
                <div className="bg-slate-50 px-6 md:px-10 py-12">
                  <div className="max-w-6xl mx-auto space-y-6">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-2 bg-[#1e1839]/10 px-4 py-2 rounded-full border border-[#1e1839]/20 mb-4">
                        <Trophy className="w-5 h-5 text-[#1e1839]" />
                        <span className="text-sm font-bold uppercase tracking-wider text-[#1e1839]">
                          Prestaties & Track Record
                        </span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Zorin's Prestaties</h3>
                    </div>

                    {/* Achievement Cards - Same style as Martin's certifications */}
                    {slide.coach.achievements.map((achievement, idx) => (
                      <div
                        key={idx}
                        className={`bg-white rounded-2xl p-8 shadow-lg border-2 ${
                          achievement.highlight ? "border-[#1e1839]" : "border-slate-200"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                                achievement.highlight
                                  ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                                  : "bg-[#1e1839]/10"
                              }`}
                            >
                              {achievement.highlight ? (
                                <Trophy className="w-8 h-8 text-white" />
                              ) : idx === 1 ? (
                                <Medal className="w-8 h-8 text-[#1e1839]" />
                              ) : idx === 2 ? (
                                <TrendingUp className="w-8 h-8 text-[#1e1839]" />
                              ) : (
                                <Users className="w-8 h-8 text-[#1e1839]" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-2xl font-bold text-slate-900">{achievement.title}</h4>
                            </div>
                          </div>
                          {achievement.badge && (
                            <div className="shrink-0">
                              <span className="bg-yellow-400 text-black text-sm font-bold px-4 py-2 rounded-full shadow-md">
                                {achievement.badge}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="mt-6 pt-6 border-t-2 border-slate-200">
                          <ul className="grid md:grid-cols-2 gap-3">
                            {achievement.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start gap-2 text-slate-700 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-[#1e1839] shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}

                    {/* Zorin's Certification - Henselmans PT Cursus */}
                    {slide.coach.certifications && slide.coach.certifications.length > 0 && (
                      <div className="mt-10">
                        <div className="text-center mb-6"></div>
                        {slide.coach.certifications.map((cert, idx) => null)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {slide.type === "values" && (
            <div className="relative h-full overflow-y-auto">
              {/* Hero Visie Section */}
              <div className="relative bg-gradient-to-br from-[#1e1839] via-[#2a1f4d] to-[#1e1839] text-white py-12 px-6 md:px-10">
                <div className="max-w-5xl mx-auto text-center space-y-6">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-2">
                    <Target className="w-5 h-5" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Onze Visie</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-balance leading-tight">{slide.vision?.text}</h2>
                  <div className="pt-4">
                    <p className="text-xl md:text-2xl font-light italic text-white/90 text-balance">
                      &ldquo;{slide.vision?.tagline}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Mission Section */}
              <div className="bg-white px-6 md:px-10 py-10">
                <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-[#1e1839]/5 px-4 py-2 rounded-full border border-[#1e1839]/10 mb-3">
                      <Heart className="w-5 h-5 text-[#1e1839]" />
                      <span className="text-sm font-semibold uppercase tracking-wider text-[#1e1839]">Onze Missie</span>
                    </div>
                    <p className="text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed text-balance">
                      {slide.mission?.text}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {slide.mission?.goals.map((goal: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative bg-gradient-to-br from-slate-50 to-white border-2 border-[#1e1839]/10 rounded-2xl p-6 text-center hover:border-[#1e1839]/30 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg group-hover:scale-110 transition-transform">
                          {idx + 1}
                        </div>
                        <p className="text-sm md:text-base font-bold text-slate-900 mt-3 leading-tight text-balance">
                          {goal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Core Values Section */}
              <div className="bg-gradient-to-b from-slate-50 to-slate-100 px-6 md:px-10 py-10">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">Onze 7 Kernwaarden</h3>
                    <p className="text-slate-600 text-base md:text-lg">De fundamenten van onze coaching aanpak</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {slide.coreValues?.map((value: any, idx: number) => {
                      const Icon = value.icon
                      return (
                        <div
                          key={idx}
                          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-200/50 hover:border-[#1e1839]/20 transition-all duration-300 group"
                        >
                          <div className="w-14 h-14 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          <h4 className="text-base md:text-lg font-bold text-slate-900 mb-2 leading-tight">
                            {value.title}
                          </h4>
                          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{value.description}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {slide.type === "overview" && (
            <div className="p-12 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-bold text-slate-900 text-balance">{slide.title}</h2>
                <p className="text-xl text-slate-600 text-balance">{slide.subtitle}</p>
              </div>
              <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
                {slide.phases?.map((phase, idx) => {
                  const Icon = phase.icon
                  return (
                    <div key={idx} className="relative group">
                      <div className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-6 text-center space-y-4 hover:border-[#1e1839] transition-all duration-300 hover:shadow-xl">
                        <div className="w-16 h-16 mx-auto bg-[#1e1839] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{phase.name}</h3>
                          <p className="text-sm text-slate-600 mt-2">{phase.duration}</p>
                        </div>
                      </div>
                      {idx < 4 && (
                        <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                          <ArrowRight className="w-6 h-6 text-slate-300" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Modular Explanation Section */}
              <div className="mt-16 space-y-8 max-w-5xl mx-auto">
                <div className="text-center space-y-3">
                  <h3 className="text-3xl font-bold text-slate-900">{slide.modularExplanation?.title}</h3>
                  <p className="text-lg text-slate-600 text-balance">{slide.modularExplanation?.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {slide.modularExplanation?.points.map((point, idx) => {
                    const Icon = point.icon
                    return (
                      <div
                        key={idx}
                        className="bg-white border-2 border-slate-200 rounded-2xl p-8 space-y-4 hover:border-[#1e1839] transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="w-12 h-12 bg-[#1e1839] rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">{point.title}</h4>
                        <p className="text-slate-600 leading-relaxed">{point.description}</p>
                      </div>
                    )
                  })}
                </div>

                <div className="bg-gradient-to-br from-[#1e1839] to-[#2a2050] rounded-2xl p-8 text-white">
                  <p className="text-lg leading-relaxed text-center">{slide.modularExplanation?.vision}</p>
                </div>
              </div>
            </div>
          )}

          {slide.type === "transformations" && (
            <div className="min-h-[70vh] p-12 bg-gradient-to-br from-slate-50 to-white">
              <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                  <h2 className="text-5xl font-bold text-slate-900">{slide.title}</h2>
                  <p className="text-xl text-slate-600">{slide.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {slide.transformations?.map((transformation: any, index: number) => (
                    <div key={index}>
                      <img
                        src={transformation.image || "/placeholder.svg"}
                        alt={`Transformatie ${index + 1}`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Bottom text */}
                <div className="text-center pt-8">
                  <p className="text-lg text-slate-700 text-balance max-w-3xl mx-auto">
                    Deze transformaties zijn bereikt met ons modulaire programma. Iedereen had een uniek traject,
                    afgestemd op hun persoonlijke situatie en doelen. Jouw transformatie kan de volgende zijn.
                  </p>
                </div>
              </div>
            </div>
          )}

          {slide.type === "reviews" && (
            <div className="space-y-8 pb-2 p-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-3xl font-bold text-slate-900">{slide.rating?.toFixed(1)}</span>
                </div>
                <p className="text-lg text-slate-600">Gebaseerd op Google Reviews</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[650px] overflow-y-auto pr-2 px-4">
                {slide.reviews?.map((review, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900">{review.name}</h4>
                        <p className="text-sm text-slate-500">{review.date}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === "benefits-intro" && (
            <div className="p-8 md:p-12 overflow-y-auto max-h-[85vh]">
              <div className="max-w-6xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                  <div className="inline-block px-6 py-2 bg-[#1e1839]/10 rounded-full text-sm font-medium text-[#1e1839]">
                    Jouw Investering
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 text-balance">{slide.title}</h2>
                  <p className="text-xl text-slate-600 text-balance">{slide.subtitle}</p>
                </div>

                {/* Benefits Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                  {slide.benefitCards?.map((card, idx) => {
                    const Icon = card.icon
                    return (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-2xl p-6 space-y-4 hover:border-[#1e1839] hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-14 h-14 bg-[#1e1839] rounded-xl flex items-center justify-center">
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-4 py-1.5 rounded-full">
                            €{card.value},-
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{card.description}</p>
                      </div>
                    )
                  })}
                </div>

                {/* Total Value Summary */}
                <div className="bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-2xl p-6 text-white">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-slate-300 text-sm">Totale waarde van het pakket</p>
                      <p className="text-3xl font-bold text-emerald-400">
                        €{slide.benefitCards?.reduce((sum, b) => sum + b.value, 0).toLocaleString("nl-NL")},-
                      </p>
                    </div>
                    <Button
                      size="lg"
                      onClick={nextSlide}
                      className="bg-white text-[#1e1839] hover:bg-slate-100 px-8 py-4 text-lg rounded-xl"
                    >
                      Bekijk details per onderdeel
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {slide.type === "benefit-detail" && slide.benefitDetail && (
            <div className="p-8 md:p-12 space-y-8 overflow-y-auto max-h-[85vh]">
              <div className="max-w-6xl mx-auto">
                {/* Header with icon and value */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-8 border-b-2 border-slate-200">
                  <div className="w-20 h-20 bg-[#1e1839] rounded-2xl flex items-center justify-center shrink-0">
                    {slide.benefitDetail.icon && <slide.benefitDetail.icon className="w-10 h-10 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{slide.benefitDetail.title}</h2>
                      <span className="bg-emerald-100 text-emerald-700 text-xl font-bold px-6 py-2 rounded-full whitespace-nowrap">
                        Waarde: €{slide.benefitDetail.value},-
                      </span>
                    </div>
                    <p className="text-lg text-slate-600 mt-2">{slide.benefitDetail.description}</p>
                  </div>
                </div>

                {/* Content layout - with or without mockup */}
                <div
                  className={`py-8 ${slide.benefitDetail.showMockup ? "grid md:grid-cols-2 gap-8 items-start" : ""}`}
                >
                  {/* Left side - Description and highlights */}
                  <div className="space-y-6">
                    <p className="text-lg text-slate-700 leading-relaxed">{slide.benefitDetail.detailedDescription}</p>

                    {/* Highlights grid */}
                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-4">Dit krijg je:</h3>
                      <div className="space-y-3">
                        {slide.benefitDetail.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-[#1e1839] shrink-0 mt-0.5" />
                            <span className="text-slate-700 text-sm">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right side - App Mockup (only for Evotion App slide) */}
                  {slide.benefitDetail.showMockup && (
                    <div className="flex justify-center items-center">
                      <div className="relative">
                        {/* Phone frame */}
                        <div className="relative w-[280px] h-[560px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl">
                          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full" />
                          <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                            <img
                              src="/images/evotion-app-login.jpg"
                              alt="Evotion Coaching App"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        {/* Floating badges */}
                        <div className="absolute -left-4 top-20 bg-white rounded-xl shadow-lg p-3 animate-bounce">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-900">24/7 Toegang</span>
                          </div>
                        </div>
                        <div
                          className="absolute -right-4 bottom-32 bg-white rounded-xl shadow-lg p-3 animate-bounce"
                          style={{ animationDelay: "0.5s" }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <MessageCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-900">Direct Contact</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Link button if available */}
                {slide.benefitDetail.link && (
                  <div className="pt-4 text-center">
                    <a
                      href={slide.benefitDetail.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#1e1839] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#2a1f4d] transition-colors"
                    >
                      Bekijk {slide.benefitDetail.title}
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {slide.type === "benefits-total" && (
            <div className="p-12 space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900">{slide.title}</h2>
              </div>

              <div className="max-w-4xl mx-auto">
                {/* List of all benefits with values */}
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border-2 border-slate-200 space-y-4">
                  {slide.benefits?.map((benefit, idx) => {
                    const Icon = benefit.icon
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#1e1839] rounded-xl flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-lg font-medium text-slate-900">{benefit.title}</span>
                        </div>
                        <span className="text-lg font-semibold text-emerald-600">€{benefit.value},-</span>
                      </div>
                    )
                  })}
                </div>

                {/* Total value */}
                <div className="mt-8 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-2xl p-8 text-white">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold">Totale Waarde</h3>
                    <p className="text-6xl font-bold text-emerald-400">
                      €{slide.benefits?.reduce((sum, b) => sum + b.value, 0).toLocaleString("nl-NL")},-
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {slide.type === "phase" && (
            <div className="p-12 space-y-10">
              <div className="flex items-center gap-6 pb-6 border-b-2 border-slate-200">
                <div className="w-20 h-20 bg-[#1e1839] rounded-2xl flex items-center justify-center shrink-0">
                  {slide.icon && <slide.icon className="w-10 h-10 text-white" />}
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900">{slide.title}</h2>
                  <p className="text-lg text-slate-600 mt-2">{slide.duration}</p>
                </div>
              </div>

              <div className="space-y-8 max-w-4xl">
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border-2 border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Doel van deze fase:</h3>
                  <p className="text-lg text-slate-700 leading-relaxed">{slide.content?.goal}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900">Wat je krijgt:</h3>
                  <ul className="space-y-3">
                    {slide.content?.highlights?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-[#1e1839] shrink-0 mt-0.5" />
                        <span className="text-lg text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#1e1839] rounded-2xl p-8 text-white">
                  <h3 className="text-xl font-bold mb-3">Resultaat:</h3>
                  <p className="text-lg leading-relaxed text-slate-100">{slide.content?.result}</p>
                </div>
              </div>
            </div>
          )}

          {slide.type === "phase-goals" && (
            <div className="p-12 space-y-10">
              <div className="flex items-center gap-6 pb-6 border-b-2 border-slate-200">
                <div className="w-20 h-20 bg-[#1e1839] rounded-2xl flex items-center justify-center shrink-0">
                  {slide.icon && <slide.icon className="w-10 h-10 text-white" />}
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900">{slide.title}</h2>
                  <p className="text-lg text-slate-600 mt-2">{slide.duration}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {slide.goals?.map((goal, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-8 space-y-4 hover:border-[#1e1839] transition-all duration-300 hover:shadow-xl"
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{goal.title}</h3>
                      <p className="text-slate-600 mt-2">{goal.description}</p>
                    </div>
                    <ul className="space-y-2">
                      {goal.details.map((detail, detailIdx) => (
                        <li key={detailIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#1e1839] shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === "flexibility" && (
            <div className="p-12 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-bold text-slate-900 text-balance">{slide.title}</h2>
                <p className="text-2xl text-slate-600 text-balance">{slide.content?.title}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {slide.content?.points?.map((point: any, idx: number) => {
                  const Icon = point.icon
                  return (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-8 text-center space-y-4 hover:border-[#1e1839] transition-all duration-300 hover:shadow-xl"
                    >
                      <div className="w-16 h-16 mx-auto bg-[#1e1839] rounded-2xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{point.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{point.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {slide.type === "cta" && (
            <div className="h-full min-h-[70vh] relative overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src="/images/salimpresentatie.png"
                  alt="Fitness transformation"
                  className="w-full h-full object-cover"
                />
                {/* Purple overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e1839]/95 via-[#2a2050]/90 to-[#1e1839]/95" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-white">
                <div className="max-w-4xl text-center space-y-10">
                  <div>
                    <h2 className="text-5xl md:text-6xl font-bold mb-4 text-balance">{slide.content?.title}</h2>
                    <p className="text-xl md:text-2xl text-slate-200 text-balance">{slide.content?.subtitle}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-left">
                    <h3 className="text-2xl font-bold mb-6 text-center">What you get:</h3>
                    <ul className="space-y-4">
                      {slide.content?.benefits?.map((benefit: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-6 h-6 text-white shrink-0 mt-0.5" />
                          <span className="text-lg">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Slide Navigation Dots */}
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "bg-[#1e1839] w-8" : "bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Keyboard Navigation Hint */}
        <p className="text-center text-sm text-slate-500 mt-4">
          Use the ← → arrow keys or click the buttons to navigate
        </p>
      </div>
    </div>
  )
}
