# Self hosting fonts

By default all fonts (text nd icons) are loaded from the relevant url. However, the option of eneabling self hosting is available (see styles.scss).

Google fonts and Material Icons fonts have been converted using https://transfonter.org/ and are statically located under /assets/font. Fontawesome fonts are copied within the same folder from ./node_modules/@fortawesome/fontawesome-free/webfonts/ during build.