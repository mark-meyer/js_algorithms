/* Dynamic programming approach to Edit (aka Levenshtein) distance
 * Based on Skiena: "The Algorithm Design Manual" page 281
 * Given a string and a patter, the edit distance is defined as
 * the minimum number of 'edits' required to transform the text to the pattern
 * Transformations include substituting, deleting or inserting a character.
 */
const REPLACE = 0;
const DELETE = 1;
const INSERT = 2

// see editDistance.js for discussion

function decideLastCharactes(i, j, matrix, actions){
    if(i === text.length && j === pattern.length ){
        matrix[i][j] = 0
    } else if(i === text.length ){
        actions[i][j] = [`insert final ${pattern.slice(j)}`, [i, pattern.length +1]]
        matrix[i][j] = pattern.length - j
    } else if(j === pattern.length ){
        actions[i][j] = [`delete last ${text.slice(i)} `, [text.length, j+1]]
        matrix[i][j] = text.length - i
    }
}

function recordAction(i, j, text, best, choices, actions){
    switch (best) {
        case choices[REPLACE]:
            actions[i][j] = [`${text[i].toLowerCase() == pattern[j].toLowerCase() ? 'match' : 'replace'} ${text[i]} with ${pattern[j]}`,[i+1, j+1]]
            break
        case choices[DELETE]:
            actions[i][j] = [`delete ${text[i]}`, [i+1, j]]
            break
        case choices[INSERT]:
            actions[i][j] = [`insert ${pattern[j]}`,[i, j+1]]
    }
}
function editDistance(text, pattern){
    let matrix  = Array.from({length: text.length+1}, () => [])
    let actions = Array.from({length: text.length+1}, () => [])

    for (let i = text.length; i >= 0; i--){
        for(let j = pattern.length; j >= 0; j--){
            /** End of string options 
             * This either ends at the same time or
             * we run out of pattern or text first
            */
            if(i == text.length || j == pattern.length ){
                decideLastCharactes(i, j, matrix, actions)
            } else {
                /**
                 * Not the end of the string. Pick the lowest cost score from neighboring cells
                 * to left and down in the matrix. 
                 */
                let choices = [
                    matrix[i+1][j+1] + (text[i].toLowerCase() === pattern[j].toLowerCase() ? 0 : 1),
                    matrix[i+1][j] + 1,
                    matrix[i][j+1] + 1
                ]
                let best = Math.min(...choices)
                matrix[i][j] = best
                recordAction(i, j, text, best, choices, actions)      
            }
        }
    }

    return [matrix[0][0], actions]
}
const text = "Shark Weeks"
const pattern = "Mark Week"
let [cost, actions] = editDistance(text, pattern)
console.log("cost: ", cost)

/* walk through parent pointers */
let curr = actions[0][0]

while (curr) {
    console.log(curr[0])
    let [i, j] = curr[1]
    curr = actions[i][j]
}

