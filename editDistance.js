/* Memoized recursive approach to Edit (aka Levenshtein) distance
 * Based on Skiena: "The Algorithm Design Manual" page 281
 * Given a string and a patter, the edit distance is defined as
 * the minimum number of 'edits' required to transform the text to the pattern
 * Transformations include substituting, deleting or inserting a character.
 */

const text = "ma"
const pattern = "mark"
const REPLACE = 0;
const DELETE = 1;
const INSERT = 2

/*
 * Given a patern: "mark" and a string: "mrark" at each step if the letters don't match:
 * we can fix that location with any of the following:
 * REPLACE: mrark -> maark
 * DELETE:  mrark -> mark
 * INSERT:  mrark -> marark
 * The cost will be 1 + the cost of recusing on the remainder of the string
 * If the letters already match, the cost is zero because no edit is required
 */

// matrix is filled out to memoize the distance as the recursion unwinds
let matrix  = Array.from({length: text.length + 1}, () => [])
// actions is a convenience for displaying the order of edits
let actions = Array.from({length: text.length + 1}, () => [])

function editDistance(text, pattern, i = 0, j = 0){
    // i represents the position in the string
    // j represents the position in the pattern
    if(i == text.length && j == pattern.length) return 0   // base case: we've reached the end of both the pattern and string
    if(i == text.length) {                                 // we've reached the end of the string, but have left over pattern characters
        actions[i][j] = [`add last ${pattern.length - j} letters from pattern`, [i, pattern.length]]
        return pattern.length - j
    }
    if(j == pattern.length) {                              // we've reached the end of the pattern, but have leftover string characters
        actions[i][j] = [`delete last ${text.length - i} letters of text`, [text.length, j]]
        return text.length - i
    }

    // Recurse over the three choices and memoize the results in matrix
    // Matching/replacing increments i & j with a cost of zero or one respectively
    // Deleting is equivalent to incrementing i alone
    // Inserting is equivalent to only incrementing j
    let choices = [
        (matrix[i+1][j+1] || (matrix[i+1][j+1] = editDistance(text, pattern, i+1, j+1))) + (text[i].toLowerCase() === pattern[j].toLowerCase() ? 0 : 1),
        (matrix[i+1][j]   || (matrix[i+1][j]   = editDistance(text, pattern, i+1, j))) + 1,
        (matrix[i][j+1]   || (matrix[i][j+1]   = editDistance(text, pattern, i, j+1))) + 1
    ]
    // as recursion unwinds pick the lowest cost option
    let best =  Math.min(...choices)

    // populate actions table so we can build a narative account of the edits
    if (best === choices[REPLACE]){
        actions[i][j] = ([`${text[i].toLowerCase() == pattern[j].toLowerCase() ? 'match' : 'replace'} ${text[i]} with ${pattern[j]}`,[i+1, j+1]])
    } else if (best === choices[DELETE]){
        actions[i][j] = ([`delete ${text[i]}`, [i+1, j]])
    } else if (best === choices[INSERT]){
        actions[i][j] = ([`insert ${pattern[j]}`,[i, j+1]])
    }
    return best
}

console.log("cost: ", editDistance(text, pattern))
let curr = actions[0][0]

while (curr) {
    console.log(curr[0])
    curr = actions[curr[1][0]][curr[1][1]]
}
