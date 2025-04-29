# Shift Reduce Parser

This is my JavaScript implementation of a Shift-Reduce Parser for CSC 4101. 

## What it does

This parser takes expressions with operations (like id + id * id) and checks if they follow the grammar rules:

1. E → E + T
2. E → T
3. T → T * F
4. T → F
5. F → (E)
6. F → id

## Accepted Tokens
1. ( id )
2. ( + )
3. ( * )
4. ( , )

## How to use it

1. Type an expression in the box (remember to use 'id' for variables and separate everything with spaces)
2. Click "Parse" 
3. Provided example choices are available

## What you'll see

The parser shows:
- Each step of the parsing process
- What's on the stack
- What input is left to process
- What action it taking (shift/reduce/accept)

## Project files

- `index.html` - GUI
- `parser.js` - The actual parser code that does the work

## Cool examples to try

- `id + id * id`
- `id * id + id`
- `( id + id ) * id`
- `id + ( id * id )`
- `id`

## Author
Seth Auzenne
sauzen4@lsu.edu

---
Made for CSC 4101 LSU (Prof. Anas Mahmoud)
