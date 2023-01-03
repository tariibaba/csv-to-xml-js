import detectEOL from 'detect-eol';
import { tryRegexToString, splitIgnoringChar } from './utils';

type CSVToXMLOptions = {
  eol?: string;
  separator?: string;
  rowName?: string;
  headerList?: string[];
  header?: boolean;
  indentation?: number | string;
  quote?: 'single' | 'double' | 'all' | 'none' | RegExp;
};

const defaultOptions: CSVToXMLOptions = {
  eol: undefined,
  separator: ',',
  rowName: 'row',
  header: true,
  headerList: [],
  indentation: 4,
  quote: 'none',
};

export default function csvToXml(
  csvString: string,
  options?: CSVToXMLOptions
): string {
  const usedOptions = { ...defaultOptions, ...options };
  const eol = detectEOL(csvString);
  const csvData = csvString.split(eol!).map((row) => row.trim());
  const separator = usedOptions.separator!;

  let quote;
  if (usedOptions.quote instanceof RegExp) {
    quote = usedOptions.quote;
  } else if (usedOptions.quote) {
    quote = usedOptions.quote;
    quote = { single: "'", double: '"', all: /(?:'|")/, none: undefined }[
      usedOptions.quote
    ];
  }

  const split = (str: string) => {
    return splitIgnoringChar({ str, separator, charToIgnore: quote }).map(
      (ch) =>
        ch.replace(
          new RegExp(
            String.raw`${tryRegexToString(quote) ?? ''}(.*?)${
              tryRegexToString(quote) ?? ''
            }`
          ),
          '$1'
        )
    );
  };

  const firstRow = split(csvData[0]);

  const colCount = firstRow.length;

  const foundHeaders = usedOptions.header ? firstRow : [...Array(colCount)];
  const specifiedHeaders: (string | undefined)[] = [...usedOptions.headerList!];

  const usedHeaders: string[] = [];
  foundHeaders.forEach((foundHeader, index) => {
    specifiedHeaders.push(undefined);

    if (specifiedHeaders[index]) {
      usedHeaders.push(specifiedHeaders[index]!);
    } else if (usedOptions.header) {
      usedHeaders.push(foundHeader);
    } else {
      usedHeaders.push(`col${index + 1}`);
    }
    if (/\s/g.test(usedHeaders[index])) {
      warn('header name contains whitespace.');
    }
  });

  let xml = '';

  const rowStartLine = usedOptions.header ? 1 : 0;

  const rowCount = usedOptions.header ? csvData.length - 1 : csvData.length;
  if (rowCount === 0) {
    warn('No rows found in CSV input.');
    return xml;
  }

  const spaces =
    typeof usedOptions.indentation === 'number'
      ? ' '.repeat(usedOptions.indentation)
      : usedOptions.indentation;

  for (let i = rowStartLine; i < csvData.length; i++) {
    const details = split(csvData[i]);

    if (details.length < colCount) {
      warn('rows found without enough columns.');
      continue;
    }

    xml += `<${usedOptions.rowName}>\n`;
    for (let j = 0; j < colCount; j++) {
      let colValue = details[j];
      xml += `${spaces}<${usedHeaders[j]}>${colValue}</${usedHeaders[j]}>\n`;
    }
    xml += `</${usedOptions.rowName}>\n`;
  }

  return xml;
}

function warn(warning: string) {
  console.log(`csv-to-xml (WARNING): ${warning}`);
}
