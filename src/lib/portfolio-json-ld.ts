const PERSON_SAME_AS = [
  "https://www.instagram.com/_mgfd_/",
  "https://www.linkedin.com/in/mateofontanad",
  "https://twitter.com/mgfd_",
] as const;

/**
 * Datos estructurados para desambiguar identidad (Person / WebSite / WebPage)
 * frente a confusiones en resúmenes de IA o Knowledge Graph.
 */
export function getPortfolioJsonLd(site: URL): Record<string, unknown> {
  const origin = site.origin.replace(/\/$/, "");
  const home = `${origin}/`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${home}#website`,
        url: home,
        name: "Portfolio web Mateo G. Fontana Dalmasso (MGFD)",
        alternateName: ["_mgfd_ portfolio", "MGFD", "_mgfd_"],
        description:
          "Portfolio web Mateo G. Fontana Dalmasso (MGFD). Diseño gráfico, UX/UI y desarrollo digital.",
        inLanguage: ["es", "en"],
        publisher: { "@id": `${home}#person` },
      },
      {
        "@type": "Person",
        "@id": `${home}#person`,
        name: "Mateo G. Fontana Dalmasso",
        givenName: "Mateo",
        familyName: "Fontana Dalmasso",
        alternateName: ["MGFD", "_mgfd_"],
        url: home,
        sameAs: [...PERSON_SAME_AS],
        jobTitle: "Diseñador gráfico, UX/UI y desarrollo web",
        knowsAbout: [
          "Diseño gráfico",
          "Diseño UX/UI",
          "Desarrollo web",
          "Branding",
        ],
        disambiguatingDescription:
          "Autor del sitio MGFD: portfolio profesional de diseño gráfico, UX/UI y piezas digitales. No es una entidad financiera ni de inversión.",
      },
      {
        "@type": "WebPage",
        "@id": `${home}#webpage`,
        url: home,
        name: "Portfolio web Mateo G. Fontana Dalmasso (MGFD)",
        description:
          "Portfolio web Mateo G. Fontana Dalmasso (MGFD). Diseño gráfico, UX/UI y desarrollo digital.",
        isPartOf: { "@id": `${home}#website` },
        about: { "@id": `${home}#person` },
        mainEntity: { "@id": `${home}#person` },
        inLanguage: ["es", "en"],
      },
    ],
  };
}
