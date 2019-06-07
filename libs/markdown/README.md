@wizdm/markdown
===============

An angular powered markdown rendering library based on [remarkjs](https://github.com/remarkjs/remark)

## How it works

The source md file is parsed with remarkjs to build an [MDAST](https://github.com/syntax-tree/mdast) syntax tree. The `MarkdownRenderer` component renders its view recursing down the tree. Few extensions are included by default such as alignement and sub/super script. The renderer may be furhter improved thanks to the extensive availability of [plugins](https://github.com/remarkjs/remark/blob/master/doc/plugins.md)

## Links redirection

Links are rendered as anchors with the relevant `[href]` filled in. When clicked, the default behavior is prevented to fire the `(navigate)` event instead. The url fragment will be passed as a string argument of the event, so, for the receiver to act upon it.

## Features
The renderer implements all the basic capabilities plus few additions such as alignemnt, subscript and superscript and code syntax highlighting thanks to [prismjs](https://github.com/PrismJS/prism).

### Alignement
Use `<- content <-` arrows to align the content left, `-> content <-` to center the content and `-> content ->` to align the content right. This is an added feature enabled by the [remark-align](https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-align) plugin.

### Subscript and Superscript
Another extended feature enabled by the [remark-sub-super](https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-sub-super) plugin.

- Use a syntax like `19^th^` for superscripting the 'th'
- Use a syntaxt like `H~2~O` for subscripting the '2'

## Images
Images are automatically limited to a maximum size of 100%. Eventually, the maximum size can be limited to 25, 33, 50, 66 and 75% by simply appending a corresponding segment to the image link such as: `https://octodex.github.com/images/minion.png#33`.

Fixed size are also possible using `#thumb` for 150px thumbnail, `#icon` for 48px icon, `#small` for 400px and `#regular` for 1024px sizes. 
