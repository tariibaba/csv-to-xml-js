import csvToXml from '.';

it('converts basic CSV to XML', () => {
  const csv = `color,maxSpeed,age
"red",120,2
"blue",150,4`;

  const xml = csvToXml(csv);
  expect(xml).toBe(
    `<row>
<color>"red"</color>
<maxSpeed>120</maxSpeed>
<age>2</age>
</row>
<row>
<color>"blue"</color>
<maxSpeed>150</maxSpeed>
<age>4</age>
</row>
`
  );
});

it('accepts custom separator', () => {
  const csv = `color|maxSpeed|age
"red"|120|2`;

  const xml = csvToXml(csv, { separator: '|' });
  expect(xml).toBe(
    `<row>
<color>"red"</color>
<maxSpeed>120</maxSpeed>
<age>2</age>
</row>
`
  );
});

it('accepts custom rowName', () => {
  const csv = `color,maxSpeed,age
"red",120,2`;

  const xml = csvToXml(csv, { rowName: 'car' });
  expect(xml).toBe(
    `<car>
<color>"red"</color>
<maxSpeed>120</maxSpeed>
<age>2</age>
</car>
`
  );
});

it('accepts custom headerList', () => {
  const csv = `Color,Max Speed,Age
"red",120,2`;

  const xml = csvToXml(csv, { headerList: ['color', 'maxSpeed', 'age'] });
  expect(xml).toBe(
    `<row>
<color>"red"</color>
<maxSpeed>120</maxSpeed>
<age>2</age>
</row>
`
  );
});

it('accepts CSV with no headers', () => {
  const csv = `"red",120,2`;

  const xml = csvToXml(csv, { header: false });
  expect(xml).toBe(
    `<row>
<col1>"red"</col1>
<col2>120</col2>
<col3>2</col3>
</row>
`
  );
});

it('accepts custom EOL', () => {
  const csv = `color,maxSpeed,age\r
"red",120,2`;

  const xml = csvToXml(csv, { eol: '\r\n' });
  expect(xml).toBe(
    `<row>
<color>"red"</color>
<maxSpeed>120</maxSpeed>
<age>2</age>
</row>
`
  );
});
