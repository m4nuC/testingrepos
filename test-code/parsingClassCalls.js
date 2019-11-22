function testFunction(name) {
  return `hello ${name}!`;
}

class TestClass {
  methodThatDoesNothing() {}
  methodThatCallAPIs(name) {
    var someVar = testFunction(name);
    testFunction(name);
  }
}

function functionThatCallsClassMethod(stringToPass) {
  const testClassInstance = new TestClass();
  testClassInstance.testMethodThatCallAPIs(
    'from inside a class via a function'
  );
}
