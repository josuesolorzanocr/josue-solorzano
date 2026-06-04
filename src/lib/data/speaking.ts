export interface SpeakingEvent {
  id: string;
  event: string;
  eventEn: string;
  location: string;
  year: number;
  type: "keynote" | "panel" | "workshop" | "podcast";
  topic: string;
  topicEn: string;
}

export const speakingEvents: SpeakingEvent[] = [
  { id: "1", event: "Endeavor Summit Latinoamérica", eventEn: "Endeavor Summit Latin America", location: "Bogotá, Colombia", year: 2024, type: "keynote", topic: "El Nuevo Liderazgo Latinoamericano", topicEn: "The New Latin American Leadership" },
  { id: "2", event: "Forbes CEO Summit México", eventEn: "Forbes CEO Summit Mexico", location: "Ciudad de México", year: 2024, type: "keynote", topic: "Mentalidad de Alto Impacto en Tiempos de Incertidumbre", topicEn: "High-Impact Mindset in Times of Uncertainty" },
  { id: "3", event: "TED Monterrey", eventEn: "TED Monterrey", location: "Monterrey, México", year: 2023, type: "keynote", topic: "Por Qué el Liderazgo Sin Título es el Futuro del Trabajo", topicEn: "Why Leadership Without a Title is the Future of Work" },
  { id: "4", event: "IESE Business School Executive Program", eventEn: "IESE Business School Executive Program", location: "Madrid, España", year: 2023, type: "workshop", topic: "Ecosistemas de Innovación: Estrategia y Ejecución", topicEn: "Innovation Ecosystems: Strategy and Execution" },
  { id: "5", event: "Expo Management Monterrey", eventEn: "Expo Management Monterrey", location: "Monterrey, México", year: 2023, type: "keynote", topic: "Construye tu Legado: Liderazgo Multigeneracional", topicEn: "Build Your Legacy: Multigenerational Leadership" },
  { id: "6", event: "Semana del Emprendedor CDMX", eventEn: "Entrepreneur Week CDMX", location: "Ciudad de México", year: 2022, type: "keynote", topic: "De Idea a Ecosistema: El Camino del Emprendedor de Alto Impacto", topicEn: "From Idea to Ecosystem: The High-Impact Entrepreneur's Journey" },
  { id: "7", event: "WOBI World Business Forum", eventEn: "WOBI World Business Forum", location: "Buenos Aires, Argentina", year: 2022, type: "keynote", topic: "El Liderazgo Consciente como Ventaja Competitiva", topicEn: "Conscious Leadership as Competitive Advantage" },
  { id: "8", event: "Congreso Nacional de RRHH", eventEn: "National HR Congress", location: "Lima, Perú", year: 2022, type: "keynote", topic: "Cultura de Alto Rendimiento: Más Allá del Manual de Empleados", topicEn: "High-Performance Culture: Beyond the Employee Handbook" },
];

export interface SpeakingTopic {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  duration: string;
}

export const speakingTopics: SpeakingTopic[] = [
  {
    title: "Mentalidad de Alto Impacto",
    titleEn: "High-Impact Mindset",
    description: "Cómo reprogramar las creencias que frenan el crecimiento personal y organizacional para desbloquear un rendimiento extraordinario.",
    descriptionEn: "How to reprogram the beliefs that hold back personal and organizational growth to unlock extraordinary performance.",
    icon: "🧠",
    duration: "60-90 min",
  },
  {
    title: "Liderazgo Sin Título",
    titleEn: "Leadership Without a Title",
    description: "El arte de generar influencia genuina, construir equipos cohesionados y crear culturas de alto rendimiento desde cualquier nivel.",
    descriptionEn: "The art of generating genuine influence, building cohesive teams, and creating high-performance cultures from any level.",
    icon: "🏆",
    duration: "45-75 min",
  },
  {
    title: "Ecosistemas de Innovación",
    titleEn: "Innovation Ecosystems",
    description: "Estrategias probadas para construir, activar y escalar redes de colaboración que aceleren la innovación y el crecimiento.",
    descriptionEn: "Proven strategies to build, activate, and scale collaboration networks that accelerate innovation and growth.",
    icon: "🌐",
    duration: "60-90 min",
  },
  {
    title: "El Legado del Líder Moderno",
    titleEn: "The Modern Leader's Legacy",
    description: "Cómo los líderes de hoy pueden tomar decisiones que importarán en 20 años, balanceando resultados inmediatos con impacto duradero.",
    descriptionEn: "How today's leaders can make decisions that will matter in 20 years, balancing immediate results with lasting impact.",
    icon: "💫",
    duration: "45-60 min",
  },
];
