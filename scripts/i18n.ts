// Script post-render (lo ejecuta Quarto con su Deno integrado).
//
// Las páginas en español viven en la raíz del sitio y sus traducciones al
// inglés en en/ con la misma ruta. Para cada HTML generado, este script:
//   1. Sustituye el enlace "#lang-toggle" de la barra de navegación por un
//      enlace real a la página equivalente en el otro idioma (sin JS).
//   2. Añade <link rel="alternate" hreflang="..."> en <head> para buscadores.

const OUTPUT_DIR = Deno.env.get("QUARTO_PROJECT_OUTPUT_DIR") ?? "_site";
const SITE_URL = "https://davidgondur.github.io/";
const DEFAULT_LANG = "es";
const OTHER_LANG = "en";

const TOGGLE_RE =
  /<a class="nav-link" href="[^"]*#lang-toggle">(\s*)<span class="menu-text">[^<]*<\/span><\/a>/;

async function* htmlFiles(dir: string, rel = ""): AsyncGenerator<string> {
  for await (const entry of Deno.readDir(`${dir}/${rel}`)) {
    const path = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory && path !== "site_libs") yield* htmlFiles(dir, path);
    else if (entry.isFile && entry.name.endsWith(".html")) yield path;
  }
}

async function exists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);
    return true;
  } catch {
    return false;
  }
}

// "index.html" -> "", "en/index.html" -> "en/", "cv.html" -> "cv.html"
const pretty = (path: string) => path.replace(/(^|\/)index\.html$/, "$1");

function relativeHref(from: string, to: string): string {
  const depth = from.split("/").length - 1;
  return ("../".repeat(depth) || "./") + pretty(to);
}

for await (const page of htmlFiles(OUTPUT_DIR)) {
  const file = `${OUTPUT_DIR}/${page}`;
  let html = await Deno.readTextFile(file);
  if (!TOGGLE_RE.test(html)) continue; // ya procesado o página sin navbar

  const isOther = page.startsWith(`${OTHER_LANG}/`);
  const lang = isOther ? OTHER_LANG : DEFAULT_LANG;
  const targetLang = isOther ? DEFAULT_LANG : OTHER_LANG;
  const counterpart = isOther
    ? page.slice(OTHER_LANG.length + 1)
    : `${OTHER_LANG}/${page}`;
  const hasCounterpart = await exists(`${OUTPUT_DIR}/${counterpart}`);

  // Si la página no tiene traducción, el botón lleva a la portada del otro idioma.
  const target = hasCounterpart
    ? counterpart
    : isOther ? "index.html" : `${OTHER_LANG}/index.html`;
  const label = isOther ? "Ver en español" : "View in English";

  html = html.replace(
    TOGGLE_RE,
    `<a class="nav-link" href="${relativeHref(page, target)}" hreflang="${targetLang}" lang="${targetLang}" title="${label}" aria-label="${label}">` +
      `$1<span class="menu-text">${targetLang.toUpperCase()}</span></a>`,
  );

  if (hasCounterpart) {
    const urls = {
      [lang]: SITE_URL + pretty(page),
      [targetLang]: SITE_URL + pretty(counterpart),
    };
    const alternates = [
      `<link rel="alternate" hreflang="${DEFAULT_LANG}" href="${urls[DEFAULT_LANG]}">`,
      `<link rel="alternate" hreflang="${OTHER_LANG}" href="${urls[OTHER_LANG]}">`,
      `<link rel="alternate" hreflang="x-default" href="${urls[DEFAULT_LANG]}">`,
    ].join("\n");
    html = html.replace("</head>", `${alternates}\n</head>`);
  }

  await Deno.writeTextFile(file, html);
}
