function arrayMax(arr: number[]) {
    var len = arr.length, max = -Infinity;
    while (len--) {
      if (arr[len] > max) {
        max = arr[len];
      }
    }
    return max;
};

export {
    arrayMax
}