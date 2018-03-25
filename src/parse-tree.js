
export default function parseTree(input) {
  if (!(typeof input === 'string' || input instanceof String)) {
      throw new TypeError('Input needs to be a string, but ' + (typeof input) + ' was provided');
  }

  var lines = input.split("\n");
  var rootNode = { title: null, isRoot: true, children: [] };
  var parentStack = [rootNode];
  var matchSpacesRegex = /^\s+/;
  var spaces;
  var currentDepth;
  var previousNode;
  var title;
  var currentNode;
  var depthDiff;

  for (var i = 0; i < lines.length; i++) {
    spaces = lines[i].match(matchSpacesRegex);

    if (spaces !== null && spaces[0].length % 2 !== 0) {
        throw new SyntaxError('Odd number of spaces on line ' + (i + 1) + '. Should be a multiple of 2.');
    }

    currentDepth = spaces === null ? 0 : spaces[0].length / 2;
    title = lines[i].trim();

    if (title.length === 0) {
        throw new SyntaxError('You have a blank line on line ' + (i + 1) + '. Empty nodes are not allowed.');
    }

    currentNode = createNonRootNode(title);
    depthDiff = currentDepth - parentStack.length + 1;

    if (depthDiff > 1) {
        throw new SyntaxError('Too big identation on line ' + (i + 1) + '. Should be 2 spaces max.');
    }

    if (depthDiff === 0) {
      // same level, it's a child of current parent

      parentStack[parentStack.length - 1].children.push(currentNode);
    }
    else if (depthDiff === 1) {
      // child of previous element

      previousNode.children.push(currentNode);
      parentStack.push(previousNode);
    }
    else {
      // check how many levels lower it is, remove parents from stack
      // add current element as a child to the correct parent

      parentStack = parentStack.slice(0, currentDepth + 1);
      parentStack[parentStack.length - 1].children.push(currentNode);
    }

    previousNode = currentNode;
  }

  return rootNode;
}

function createNonRootNode(title) {
  return { title: title, isRoot: false, children: [] };
}
