
# Supported Markdown Features
[Go Back](back)

The renderer implements all the basic capabilities plus few additions such as alignemnt, subscript and superscript and code syntax highlighting thanks to [@wizdm/prism](docs/content/prism). It also supports emoji rendering on all platforms thanks to [@wizdm/emoji](docs/content/emoji).

### **Alignement**
<-
Use `<- content <-` arrows to align the content left...  
(usefull whenever the paragraphs are justified by default)
<-

->
...`-> content <-` to center the content...
<-

->
...and `-> content ->` to align the content right. 
->

This is an added feature enabled by the [remark-align](https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-align) plugin.

### **Headings, emphasis and blockquotes**
> ### **Test**
> Here a simple test of a blockquote...
>> ...with indentation... 

...followed by a **bold** paragraph with *italic text* ending with ~~strikethrough~~ and finnally **_~~all together~~_**.  

### **Subscript and Superscript**
Another extended feature enabled by the [remark-sub-super](https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-sub-super) plugin.

- `19^th^` turns into 19^th^
- `H~2~O` turns into H~2~O

### Newline

Use `&nbsp;` whenever you'd want to add a new empty line for spacing. 

### **Lists**
As usual both unordered lists, here, and ordered lists, next, are supported:  
&nbsp;  
+ Create a list by starting a line with `+`, `-`, or `*`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!  

You can use sequential numbers...  

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa

...keep all the numbers as `1`...  

1. Lorem ipsum dolor sit amet
1. Consectetur adipiscing elit
1. Integer molestie lorem at massa  

...and start numbering with an offset:  

74. Lorem ipsum dolor sit amet
1. Consectetur adipiscing elit
1. Integer molestie lorem at massa  

### **Code**

Inline `code`, indented code...

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code


...block code "fences"...

```
Sample text here...
```

...and syntax highlighting are all supported

``` javascript

const module = require('./module/path');

// Comment
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
```
  
### **Tables**
Tables with cell alignment can be used in conjunction with block alignment, so, to center the table within the page for example:  
&nbsp;

->

| Option | Description |
| :-----:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

##### Table caption

<-

## **Links**
Links are supported both directly: [direct link](https://wizdm.io), referenced: [link reference][id], with title: [link with title](https://github.com/wizdmio/wizdm "title text!") and autoconverted: https://github.com/wizdmio/wizdm.  

## **Images**
Images are automatically limited to a maximum size of 100%. Eventually, the maximum size can be limited to 25, 33, 50, 66 and 75% by simply appending a corresponding segment to the image link such as: `https://octodex.github.com/images/minion.png#33` here below:

->
![Minion](https://octodex.github.com/images/minion.png#33)
<-

Fixed size are also possible using `#thumb` for 150px thumbnail size:

![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg#thumb "The Stormtroopocat")

Or `#icon` for 48px icon size:

![Alt text][id]

In this case using a reference later in the document defining the URL location.

[id]: https://octodex.github.com/images/dojocat.jpg#icon "The Dojocat"

Finally `#small` for 400px and `#regular` for 1024px sizes are available too.  

### **Footnotes**

Footnote 1 link[^first].

Footnote 2 link[^second].

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**
[^second]: Another footnote.
