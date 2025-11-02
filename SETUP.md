# 🚀 Guía de Configuración

## Paso 1: Obtener API Key de TMDB

1. Ve a [https://www.themoviedb.org/](https://www.themoviedb.org/) y crea una cuenta gratuita
2. Una vez dentro, ve a **Settings** → **API**
3. Solicita una API Key (opción "Request an API Key")
4. Selecciona "Developer" como tipo de uso
5. Completa el formulario con información básica
6. Copia tu API Key

## Paso 2: Configurar el Proyecto

1. **Edita el archivo `.env.local`** que ya está creado en la raíz del proyecto
2. **Reemplaza** `tu_api_key_aqui` con tu API Key real de TMDB:

```env
NEXT_PUBLIC_TMDB_API_KEY=tu_api_key_real_aqui
```

**Ejemplo:**
```env
NEXT_PUBLIC_TMDB_API_KEY=1234567890abcdef1234567890abcdef
```

**⚠️ IMPORTANTE**: 
- No dejes espacios alrededor del signo `=`
- No uses comillas alrededor del valor
- Si tienes un Access Token, normalmente no es necesario para la API pública de TMDB, pero si lo necesitas puedes agregarlo en otra línea

## Paso 3: Instalar Dependencias

```bash
npm install
```

## Paso 4: Ejecutar el Proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Desplegar en Vercel

1. Sube tu código a GitHub, GitLab o Bitbucket
2. Ve a [https://vercel.com](https://vercel.com) e inicia sesión
3. Haz clic en "Add New Project"
4. Conecta tu repositorio
5. En "Environment Variables", agrega:
   - Variable: `NEXT_PUBLIC_TMDB_API_KEY`
   - Valor: Tu API Key de TMDB
6. Haz clic en "Deploy"

¡Listo! Tu aplicación estará disponible en una URL de Vercel.

