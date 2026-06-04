# Josue Solorzano — Sitio Web Premium

Sitio web personal premium de Josue Solorzano, construido con Next.js 15, Tailwind CSS 4, y Framer Motion.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Estilos**: Tailwind CSS 4
- **Animaciones**: Framer Motion 12
- **Lenguaje**: TypeScript
- **Deploy**: Vercel

## 🏃‍♂️ Inicio Rápido

### Prerrequisitos

- Node.js 20+
- npm 10+

### Instalación

```bash
cd josue-solorzano
npm install
npm run dev
```

El sitio estará disponible en `http://localhost:3000`.

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx          # Root layout (español)
│   ├── page.tsx            # Homepage
│   ├── sobre-mi/           # Sobre mí
│   ├── libros/             # Libros + páginas individuales
│   ├── conferencias/       # Conferencias & talleres
│   ├── prensa/             # Prensa & medios
│   ├── blog/               # Blog + artículos
│   ├── en/                 # Versión en inglés (mirror completo)
│   ├── sitemap.ts          # Sitemap dinámico
│   └── not-found.tsx       # Página 404
├── components/
│   ├── layout/             # Header, Footer
│   └── sections/           # Secciones del homepage
└── lib/
    ├── data/               # Libros, blog posts, testimonios
    ├── schema.ts           # Schema.org JSON-LD helpers
    └── utils.ts            # Utilidades y config del sitio
```

## 🌐 Páginas

### Español (default)
- `/` — Homepage completa
- `/sobre-mi` — Historia y trayectoria
- `/libros` — Los 3 libros bestseller
- `/libros/[slug]` — Página individual por libro
- `/conferencias` — Conferencias & talleres
- `/prensa` — Kit de prensa
- `/blog` — 18 artículos SEO
- `/blog/[slug]` — Artículo individual

### English `/en/`
- `/en` — Homepage (EN)
- `/en/about`, `/en/books`, `/en/speaking`, `/en/press`, `/en/blog`

## 🤖 SEO & AI Crawlers

`/public/robots.txt` permite explícitamente:
- GPTBot, ChatGPT-User
- ClaudeBot, Anthropic-AI
- PerplexityBot
- Google-Extended
- Cohere-AI, YouBot, CCBot

Cada página incluye:
- Schema.org JSON-LD (Person, Book, Article, FAQPage, BreadcrumbList, WebSite, WebPage, SiteNavigationElement)
- Open Graph tags
- Twitter Cards
- Meta descriptions únicas
- Keywords optimizadas

## 🚢 Deploy en Vercel

### Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Via GitHub Actions

1. Sube el código a GitHub
2. Ve a Vercel Dashboard → Import Project → selecciona tu repo
3. En GitHub Settings → Secrets, agrega:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

El workflow `.github/workflows/deploy.yml` desplegará automáticamente en cada push a `main`.

### Via Vercel Dashboard (más sencillo)

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio de GitHub
3. Vercel detecta Next.js automáticamente
4. Click "Deploy" — ¡listo!

## ✏️ Personalización

### Actualizar información de Josue

Edita `src/lib/utils.ts` → `siteConfig` para actualizar URL, redes sociales, etc.

### Agregar/editar libros

Edita `src/lib/data/books.ts`.

### Agregar artículos de blog

Edita `src/lib/data/blog-posts.ts`. Cada post tiene versión en español e inglés.

### Cambiar el color accent

Edita `src/app/globals.css` → `@theme { --color-accent: ... }`.

## 📄 Licencia

© 2024 Josue Solorzano. Todos los derechos reservados.
