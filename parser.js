// CSC 4101 Assignment - Shift-Reduce Parser
// Seth Auzenne

class Parser {
    constructor() {
        // Provided grammer rules
        this.rules = [
            //E=E+T
            { id: 1, lhs: 'E', rhs: ['E', '+', 'T'] },  // Rule 1
            //E=T
            { id: 2, lhs: 'E', rhs: ['T'] },            // Rule 2
            //T=T*F
            { id: 3, lhs: 'T', rhs: ['T', '*', 'F'] },  // Rule 3
            //T=F
            { id: 4, lhs: 'T', rhs: ['F'] },            // Rule 4
            //F=(E)
            { id: 5, lhs: 'F', rhs: ['(', 'E', ')'] },  // Rule 5
            //F=id
            { id: 6, lhs: 'F', rhs: ['id'] }            // Rule 6
        ];

        // Shift Reduce Parser table
        // s means shift, r means reduce, acc means accept
        this.ACTION = {
            0: { 'id': 's5', '(': 's4' },
            1: { '+': 's6', '$': 'acc' },
            2: { '+': 'r2', '*': 's7', ')': 'r2', '$': 'r2' },
            3: { '+': 'r4', '*': 'r4', ')': 'r4', '$': 'r4' },
            4: { 'id': 's5', '(': 's4' },
            5: { '+': 'r6', '*': 'r6', ')': 'r6', '$': 'r6' },
            6: { 'id': 's5', '(': 's4' },
            7: { 'id': 's5', '(': 's4' },
            8: { '+': 's6', ')': 's11' },
            9: { '+': 'r1', '*': 's7', ')': 'r1', '$': 'r1' },
            10: { '+': 'r3', '*': 'r3', ')': 'r3', '$': 'r3' },
            11: { '+': 'r5', '*': 'r5', ')': 'r5', '$': 'r5' }
        };

        // ToDo
        this.GOTO = {
            0: { 'E': 1, 'T': 2, 'F': 3 },
            4: { 'E': 8, 'T': 2, 'F': 3 },
            6: { 'T': 9, 'F': 3 },
            7: { 'F': 10 }
        };
    }

    // This function parses the input
    // algo begin
    parse(input) {
        // First clean up the input (removes extra spaces in front or back)
        input = input.trim();
        
        // Check if input is empty
        if (!input) {
            return {
                success: false,
                steps: [],
                error: "No input entered, please enter an expression"
            };
        }
        
        // Check if the tokens are valid
        var validTokens = ['id', '+', '*', '(', ')', ' '];
        var invalidTokens = [];
        
        // Loop to find invalid tokens
        // If the word is not blank and not in the list of allowed words (validTokens) = invalid token
        var inputTokens = input.split(/\s+/);
        for (var j = 0; j < inputTokens.length; j++) {
            var token = inputTokens[j];
            if (token !== '' && !validTokens.includes(token)) {
                invalidTokens.push(token);
            }
        }
            
        if (invalidTokens.length > 0) {
            return {
                success: false,
                steps: [],
                error: "Invalid tokens detected: " + invalidTokens.join(', ') + ". Only 'id', '+', '*', '(', ')' are allowed."
            };
        }

        // Split the input into tokens and add $ at the end ($ represents the end of input)
        var tokens = [];
        for (var j = 0; j < inputTokens.length; j++) {
            if (inputTokens[j] !== '') {
                tokens.push(inputTokens[j]);
            }
        }
        tokens.push('$');
        
        // Initialize the stack with state 0
        // shift-reduce parsing loop, TIME COMPLEX o(n), n is the length of the string
        var stack = [0];
        
        // First token
        var a = tokens[0];
        
        // Position in the token array
        var i = 0;
        
        // Array that store parsing steps
        var steps = [];

        // Main parsing loop
        while (true) {
            // Gets the current state from top of stack
            var s = stack[stack.length - 1];
            
            // Get action from table
            var action = null;
            if (this.ACTION[s] && this.ACTION[s][a]) {
                action = this.ACTION[s][a];
            }

            // Format the action for display
            //TODOTODO
            var actionDisplay = 'error';
            if (action) {
                if (action === 'acc') {
                    actionDisplay = 'Completed';
                } else if (action[0] === 's') {
                    actionDisplay = "Shift " + action.slice(1);
                } else if (action[0] === 'r') {
                    var ruleId = action.slice(1);
                    var rule = this.rules[parseInt(ruleId) - 1];
                    actionDisplay = "Reduce by rule " + ruleId + ": " + rule.lhs + " → " + rule.rhs.join(' ');
                }
            }

            // Save this step
            var stackStr = '';
            for (var j = 0; j < stack.length; j++) {
                if (j > 0 && j % 2 === 1) {
                    // Add arrow after each state number, before symbol
                    stackStr += "<span class='arrow'>→</span> " + stack[j] + " ";
                } else if (j > 0 && j % 2 === 0) {
                    // Add arrow after each symbol, before state
                    stackStr += "<span class='arrow'>→</span> " + stack[j] + " ";
                } else {
                    // First element (state 0)
                    stackStr += stack[j] + " ";
                }
            }
            stackStr = stackStr.trim();
            
            var inputStr = '';
            for (var j = i; j < tokens.length; j++) {
                inputStr += tokens[j] + ' ';
            }
            inputStr = inputStr.trim();
            
            steps.push({
                step: steps.length + 1,
                stack: stackStr,
                input: inputStr,
                action: actionDisplay
            });

            // Handle error case
            if (!action) {
                return {
                    success: false,
                    steps: steps,
                    error: "Invalid token '" + a + "' in state " + s + ". Cannot continue parsing."
                };
            }

            // Handle accept case
            if (action === 'acc') {
                return {
                    success: true,
                    steps: steps,
                    message: 'Input accepted! The expression is valid according to the grammar.'
                };
            }

            // Handle shift action
            if (action[0] === 's') {
                // Get the target state
                var t = parseInt(action.slice(1));
                
                // Push the token and new state
                stack.push(a);
                stack.push(t);
                
                // Move to next token
                i++;
                a = tokens[i];
            } 
            // Handle reduce action
            else if (action[0] === 'r') {
                // Get the rule to use
                var ruleIndex = parseInt(action.slice(1)) - 1;
                var rule = this.rules[ruleIndex];
                
                // Calculate how many items to pop
                var popLength = 2 * rule.rhs.length;
                
                // Pop the items from the stack
                for (var j = 0; j < popLength; j++) {
                    stack.pop();
                }
                
                // Get the new state
                var newState = stack[stack.length - 1];
                
                // Push the LHS non-terminal
                stack.push(rule.lhs);
                
                // Look up next state in GOTO table
                var gotoState = this.GOTO[newState][rule.lhs];
                stack.push(gotoState);
            }
        }
    }
}

// Called when the Parse button is clicked
function parse() {
    // Text area input
    var input = document.getElementById('input').value.trim();
    
    // Create a new parser
    var parser = new Parser();
    
    // Parse the input
    var result = parser.parse(input);
    
    // Create HTML table for the steps
    var html = '<table><thead><tr><th>Step</th><th>Stack</th><th>Input</th><th>Action</th></tr></thead><tbody>';
    
    // Add each step to the table
    for (var i = 0; i < result.steps.length; i++) {
        var step = result.steps[i];
        
        // Apply highlighting to action column
        var actionClass = '';
        if (step.action.includes('Completed')) {
            actionClass = 'style="color: #28a745; font-weight: 600;"';
        } else if (step.action.includes('error')) {
            actionClass = 'style="color: #dc3545;"';
        }
        
        html += '<tr><td>' + step.step + '</td><td>' + step.stack + '</td><td>' + step.input + '</td><td ' + actionClass + '>' + step.action + '</td></tr>';
    }
    
    html += '</tbody></table>';
    
    // Add success or error message
    if (result.success) {
        html = '<p class="success">Success: Input expression is valid!</p>' + html;
    } else {
        html = '<p class="error">Error: ' + result.error + '</p>' + html;
    }
    
    // Update the result div
    document.getElementById('result').innerHTML = html;
}

// Add example buttons
function addExamples() {
    // Examples to show
    var examples = [
        'id',
        'id + id',
        'id * id',
        'id * id + id',
        'id + ( id * id )',
        
    ];
    
    // Create a div for the examples
    var examplesDiv = document.createElement('div');
    examplesDiv.className = 'examples';
    examplesDiv.innerHTML = '<h3>Provided examples:</h3>';
    
    // Create buttons for each example
    for (var i = 0; i < examples.length; i++) {
        var example = examples[i];
        var button = document.createElement('button');
        button.textContent = example;
        button.onclick = function() {
            // Using a closure to capture the current example
            var currentExample = this.textContent;
            document.getElementById('input').value = currentExample;
            parse();
        };
        button.className = 'example-btn';
        examplesDiv.appendChild(button);
    }
    
    // Add the examples to the page
    var textarea = document.getElementById('input');
    textarea.parentNode.insertBefore(examplesDiv, textarea.nextSibling);
}

// Initialize the page
window.onload = function() {
    addExamples();
}; 
