/**
 * This is a plain function that () ^$%^&*.
 * @param {boolean} withArg description of withArg
 * @param withArg2 description of withArg2
 * @returns some return description
 */
function normalFunction(withArg, withArg2) {
  return withArg + withArg2;
}

function functionWithInlineBodyComment() {
  // These are inline comment a the top
  // of the function body
  // these whould be fully parsed
  return 42;
}

/**
 * This is an arrow function
 */
const arrowFunction = someArg => {
  const someVar = "Jon Doe";

  // This comment is not useful as very local
  const someOtherVar = "Jane Doe";

  return "something";
};

// This is function expression with
// inline comment on a few line
// above it's declaration
const functionExpression = function() {
  const testVar = "Jon Doe";
  const testVar2 = "Jane Doe";
  return "something";
};

// This is a direct named exprot
export const directNamedExport = function(iAmAParam) {
  const testVar = "Jon Doe";
  const testVar2 = "Jane Doe";
  return "something";
};

// This is a default export function
// it should then get the name of the file
export default function() {
  const testVar = "Jon Doe";
  const testVar2 = "Jane Doe";
  return "something";
}
