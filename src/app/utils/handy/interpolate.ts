
interface String {
    interpolate(args: any): string;
}

// Implements a simple interpolation funtion able to replace named {{variables}} into
// their corrensponding values. It works at several deth levels {{object.section.value}}
// recurses into the object down to value, if available
String.prototype.interpolate = function(this: string, args: any): string {

// Uses a regular expression to match for {{variableName}} capturing variableName
// accepting a variable numbers of spaces within the brackets
  return this.replace(/{{\s*([.\w]+)\s*}}/g,   
    (match, capture) => {
        
        // Navigates till the requested sub objects
        let obj = capture.split(".").reduce( (obj, token) => obj && obj[token], args);

        // Returns the requseted object content when available
        return typeof obj !== "undefined" ? obj : match
    });
}