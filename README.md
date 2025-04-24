# Shift Reduce Parser

Hey! This is my JavaScript implementation of a Shift-Reduce Parser for CSC 4101. 

## What it does

This parser takes expressions with operations (like id + id * id) and checks if they follow our grammar rules:

1. E → E + T
2. E → T
3. T → T * F
4. T → F
5. F → (E)
6. F → id

## How to use it

Just follow these steps:

1. Type an expression in the box (remember to use 'id' for variables and separate everything with spaces)
2. Click "Parse" and watch it work!
3. Or just click one of the example buttons if you're lazy like me

## What you'll see

The parser shows:
- Each step of the parsing process
- What's on the stack
- What input is left to process
- What action it's taking (shift/reduce/accept)

## Project files

- `index.html` - All the UI stuff (HTML & CSS)
- `parser.js` - The actual parser code that does the work

## Cool examples to try

- `id + id * id`
- `id * id + id`
- `( id + id ) * id`
- `id + ( id * id )`
- `id`

## Author

sauzen4@lsu.edu

---
Made for CSC 4101 at LSU (Prof. Anas Mahmoud)
