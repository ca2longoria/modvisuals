
function Stacky(expression,interpreter)
{
	console.log('Stacky:',expression,typeof interpreter !== 'undefined');
	
	var tokens;
	if (typeof expression === 'string')
		tokens = expression.split(/ +/);
	else if (typeof expression === 'object' && expression.length)
		tokens = expression;
	
	// thingList ought keep the references to the new stacks pertinent past their
	// popping from thingStack.
	var thingList = [[]];
	var things = thingList[0];
	var thingStack = [things];
	
	for (var i=tokens.length-1; i >= 0; --i)
	{
		var token = tokens[i];
		
		var type = null;
		if (/^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/.test(token))
			type = 'number';
		else if (/^[*\/+-]/.test(token))
			type = 'operator';
		else if (/^\?$/.test(token))
			type = 'if';
		else if (/^:$/.test(token))
			type = 'close';
		else if (stackyFunctions[token])
			type = 'sfunc';
		else
			type = 'interpret';
			
		console.log('token,type:',token,type);
		console.log('type === number:',type === 'number');
		
		var type2 = null;
		if (type === 'number')
			type2 = 'param';
		else if (type === 'operator' || type === 'sfunc' || type === 'interpret')
			type2 = 'execute';
		else if (type === 'if')
			type2 = 'newstack';
		else if (type === 'close')
			type2 = 'closestack';
		else
			type2 = 'WHAT!?';
		
		console.log('     type2:',type2);
		
		// NOTE: Not sure if both type and type2 are necessary.
		if (type2 == 'param')
		{
			if (type == 'number')
				things.push((function(s){return function(stack,params)
				{
					stack.push(parseFloat(s));
					return parseFloat(s);
				}})(token));
		}
		else if (type2 == 'execute')
		{
			if (type == 'operator' || type == 'sfunc')
			{
				things.push(stackyFunctions[token]);
			}
			else if (type == 'interpret')
			{
				if (!interpreter)
					throw {
						name:'StackyInterpreterImpliedButNoneProvidedException',
						message:'Stacky constructor: expression,interpreter: '+[expression,interpreter]
					};
				var res = interpreter(token);
				
				if (res instanceof Stacky)
				{
					var more = res.executionStack();
					
					things.splice(i,1,more);
					i += more.length;
					continue;
				}
				
				things.push(res);
			}
		}
		else if (type2 == 'newstack')
		{
			console.log('hey, newstack!');
			var res;
			var oldThings = thingStack[thingStack.length-1];
			var newThings = [];
			if (type == 'if')
			{
				console.log('pushing if to things:',things.slice(0));
				oldThings.push(function(stack,params)
				{
					var bool = stack.pop();
					console.log('popped! bool:',stack,bool);
					if (!bool)
						// Do nothing to the stack, I guess...
						return;
					
					// NOTE: This effectively calls evaluate on this stack....
					for (var i in newThings)
					{
						var res = newThings[i](stack,params);
					}
					
					// NOTE: Returns nothing, so how are 'else'-es handled?
					//return stack.push(bool);
				});
			}
			thingList.push(newThings);
			thingStack.push(newThings);
			things = newThings;
		}
		else if (type2 == 'closestack')
		{
			var oldThings = thingStack.pop();
			things = thingStack[thingStack.length-1];
			
			// Do nothing to stack here, as well.
			//things.push(function(stack,param){});
		}
	};
	
	console.log('things:',things);
	console.log('thingList:',thingList);
	
	this.evaluate = function(params)
	{
		var stack = [];
		
		for (var i in things)
		{
			//console.log('stack:',stack);
			var res = things[i](stack,params);
			//console.log('  ',res);
		}
		if (stack.length != 1)
			throw {
				name:'UnusedStackElementsException',
				message:['Unused elements in stack after evaluation!',stack]
			}
		return stack[0];
	};
	
	this.executionStack = function()
	{
		return things.slice(0);
	}
}
stackyFunctions =
{
	print:function(stack,params)
	{
		var a=stack.pop();
		console.log('print:',a);
		
		return stack.push(a);
	},
	ceil:function(stack,params)
	{
		var a = parseFloat(stack.pop());
		return stack.push(Math.ceil(a));
	},
	floor:function(stack,params)
	{
		var a = parseFloat(stack.pop());
		return stack.push(Math.floor(a));
	},
	logb:function(stack,params)
	{
		var base = parseFloat(stack.pop());
		var val = parseFloat(stack.pop());
		var c = Math.log(val)/Math.log(base);
		
		return stack.push(c);
	},
	'+':function(stack,params)
	{
		var a = parseFloat(stack.pop());
		var b = parseFloat(stack.pop());
		var c = a+b;
		
		return stack.push(c);
	},
	'-':function(stack,params)
	{
		var a = parseFloat(stack.pop());
		var b = parseFloat(stack.pop());
		var c = a-b;
		
		return stack.push(c);
	},
	'*':function(stack,params)
	{
		var a = parseFloat(stack.pop());
		var b = parseFloat(stack.pop());
		var c = a*b;
		
		return stack.push(c);
	},
	'/':function(stack,params)
	{
		var a = parseFloat(stack.pop());
		var b = parseFloat(stack.pop());
		var c = a/b;
		
		return stack.push(c);
	},
	'%':function(stack,params)
	{
		var a = parseFloat(stack.pop());
		var b = parseFloat(stack.pop());
		var c = a%b;
		
		return stack.push(c);
	},
	'<':function(stack,params)
	{
		var a = parseFloat(stack.pop());
		var b = parseFloat(stack.pop());
		var c = a < b;
		
		return stack.push(c);
	},
	'<=':function(stack,params)
	{
		var a = parseFloat(stack.pop());
		var b = parseFloat(stack.pop());
		var c = a <= b;
		
		return stack.push(c);
	},
	'>':function(stack,params)
	{
		var a = parseFloat(stack.pop());
		var b = parseFloat(stack.pop());
		var c = a > b;
		
		return stack.push(c);
	},
	'>=':function(stack,params)
	{
		var a = parseFloat(stack.pop());
		var b = parseFloat(stack.pop());
		var c = a >= b;
		
		return stack.push(c);
	},
	'=':function(stack,params)
	{
		var a = parseFloat(stack.pop());
		var b = parseFloat(stack.pop());
		var c = a == b;
		
		return stack.push(c);
	},
	'&':function(stack,params)
	{
		var a = stack.pop();
		var b = stack.pop();
		var c = a && b;
		
		return stack.push(c);
	},
	'|':function(stack,params)
	{
		var a = stack.pop();
		var b = stack.pop();
		var c = a || b;
		
		return stack.push(c);
	}
}
