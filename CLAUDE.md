# Portfolio personal (Quarto, ES/EN)

Web personal de David González Durán, publicada en GitHub Pages. Se genera con `quarto render` (salida en `_site/`). Un cambio está terminado cuando `quarto render` acaba sin avisos.

## Bilingüe: todo cambio va en los dos idiomas

- Español en la raíz (`index.qmd`) e inglés en `en/` con la misma ruta (`en/index.qmd`). Al tocar el contenido de una página, aplica el cambio equivalente en la otra versión.
- Desde `en/`, las rutas a recursos llevan `../` (`../assets/images/...`). Los anclajes tienen el id traducido: `#sec-proyectos` en ES y `#sec-projects` en EN.
- `scripts/i18n.ts` se ejecuta tras renderizar: convierte el enlace `#lang-toggle` de la barra en el enlace a la página del otro idioma y añade `hreflang`. Una página nueva necesita su gemela en el otro idioma.
- Los textos compartidos por todo el sitio (footer en `_quarto.yml`) usan `[texto]{.es}[text]{.en}`.

## Tarjetas

El contenido se organiza en tarjetas desplegables, con estilos en `styles.css`:

```markdown
::: {.callout-note .tarjeta collapse="true" appearance="minimal"}
### []{.bi .bi-ICONO .icono} [Título]{.titulo} [Subtítulo]{.subtitulo}

Contenido…
:::
```

- El icono es de Bootstrap Icons o un logo: `![](assets/images/logo.png){.icono}`.
- Si la tarjeta solo tiene título, quita `collapse="true"`.
- Las imágenes grandes llevan `{.grande width=80%}`.
- Los enlaces a repositorios usan `{.btn-github}`.

## Voz y estilo de los textos

Escribe como David: en primera persona, en tono cercano y sin sonar a texto corporativo.

- **Negrita** para tecnologías y conceptos clave, y _cursiva_ para los términos en inglés dentro del texto en español (_Machine Learning_, _Transformers_).
- Decimales con punto (9.5, 8.01). En español, comillas «».
- En la versión inglesa, ortografía británica (_specialising_, _visualisation_).

## Veracidad

- Las notas, fechas, rankings y logros salen de `info-source/` (p. ej. la carta de recomendación) o de lo que diga David. Si un dato no está en ninguna fuente, pregúntale antes de escribirlo.
- `assets/documents/` contiene los PDF públicos que enlaza la web.

## Git

Mensajes de commit en inglés y en imperativo (`Add …`, `Fix …`).
