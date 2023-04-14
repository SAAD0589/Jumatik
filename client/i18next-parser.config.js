const path = require("path");

module.exports = {
  input: ["src/**/*.{js,jsx}"],
  output: "src/locales",
  defaultValue: "__STRING_NOT_TRANSLATED__",
  keySeparator: false,
  nsSeparator: false,
  pluralSeparator: false,
  contextSeparator: false,
  transKeepBasicHtmlNodesFor: ["br", "strong", "i"],
  transKeepBasicHtmlNodes: true,
  lexers: {
    js: ["JavascriptLexer"],
    jsx: ["JsxLexer"]
  },
  defaultNamespace: "translation",
  locales: ["en", "fr"],
  namespaceSeparator: ":",
  interpolation: {
    prefix: "{{",
    suffix: "}}"
  },
  transform: function customTransform(file, enc, done) {
    const parser = this.parser;
    const content = file.contents.toString(enc);

    parser.parseFuncFromString(content, { list: ["t"] }, function(key, options) {
      if (key) {
        parser.set(
          key,
          Object.assign({}, options, {
            nsSeparator: false,
            keySeparator: false
          })
        );
      }
    });

    done();
  },
  output: "{{lng}}/{{ns}}.json"
};
