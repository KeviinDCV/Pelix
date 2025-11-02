# Pelix

Una aplicación web moderna para explorar películas usando la API de The Movie Database (TMDB).

## Características

- **Home**: Muestra películas en cines, populares y próximos estrenos
- **Detalles de Película**: Información completa con sinopsis, puntuación, géneros y estado
- **Búsqueda**: Búsqueda instantánea de películas por nombre
- **Diseño Responsive**: Optimizado para móviles, tablets y desktop

## Stack Tecnológico

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **TMDB API** - Fuente de datos de películas

##  Prerrequisitos

1. Node.js 18+ instalado
2. Una cuenta en [TMDB](https://www.themoviedb.org/) y una API Key

##  Instalación

1. Clona el repositorio o descarga los archivos

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env.local` en la raíz del proyecto:
```env
NEXT_PUBLIC_TMDB_API_KEY=tu_api_key_aqui
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Despliegue en Vercel

1. Sube tu código a GitHub, GitLab o Bitbucket

2. Ve a [Vercel](https://vercel.com) y conecta tu repositorio

3. Agrega la variable de entorno `NEXT_PUBLIC_TMDB_API_KEY` en la configuración del proyecto

4. Vercel desplegará automáticamente tu aplicación

## Estructura del Proyecto

```
├── app/
│   ├── api/search/      # API route para búsqueda
│   ├── movie/[id]/      # Página de detalles de película
│   ├── search/          # Página de búsqueda
│   ├── layout.tsx       # Layout principal
│   ├── page.tsx         # Página de inicio
│   └── globals.css      # Estilos globales
├── components/
│   ├── MovieCard.tsx    # Tarjeta de película
│   └── MovieGrid.tsx    # Grid de películas
├── lib/
│   └── tmdb.ts          # Utilidades para TMDB API
└── types/
    └── tmdb.ts          # Tipos TypeScript
```

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

