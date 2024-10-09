export function tsvToJson(tsv) {
  const lines = tsv.split("\n");
  const headers = lines[0].split("\t");
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentLine = lines[i].split("\t");

    // 현재 줄이 비어있지 않은 경우에만 처리
    if (currentLine.length === headers.length) {
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentLine[j];
      }
      result.push(obj);
    }
  }

  return result; // 배열 반환
}
