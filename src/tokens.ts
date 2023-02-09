import { ExternalTokenizer } from "@lezer/lr";
import { JavascriptExpression, Text } from "./syntax.grammar.terms";

const percent = 37;
const closeAngle = 62;
const dash = 45;
const underscore = 95;

export const javascriptExpressionOrText = new ExternalTokenizer(
  (input, stack) => {
    let { next } = input;
    while (
      next !== -1 &&
      next !== percent &&
      (input.peek(1) !== closeAngle ||
        ([dash, underscore].indexOf(input.peek(1)) > -1 &&
          input.peek(2) !== closeAngle))
    ) {
      next = input.advance();
    }
    const token = stack.canShift(JavascriptExpression)
      ? JavascriptExpression
      : Text;
    input.acceptToken(token);
  },
  { contextual: true }
);
