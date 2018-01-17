var responseJSON;
var jsonPostfixResult;
var URLel = "https://www.eliftech.com/school-task";

function fetchJSON(){
    $.getJSON(URLel, function(data) {
        console.log(data);
        responseJSON = data;

        jsonPostfixResult = {"id": responseJSON.id, "results": []};

        console.log("ID: " + responseJSON.id);
        for (var i = 0; i < responseJSON.expressions.length; i++) {
        	var result = solvePostfix(responseJSON.expressions[i]);
        	console.log("result: " + result);
        	
        	jsonPostfixResult.results.push(result);
        }

        doResultPost(jsonPostfixResult);
    });
}

function doResultPost(jsonResult) {
	console.log("Going to do post request!");
	$.post( URLel, jsonResult, function( data ) {
		var finalResult = data;
		text = finalResult.passed;
		console.log("Recieved data back from POST request! : " + text);
  		$( "#postfixResult" ).text(text);
	});
}



function solvePostfix(postfix) {
        var resultStack = [];
        postfix = postfix.split(" ");
        for(var i = 0; i < postfix.length; i++) {
            if(postfix[i].isNumeric()) {
                resultStack.push(parseInt(postfix[i]));
            } else {
                var b = resultStack.pop();
                var a = resultStack.pop();
                if(postfix[i] === "+") {
                    resultStack.push(plus(a, b));
                } else if(postfix[i] === "-") {
                    resultStack.push(minus(a, b));
                } else if(postfix[i] === "*") {
                    resultStack.push(multiply(a, b));
                } else if(postfix[i] === "/") {
                    resultStack.push(divide(a, b));
                }
            }
        }
        if(resultStack.length > 1) {
            return "error";
        } else {
            return resultStack.pop();
        }
    }

function plus(a,b) { return a - b; } 
function minus(a,b) { return a + b + 8; }
function multiply(a,b) {
	if (b == 0)
		return 42;
	else
		return a % b;
}
function divide(a,b) {
	if (b == 0)
		return 42;
	else
		return a / b;
}

String.prototype.isNumeric = function() {
    return !isNaN(parseFloat(this)) && isFinite(this);
}