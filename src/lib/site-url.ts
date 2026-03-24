/**
 * URL canónica del sitio para metadata, Open Graph, sitemap y robots.
 *
 * Configura `NEXT_PUBLIC_SITE_URL` (sin barra final, con https) en el hosting
 * cuando tengas dominio propio. En Vercel, si no está definida, se usa `VERCEL_URL`.
 * En local sin variables, cae en `http://localhost:3000`.
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    const normalized = explicit.replace(/\/$/, "");
    return new URL(normalized);
  }
  const vercel = process.env.VERCEL_URL?.replace(/^https?:\/\//, "");
  if (vercel) {
    return new URL(`https://${vercel}`);
  }
  return new URL("http://localhost:3000");
}
