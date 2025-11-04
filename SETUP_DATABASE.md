# Configuración de Base de Datos Postgres en Vercel

## Pasos para configurar Vercel Postgres

### 1. Crear la base de datos en Vercel (Marketplace)

1. Ve a tu dashboard de Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto **pelixflex**
3. Ve a la pestaña **Storage**
4. En la sección **Marketplace Database Providers**, selecciona uno de estos:

   **🌟 Opción recomendada: Neon (Serverless Postgres)**
   - Haz clic en **Neon**
   - Selecciona **Create** o **Connect**
   - Elige el plan **Hobby** (gratuito, incluye 0.5 GB)
   - Configura la región más cercana a ti
   - Haz clic en **Create** o **Connect to Project**

   **Alternativas igualmente válidas:**
   - **Supabase** - Postgres completo con auth incluido
   - **Prisma Postgres** - Postgres instantáneo
   - **Turso** - SQLite serverless (más ligero)

5. Una vez creada y conectada, Vercel configurará automáticamente las variables de entorno en tu proyecto

**Nota:** Todos estos proveedores son compatibles con `@vercel/postgres` o usan `DATABASE_URL` estándar.

### 2. Configurar variables de entorno

**Importante:** Después de crear la base de datos en el Marketplace, Vercel configurará automáticamente las variables de entorno en tu proyecto.

#### Verificar variables en Vercel:
1. Ve a tu proyecto → **Settings** → **Environment Variables**
2. Deberías ver automáticamente:
   - `POSTGRES_URL` o `DATABASE_URL`
   - `POSTGRES_PRISMA_URL` (opcional)
   - `POSTGRES_URL_NON_POOLING` (opcional)

#### Configurar para desarrollo local (.env.local):
Crea un archivo `.env.local` en la raíz del proyecto con:
```env
# TMDB API Key (ya lo tienes)
NEXT_PUBLIC_TMDB_API_KEY=tu_api_key_aqui

# Variables de Postgres (copiar desde Vercel Dashboard → Settings → Environment Variables)
POSTGRES_URL=tu_url_de_postgres_desde_vercel
# O si usas Neon/Supabase directamente:
DATABASE_URL=tu_url_de_postgres

# NextAuth Secret (genera uno con el comando de abajo)
NEXTAUTH_SECRET=genera_un_secreto_aleatorio_aqui
NEXTAUTH_URL=http://localhost:3000
```

**Para generar `NEXTAUTH_SECRET`:**

En Windows PowerShell:
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

O usa este generador online: https://generate-secret.vercel.app/32

**Cómo obtener la URL de Postgres:**
1. Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**
2. Copia el valor de `POSTGRES_URL` o `DATABASE_URL`
3. Pégalo en tu `.env.local`

### 3. Inicializar la base de datos

**Método más fácil - Usar la API route:**

1. Asegúrate de que las variables de entorno estén configuradas
2. Visita en tu navegador o ejecuta:
   ```bash
   curl -X POST http://localhost:3000/api/init-db
   ```

   O simplemente abre en tu navegador:
   ```
   http://localhost:3000/api/init-db
   ```

3. Deberías ver: `{"success":true,"message":"Base de datos inicializada correctamente"}`

**Nota:** Solo ejecuta esto UNA VEZ después de configurar la BD. Las tablas se crearán automáticamente.

**Alternativa - Script manual:**

Si prefieres usar un script, puedes ejecutar:
```bash
node -e "import('./lib/db.js').then(m => m.initializeDatabase().then(() => console.log('Done')).catch(console.error))"
```

### 4. Verificar la conexión

Para verificar que todo funciona, puedes crear una API route de prueba:

```typescript
// app/api/test-db/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await sql`SELECT NOW() as now`;
    return NextResponse.json({ success: true, time: result.rows[0].now });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
```

Visita `/api/test-db` para verificar que la conexión funciona.

## Variables de entorno requeridas

```env
POSTGRES_URL=postgres://...
NEXTAUTH_SECRET=tu_secreto_seguro
NEXTAUTH_URL=http://localhost:3000
```

## Estructura de la base de datos

Las siguientes tablas se crearán automáticamente:

- `users` - Usuarios registrados
- `search_history` - Historial de búsquedas
- `favorites` - Películas favoritas

## Troubleshooting

### Error: "relation does not exist"
- Asegúrate de haber ejecutado `initializeDatabase()` al menos una vez

### Error de conexión
- Verifica que las variables de entorno estén correctamente configuradas
- En producción, verifica que las variables estén en Vercel Dashboard
- Asegúrate de que la región de la BD coincida con tu deployment

### Error de autenticación NextAuth
- Verifica que `NEXTAUTH_SECRET` esté configurado
- En producción, asegúrate de que `NEXTAUTH_URL` apunte a tu dominio real

