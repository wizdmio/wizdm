@wizdm/editable
===============

An experimental WYSIWYG content editing library with Angular.  

## How it works

The `EditableDocument` component renders the data tree content into its view. Once edit mode is enabled, the component switches the view in [contenteditable](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable) mode redirecting all the user inputs (key strokes, cut/paste, ...) so to avoid the browser performing any change to the html content itself and directly edit the data tree instead while the component keeps re-rendering the view after every change.

Document selection (aka caret) is queried prior to every change to the data tree and applied back after every rendering, so, to restore it. This way the browser selection is kept in sync with the data tree selection used internally to modify the data tree. 

## Designed for cloud

This library is designed to smoothly blend with [@wizdm/connect](../connect) enabling editing of documents stored in cloud firestore.
