export async function generateRandomString(n) {
    let randomString = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (let i = 0; i < n; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    // const matchExisting = await Cards.count({where: {card_link: randomString}})
    // if(matchExisting) generateRandomString(n)
    return randomString;
  }

export function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
 
import { utils, writeFileXLSX } from 'xlsx';
export function downloadExcel(dataSource, sheetName, fileName) {
        const ws = utils.json_to_sheet(dataSource);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, sheetName);
        writeFileXLSX(wb, `${fileName}.xlsx`);        
    };