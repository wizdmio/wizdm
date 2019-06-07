@wizdm/markdown
===============

An angular powered markdown rendering library based on [remarkjs](https://github.com/remarkjs/remark)

## How it works

1. The source md file is parsed with remarkjs to build an [MDAST](https://github.com/syntax-tree/mdast) syntax tree.
2. The `MarkdownRenderer` component renders its view recursing down the tree.
3. Few extensions are included by default such as alignement and sub/super script.

The renderer may be furhter improved thanks to the extensive availability of [plugins](https://github.com/remarkjs/remark/blob/master/doc/plugins.md)
