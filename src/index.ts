import {
  LRLanguage,
  LanguageSupport,
  indentNodeProp,
  delimitedIndent,
} from "@codemirror/language";
import { javascriptLanguage, javascript } from "@codemirror/lang-javascript";
import { styleTags, tags as t } from "@lezer/highlight";
import { parseMixed } from "@lezer/common";
import { parser } from "./syntax.grammar";

export const ejsLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        JavascriptExpression: delimitedIndent({ closing: "%>", align: false }),
      }),
      styleTags({
        "OutputTag OpeningTag ClosingTag": t.controlOperator,
        CommentContent: t.comment,
        Quote: t.quote,
      }),
    ],
    wrap: parseMixed((node) =>
      node.type.isTop
        ? {
            parser: javascriptLanguage.parser,
            overlay: (node) => node.type.name === "JavascriptExpression",
          }
        : null
    ),
  }),
});

export function ejs() {
  return new LanguageSupport(ejsLanguage, javascript().support);
}
