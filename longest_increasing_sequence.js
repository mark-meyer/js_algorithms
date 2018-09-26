/**
 * Dyanamic Programming approach to longest increasing sequence
 * Based on Skiena: "The Algorithm Design Manual" page 290
 * 
 * This works by defining an array of counts and predecessors for each element in the 
 * sequence. During the loop this array is searched for the element with the max count
 * where the corresponding array elements is less than current element.
 * 
 * Running time is O(n**2)
 */

function longestSub(arr){
    let res = []
    for (let i = 0; i < arr.length; i++ ){
        let m = res.reduce((a, c, j) => (c.count >= a.count && c.v < arr[i]) 
             ? {count: a.count + 1, parent:j, v:arr[i]} 
             : Object.assign(a, { v:arr[i]})
        , {count: 1, parent:undefined, v:arr[0]})
        res[i] = m
    }
    return res
}

let counts = longestSub([6, 7, 2, 3, 9, 1, 10, ])
// find the largest element in counts
let max = counts.reduce((a, c, i, self) => self[i].count > self[a].count ? i : a, 0)

// walk through parent pointers from the max
let curr = counts[max]
let solution = []
while(curr) {
    solution.unshift(curr.v)
    curr = counts[curr.parent]
}

console.log(solution)