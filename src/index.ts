import detectEOL from 'detect-eol';

type CSVToXMLOptions = {
  eol?: string;
  separator?: string;
  rowName?: string;
  headerList?: string[];
  header?: boolean;
};

const defaultOptions: CSVToXMLOptions = {
  eol: undefined,
  separator: ',',
  rowName: 'row',
  header: true,
  headerList: [],
};

export default function csvToXml(
  csvString: string,
  options?: CSVToXMLOptions
): string {
  const usedOptions = { ...defaultOptions, ...options };
  const eol = detectEOL(csvString);
  const csvData = csvString.split(eol!).map((row) => row.trim());
  const separator = usedOptions.separator!;

  const firstRow = csvData[0].split(separator);
  const colCount = firstRow.length;

  const foundHeaders = usedOptions.header
    ? csvData[0].split(separator)
    : [...Array(colCount)];
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
    if (/\s/g.test(foundHeaders[index])) {
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

  for (let i = rowStartLine; i < csvData.length; i++) {
    const details = csvData[i].split(separator);

    if (details.length < colCount) {
      warn('rows found without enough columns.');
      continue;
    }

    xml += `<${usedOptions.rowName}>\n`;
    for (let j = 0; j < colCount; j++) {
      xml += `<${usedHeaders[j]}>${details[j]}</${usedHeaders[j]}>\n`;
    }
    xml += `</${usedOptions.rowName}>\n`;
  }

  return xml;
}

function warn(warning: string) {
  console.log(`csv-to-xml (WARNING): ${warning}`);
}
