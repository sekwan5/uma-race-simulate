export function tsvToJson(tsv) {
  const lines = tsv.split('\n');
  const headers = lines[0].split('\t');
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentLine = lines[i].split('\t');

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentLine[j];
    }

    result.push(obj);
  }

  return JSON.stringify(result, null, 2);
}