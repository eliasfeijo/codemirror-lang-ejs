import { ExternalTokenizer } from "@lezer/lr";
import { JavascriptExpression, Text } from "./syntax.grammar.terms";

const percent = 37;
const closeAngle = 62;
const dash = 45;
const underscore = 95;
const openAngle = 60;
const singleQuote = 39;
const doubleQuote = 34;

export const javascriptExpressionOrText = new ExternalTokenizer(
  (input, stack) => {
    let { next } = input;
    while (next !== -1) {
      if (
        ((next === singleQuote || next === doubleQuote) &&
          input.peek(1) === openAngle &&
          input.peek(2) === percent) ||
        (next === openAngle && input.peek(1) === percent)
      ) {
        break;
      }
      if (
        ([dash, underscore].indexOf(next) > -1 &&
          input.peek(1) === percent &&
          input.peek(2) === closeAngle) ||
        (next === percent && input.peek(1) === closeAngle)
      ) {
        break;
      }
      next = input.advance();
    }
    if (stack.canShift(JavascriptExpression)) {
      input.acceptToken(JavascriptExpression);
    } else if (stack.canShift(Text)) {
      input.acceptToken(Text);
    }
  },
  { contextual: true }
);
