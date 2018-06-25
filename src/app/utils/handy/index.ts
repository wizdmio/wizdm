/**********************************************************************************
/* Here an handy set of function helpers implemented as standard object extensions
/* Author: L. Francisco - 23.05.2017
/*
/* 
*/
// intepolate extend String implementing a simple interpolation funtion able to 
// replace named {{variables}} into their corrensponding values.
// 
// example:
//
// "Try {{this}}".interpolate( { this: "that"} );
//
// returns "Try that"
//
import './interpolate';

// printf extends String implementing a simple printf like function with limited support 
// according to the syntax:
//
// %[flags][width][.precision]type - where:
// 
// flags: can be: 0 to prepend zeroes instead of spaces when width is specified
// width: is the number of minimum digits
// precision: is the number of digits after the decimal point
// type: can be: 'd' for integers, 'f' for fixed point numbers, 's' for strings   
//
// example:
//
// "%% - %d - %2d - %02d - %0.2f - %s".printf( 3.1415, 3.1415, 3.1415, 3.1415, 3.1415 );
//
// returns "% - 3 - <space>3 - 03 - 3.14 - '3.1415'"
//
import './printf';

// camelCase vs hypen separated notation converters
//
// examples:
//
// "invalid-user".camelize(); returns "InvalidUser"
//
// "wrongParrword".hyphenize(); return "wrong-password"
//
import './naming';

// shuffle extend Array implementing the Fisher-Yates shuffle algorithm 
// (so basically shuffling the elements randomly)
// 
import './shuffle';

// normal extend Math with standard normal variate using Box-Muller transform 
// (so basically is a random generator with normal distribution)
// 
import './normal';
