export interface Book {
  slug: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  description: string;
  descriptionEn: string;
  hook: string;
  hookEn: string;
  coverImage: string;
  backImage: string;
  coverColor: string;
  year: number;
  pages: number;
  isbn: string;
  publisher: string;
  amazonUrl: string;
  testimonial: { quote: string; author: string };
  tags: string[];
  tagsEn: string[];
}

export const books: Book[] = [
  {
    slug: "define-tu-autoridad",
    title: "Define Tu Autoridad",
    titleEn: "Define Your Authority",
    subtitle: "Despierta Tu Nueva Identidad",
    subtitleEn: "Awaken Your New Identity",
    hook: "Si trabajas duro, tienes metas grandes y aun así sientes que algo en tu vida sigue sin avanzar — este libro es para ti.",
    hookEn: "If you work hard, have big goals, and still feel like something in your life isn't moving forward — this book is for you.",
    description:
      "Define Tu Autoridad no habla de motivación vacía ni de éxito rápido; habla de identidad, criterio y responsabilidad personal. A través de una historia real y del método C.A.D. —Claridad, Acción y Disciplina—, Josué Solórzano te guía a mirar tus excusas, ordenar tu mente y construir una versión más firme de ti mismo. Este libro no promete cambiar tu vida por ti; te confronta para que dejes de vivir en automático y empieces a decidir con dirección. Porque antes de conquistar nuevas oportunidades, necesitas convertirte en una persona capaz de sostenerlas.",
    descriptionEn:
      "Define Your Authority isn't about empty motivation or quick success; it's about identity, judgment, and personal responsibility. Through a real story and the C.A.D. method —Clarity, Action, and Discipline—, Josué Solórzano guides you to face your excuses, organize your mind, and build a stronger version of yourself. This book doesn't promise to change your life for you; it confronts you so you stop living on autopilot and start deciding with direction. Because before you can conquer new opportunities, you need to become the person capable of sustaining them.",
    coverImage: "/images/libro-portada.jpg",
    backImage: "/images/libro-reverso.jpg",
    coverColor: "#b8860b",
    year: 2024,
    pages: 200,
    isbn: "978-XXX-XXX-XXX-X",
    publisher: "Legacy Publishers",
    amazonUrl: "https://a.co/d/0c5Ttyh8",
    testimonial: {
      quote: "Un libro serio para quien está listo a dejar de vivir en automático. Josué escribe con verdad, criterio y autoridad sobre la decisión más importante: despertar.",
      author: "Spenser Hoffmann",
    },
    tags: ["identidad", "autoridad", "disciplina", "desarrollo personal", "liderazgo"],
    tagsEn: ["identity", "authority", "discipline", "personal development", "leadership"],
  },
];

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}
