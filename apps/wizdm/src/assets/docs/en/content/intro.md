# Content Management
Data content in Wizdm is divided in *Static* content and *Dynamic* content. 

## Static Content
For static content we mean pages of informative content with minimal to no interaction capabilities such as the *About* or the *Terms and Conditions* page.
This very reference guide belongs to the static content as well. 

The rendering engine is the [@wizdm/markdowmn](docs/content/markdown) package processing source md files statically hosted in the */assets/docs* folder. 
Syntax highlighting is provided by the [@wizdm/prism](docs/content/prism) package when needed. 




## Dynamic Content
managed in two ways:
1. Dynamic content is loaded at run-time during routing for the target page to consume it within the template.
1. Static content
