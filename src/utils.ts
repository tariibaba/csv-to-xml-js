export function splitIgnoringChar(params: {
  str: string;
  separator: string;
  charToIgnore: string | RegExp;
}) {
  const { str, separator, charToIgnore } = params;

  let result: string[] = [];
  let awaitingEndQuote = false;
  let accElement = '';

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    let isCharToIgnore = false;
    if (charToIgnore instanceof RegExp) {
      isCharToIgnore = charToIgnore.test(ch);
    } else if (typeof charToIgnore === 'string') {
      isCharToIgnore = charToIgnore === ch;
    }

    if (isCharToIgnore) {
      awaitingEndQuote = !awaitingEndQuote;
    }
    if (ch === separator) {
      if (!awaitingEndQuote) {
        result.push(accElement);
        accElement = '';
        continue;
      }
    }
    accElement += ch;
  }
  result.push(accElement);

  return result;
}

export function tryRegexToString(
  regexOrString?: string | RegExp
): string | undefined {
  if (typeof regexOrString === 'string') {
    return regexOrString;
  } else if (regexOrString instanceof RegExp) {
    return regexOrString?.toString()?.slice(1, -1);
  } else return undefined;
}
