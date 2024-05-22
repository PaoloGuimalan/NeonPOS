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

export {
    arrayMax,
    toFixedIfNecessary
}