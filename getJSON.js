var receivedJSON; 
var jsonPostfixResult;
var URLel = "https://www.eliftech.com/school-task";
var currentResult;

/*
	This is event handler for button on .html. 
	Does GET request to ElifTech, then:
		1. Displays received JSON on html inside of first div.
		2. Creates instance of JSON which going to be sent on post request (jsonPostfixResult).
		3. Then loops throughout all expressions and calls calculation function for postfix (calculateExpr).
		4. Displays answer JSON in second div.
		5. Calls function for POST request performing.
*/
function fetchJSON(){
	axios.get(URLel)
	  .then(function (response) {
			console.log(response.data);
			receivedJSON = response.data;
			$("#receivedJSON").html(syntaxHighlight(JSON.stringify(receivedJSON, null, 2)));

			jsonPostfixResult = {"id": receivedJSON.id, "results": []};

			console.log("ID: " + receivedJSON.id);
			for (var i = 0; i < receivedJSON.expressions.length; i++) {
				expr = receivedJSON.expressions[i].split(" ");
				calculateExpr(expr);
				console.log("Result of " + i + " expression: " + currentResult);
				
				jsonPostfixResult.results.push(currentResult);
			}
			$("#calcResult").html(syntaxHighlight(JSON.stringify(jsonPostfixResult, null, 2)));
			doResultPost(jsonPostfixResult);
		});
}

/*
	Performs POST request for ElifTech endpoint with answer in JSON.
	Also on success draws response in third div.
*/
function doResultPost(jsonResult) {
	console.log("Going to do post request!");

	axios({
	  method: 'post',
	  url: URLel,
	  data: jsonResult
	}).then(function(data){
		console.log("Recieved data back from POST request!");
		$("#serverEval").html(syntaxHighlight(JSON.stringify(data.data, null, 2)));
		if (data.data.passed === true) {
			$("#congr").fadeIn("blind");
		}
	});

}

/*
	This block of the code recursive performs calculation on received expretion.
*/
function calculateExpr(exp) {

    if (exp.length == 1) {
    	currentResult = exp.pop();
    	return exp.pop();
     }

	$.each(exp, function(i, item) {
		    if (item === '/') {
		        exp.splice(i - 2, 3, divide(pint(exp[i - 2]), pint(exp[i - 1])));
		        calculateExpr(exp);

		    } else if (item === '*') {
		        exp.splice(i - 2, 3, mul(pint(exp[i - 2]), pint(exp[i - 1])));
		        calculateExpr(exp);

		    } else if (item === '+') {
		        exp.splice(i - 2, 3, add(pint(exp[i - 2]), pint(exp[i - 1])));
		        calculateExpr(exp);

		    } else if (item === '-') {
		        exp.splice(i - 2, 3, minus(pint(exp[i - 2]), pint(exp[i - 1])));
		      	calculateExpr(exp);
		    }
		});
    }

/*
	Bunch of functions how to handle particular operation according to the task.
*/
function add(a, b) { return a - b; };
function minus(a, b) { return a + b + 8; };
function mul(a, b) { if (b === 0) { return 42; } return ((a%b)+b)%b; };
function divide(a, b) { if (b === 0) { return 42; } return Math.floor(a/b); };

function pint(i) {  return parseInt(i); }

/*
	Function accepts JSON string and returns html string for pretty-displaying.
*/
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}