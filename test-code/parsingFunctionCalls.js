function testFunction(name) {
  return `hello ${name}!`;
}

function functionThatCallsInlineFunction(stringToPass) {
  testFunction('I like blueberries');
}

function functionThatCallsFunctionInVarDeclaraion(stringToPass) {
  const resultOfFunctionCall = testFunction(intermediaryVarWithNativeAPICall);
  return resultOfFunctionCall;
}
