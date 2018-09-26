/*
 * Bottom up dynamic programming approach to splitting a text optimally given a desired width.
 * Based on MIT 6.006 Introduction to Algorithms, Fall 2011
 * OpenCourseWare: https://www.youtube.com/watch?v=ENyox7kNKeY&t=1026s
 * 
 * Recurrence : min (badness(i,j) + recure(j) for j in i+1 to length)
 * Base case: recure(length) = 0
 * O(n**2)
 * 
 * Mark Meyer mark@photo-mark.com
 */

function justify(text, width){
    const parents = {}
    const words = text.split(/\s+/)  

    const badness = (i, j) => {
        /* badness is the quality we want to minimize
         * It is defined here as infinity if the length exceeds width
         * otherwise it is the (width - line_length) ** 3
         */
        let total = words.slice(i, j).reduce((a, c) => a+c.length +1, -1) // +1 for spaces between words
        return total > width 
               ? Number.MAX_SAFE_INTEGER 
               : (width - total) ** 3
    }

    const memo =  {[words.length]: 0}                  // base case there are no words so no cost after the end
    for (let i = words.length - 1 ; i >= 0; i--){
        let min, cur_split = 0
        for (let j = i + 1; j <= words.length; j++){
            let b = badness(i,j)
            if (b === Number.MAX_SAFE_INTEGER) break   // exit early if line is too long
            let cost = b + memo[j]
            if(min === undefined || cost < min){
                min = cost
                cur_split = j
            } 
        }
        memo[i] = min
        // Keep track of parent pointer to allow solution to be reconstructed
        parents[i] = cur_split
        
    }

    // create final string by following parent pointers
    let next, cur = 0, str = []
    while (next = parents[cur]){
        str.push(words.slice(cur, next).join(' '))
        cur = next
    }
    return str.join('\n')
}


const text = "Lorem ipsum dolor sit amet, consectetura adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
let n = 40 

console.log("=".repeat(n))
let justified = justify(text, n)
console.log(justified)
console.log("line lengths: ", justified.split('\n').map(line =>line.length))
console.log("total badness: ", justified.split('\n').map(line => (n - line.length)**3).reduce((a, c) => a+c))