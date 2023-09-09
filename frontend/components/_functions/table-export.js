import { Icon } from '../_commom/Icon';

export function convertArrayOfObjectsToCSV(array) {
  let result;
  const columnDelimiter = ',';
  const lineDelimiter = '\n';
  //   const keys = Object.keys(data[0]);
  const keys = Object.keys(array[0]);
  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  array.forEach((item) => {
    let ctr = 0;
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter;
      result += item[key];
      ctr++;
    });
    result += lineDelimiter;
  });
  return result;
}

export function downloadCSV(array, fileName) {
  const link = document.createElement('a');
  let csv = convertArrayOfObjectsToCSV(array);
  if (csv == null) return;
  const filename = `${fileName}.csv` || 'export.csv';

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }

  link.setAttribute('href', encodeURI(csv));
  link.setAttribute('download', filename);
  link.click();
}

export const Export = ({ onExport }) => (
  <button
    className="py-1 px-4 rounded smaller-label"
    onClick={(e) => onExport(e.target.value)}>
    {/* <Icon nameIcon="BiSolidSave" propsIcon={{ size: 14, className: 'mr-2' }} /> */}
    Export
  </button>
);
