export const $document = {
  header: {
    author: "wizdm",
    version: "1"
  },
  type: "document",
  children: [
    { type: "heading", "level": 1, align: "center", children: [
      { type: "text", value: "Title", style: ["bold"] }
    ]},
    { type: "blockquote", align: "left", children: [
      { type: "text", value: "This is a note" }
    ]},
    { type: "paragraph", align: "justify", children: [
      { type: "text", value: "This is a "},
      { type: "text", value: "bold", style: ["bold"] },
      { type: "text", value: " paragraph..."}
    ]},
    { type: "paragraph", align: "justify", children: [
      { type: "text", value: "This is an "},
      { type: "text", value: "emphasized", style: ["italic"] },
      { type: "text", value: " paragraph..."}
    ]},
    { type: "paragraph", align: "justify", children: [
      { type: "text", value: "This is an "},
      { type: "text", value: "underlined", style: ["underline"] },
      { type: "text", value: " paragraph..."}
    ]},
    { type: "heading", "level": 2, align: "left", children: [
      { type: "text", value: "Links", style: ["bold"] }
    ]},
    { type: "paragraph", align: "justify", children: [
      { type: "text", value: "Here's something new. "},
      { type: "link", value: "This is a link", url: "./" },
      { type: "text", value: " pointing somewhere else.\n" },
      { type: "text", value: "Eventually." }
    ]},
    { type: "heading", "level": 2, align: "left", children: [
      { type: "text", value: "Lists", style: ["bold"] }
    ]},
    { type: "paragraph", align: "justify", children: [
      { type: "text", value: "Yet another "},
      { type: "text", value: "deleted", style: ["strikethrough"] },
      { type: "text", value: " paragraph introducing lists\nHere an ordered one starting from 2:" }
    ]},
    { type: "numbered", "start": 2, children: [
      { type: "item",  children: [
        { type: "text", value: "List item" }
      ]},
      { type: "item",  children: [
        { type: "text", value: "List item" }
      ]}
    ]},
    { type: "paragraph", align: "left", children: [
      { type: "text", value: "...followed by an unordered one:" }
    ]},
    { type: "bulletted", children: [
      { type: "item",  children: [
        { type: "text", value: "List item" }
      ]},
      { type: "item",  children: [
        { type: "text", value: "List item" }
      ]}
    ]},
    { type: "heading", "level": 2, align: "left", children: [
      { type: "text", value: "Tables", style: ["bold"] }
    ]},
    { type: "paragraph", align: "justify", children: [
      { type: "text", value: "Introducing tables\nHere an example:" }
    ]},
    { type: "table", align: "center", children: [
      { type: "row", children: [
        { type: "cell", align: "left", children: [
          { type: "text", value: "One", style: ["bold"]}
        ]},
        { type: "cell", align: "center", children: [
          { type: "text", value: "Two", style: ["bold"]}
        ]},
        { type: "cell", align: "right", children: [
          { type: "text", value: "Three", style: ["bold"]}
        ]}
      ]},
      { type: "row", children: [
        { type: "cell", align: "left", children: [
          { type: "text", value: "Four"}
        ]},
        { type: "cell", align: "center", children: [
          { type: "text", value: "Five"}
        ]},
        { type: "cell", align: "right", children: [
          { type: "text", value: "Six"}
        ]}
      ]},
      { type: "row", children: [
        { type: "cell", align: "left", children: [
          { type: "text", value: "Seven"}
        ]},
        { type: "cell", align: "center", children: [
          { type: "text", value: "Height"}
        ]},
        { type: "cell", align: "right", children: [
          { type: "text", value: "Nine"}
        ]}
      ]},
      { type: "row", children: [
        { type: "cell", align: "center", "colspan": 3, children: [
          { type: "text", value: "Ten"}
        ]}
      ]}
    ]},
    { type: "heading", "level": 2, align: "left", children: [
      { type: "text", value: "Finally... pictures", style: ["bold"] }
    ]},
    { type: "paragraph", align: "justify", children: [
      { type: "text", value: "Introducing pictures\nHere an example:" }
    ]},
    { type: "image", url: "https://octodex.github.com/images/ironcat.jpg", title: "", alt: "" }
  ]
};