<!-- toc: docs/reference.json -->

# Multiple Languages
Wizdm is designed to provide runtime content in multiple languages selecting the proper language by means of a route parameter placed at the very root of the url like "https\://mycooldomain.io/**en**/home" for English and "https\://mycooldomain.io/**it**/home" for italian. 

To achieve it, the app complies with the following pattern:

->
![Routing Diagram](assets/static/images/routing-diagram.png#80)
<-

The AppComponent template contains the first `<router-outlet>` where the *Router* will load a *NavigatorComponent*. The routing path of the *NavigatorComponent* is the `:lang` token, so, the *Router* will store the language code within a parameter (named *lang*) in the activated route. The *NavigatorComponent* template contains the second `<router-outlet>` where the router will load the actual pages, so, both the navigator and the pages we’ll have the opportunity to dynamically load their content based on the language code. 

---
->
[Next Topic](docs/toc?go=next) 
->
