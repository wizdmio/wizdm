
export const $document = {

  type: 'document',
  header: {
    author: "wizdm",
    version: "1"
  },
  children: [
    { type: "heading", level: 1, align: "center", children: [
      { type: "text", value: "Title" },
      { type: "break" },
      { type: "text", value: "on multiple lines" }
    ]},
    { type: "blockquote", align: "left", children: [
      { type: "text", value: "This is a note" }
    ]},
    { type: "paragraph", align: "justify", children: [
      { type: "text", value: "This is a "},
      { type: "bold", children: [
        { type: "text", value: "bold" }
      ]},
      { type: "text", value: " paragraph... filled with "},
      { type: "italic",  children: [
        { type: "text", value: "emphasized" }
      ]},
      { type: "text", value: " text..."}
    ]},
    { type: "paragraph", align: "justify", children: [
      { type: "text", value: "This is an "},
      { type: "underline",  children: [
        { type: "text", value: "underlined" }
      ]},
      { type: "text", value: " paragraph..."}
    ]},
    { type: "heading", level: 2, align: "left", children: [
      { type: "text", value: "Links" }
    ]},
    { type: "paragraph", align: "justify", children: [
      { type: "text", value: "Here's something new. "},
      { type: "link", url: "./", children: [
        { type: "text", value: "This is a link" }
      ]},
      { type: "text", value: " pointing somewhere else." },
      { type: "break" },
      { type: "text", value: "Eventually." }
    ]},
    { type: "heading", level: 2, align: "left", children: [
      { type: "text", value: "Lists" }
    ]},
    { type: "paragraph", align: "justify", children: [
      { type: "text", value: "Yet another "},
      { type: "delete",  children: [
        { type: "text", value: "deleted" }
      ]},
      { type: "text", value: " paragraph introducing lists" },
      { type: "break" },
      { type: "text", value: "Here an ordered one starting from 2:" }
    ]},
    { type: "list", ordered: true, start: 2, children: [
      { type: "listItem",  children: [
        { type: "text", value: "List item" }
      ]},
      { type: "listItem",  children: [
        { type: "text", value: "List item" }
      ]}
    ]},
    { type: "paragraph", align: "left", children: [
      { type: "text", value: "...followed by an unordered one:" }
    ]},
    { type: "list", children: [
      { type: "listItem",  children: [
        { type: "text", value: "List item" }
      ]},
      { type: "listItem",  children: [
        { type: "text", value: "List item" }
      ]}
    ]},
    { type: "heading", level: 2, align: "left", children: [
      { type: "text", value: "Tables" }
    ]},
    { type: "paragraph", align: "justify", children: [
      { type: "text", value: "Introducing tables" },
      { type: "break" },
      { type: "text", value: "Here an example:" }
    ]},
    { type: "table", align: "center", children: [
      { type: "tableRow", children: [
        { type: "tableCell", align: "left", children: [
          { type: "text", value: "One"}
        ]},
        { type: "tableCell", align: "center", children: [
          { type: "text", value: "Two"}
        ]},
        { type: "tableCell", align: "right", children: [
          { type: "text", value: "Three"}
        ]}
      ]},
      { type: "tableRow", children: [
        { type: "tableCell", align: "left", children: [
          { type: "text", value: "Four"}
        ]},
        { type: "tableCell", align: "center", children: [
          { type: "text", value: "Five"}
        ]},
        { type: "tableCell", align: "right", children: [
          { type: "text", value: "Six"}
        ]}
      ]},
      { type: "tableRow", children: [
        { type: "tableCell", align: "left", children: [
          { type: "text", value: "Seven"}
        ]},
        { type: "tableCell", align: "center", children: [
          { type: "text", value: "Height"}
        ]},
        { type: "tableCell", align: "right", children: [
          { type: "text", value: "Nine"}
        ]}
      ]}
    ]},
    { type: "heading", level: 2, align: "left", children: [
      { type: "text", value: "Finally... pictures" }
    ]},
    { type: "paragraph", align: "justify", children: [
      { type: "text", value: "Introducing pictures" },
      { type: "break" },
      { type: "text", value: "Here an example:" }
    ]},
    { type: "image", url: "https://octodex.github.com/images/ironcat.jpg", "title": "", "alt": "" }
  ]
};