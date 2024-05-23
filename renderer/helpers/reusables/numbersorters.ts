function arrayMax(arr: number[]) {
    var len = arr.length, max = -Infinity;
    while (len--) {
      if (arr[len] > max) {
        max = arr[len];
      }
    }
    return max;
};

function toFixedIfNecessary( value: string, dp: number ){
  return +parseFloat(value).toFixed( dp );
}

function isNumeric(str: string) {
  if (typeof str != "string") return false; // we only process strings!  
  return !isNaN(parseInt(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export {
    arrayMax,
    toFixedIfNecessary,
    isNumeric
}