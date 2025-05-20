# 🔐 Clerk Safe: Plataforma de Compartición de Archivos

Aplicación web para compartir archivos de forma segura y controlada, construida con **Clerk** para la autenticación y **Supabase** para el almacenamiento de archivos

> 🏆 Proyecto desarrollado para la [Hackathon de Midudev](https://www.twitch.tv/midudev) con [Clerk](https://clerk.dev) — utilizando únicamente el plan gratuito de Clerk (en modo desarrollo ya que las funciones de MFA no son gratuitas en prod).

URL: https://clerksafe.vercel.app
Repositorio: https://github.com/Fercho5656/clerksafe

Usuarios de prueba:
| Email | Password |
|-------------------|--------------------------------------------|
| user1@test.com | passwordhackathon|

## ✨ Funcionalidades

- 🧾 **Compartición Granular de Archivos**: Comparte el mismo archivo con varias personas, cada una con condiciones y fechas de expiración diferentes.
- 📂 **Autenticación con Clerk**: Integración completa con Clerk (Sign up, Sign in, MFA), incluyendo autorización apoyada en políticas RLS en PostgreSQL.
- 🔒 **Acceso Expirable y Revocable**: Puedes modificar o revocar permisos en cualquier momento. Las compartidas se invalidan automáticamente.

## 🛠 Stack Tecnológico

| Capa              | Tecnología                                 |
|-------------------|--------------------------------------------|
| Frontend          | [Astro](https://astro.build) + [TailwindCSS](https://tailwindcss.com) |
| Autenticación     | [Clerk](https://clerk.dev) (plan gratuito) |
| Almacenamiento    | [Supabase Storage](https://supabase.com/storage) |
| Backend API       | API Routes de Astro                         |
| Base de datos     | PostgreSQL en Supabase                     |
| Deploy            | Vercel       |

## 🔗 Casos de Uso

- Compartir un documento con un cliente por 3 días.
- Dar acceso permanente a un colaborador.
- Protección de documentos con MFA (Solo se podrá descargar un archivo si el usuario tiene 2FA activado)

## 📦 Instrucciones de Instalación

1. Clona este repositorio.
2. Crea un proyecto en Supabase e incluye `SUPABASE_URL` y `SUPABASE_ANON_KEY` en las variables de entorno
3. Configura Clerk e incluye `PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` y `CLERK_WEBHOOK_URL` en las variables de entorno.
5. Despliega en Vercel (SSR habilitado).

## 📃 Licencia

MIT License

---

Hecho con ❤️ para la Hackathon de Midudev con Clerk.
README escrito con ChatGPT 😂
