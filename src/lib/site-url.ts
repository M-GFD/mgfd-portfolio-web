/**
 * URL canónica del sitio para metadata, Open Graph, sitemap y robots.
 *
 * Configura `NEXT_PUBLIC_SITE_URL` (sin barra final, con https) en el hosting
 * para forzar un dominio. Si no está definida: en producción de Vercel se usa
 * `VERCEL_PROJECT_PRODUCTION_URL` (el dominio propio, p. ej. www.mgfd.com.ar); en
 * previews, `VERCEL_URL`. En local sin variables, cae en `http://localhost:3000`.
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    const normalized = explicit.replace(/\/$/, "");
    return new URL(normalized);
  }
  // Sin esto, canonical/OG/sitemap apuntaban a la URL efímera del deploy (*.vercel.app).
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(
    /^https?:\/\//,
    "",
  );
  if (process.env.VERCEL_ENV === "production" && production) {
    return new URL(`https://${production}`);
  }
  const vercel = process.env.VERCEL_URL?.replace(/^https?:\/\//, "");
  if (vercel) {
    return new URL(`https://${vercel}`);
  }
  return new URL("http://localhost:3000");
}
