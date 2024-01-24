import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
 exportToExcel(data: any[], ...args: any[]): void {
    if (args.length === 1 && typeof args[0] === 'string') {
      // Scenario 1: Only list and optional file name
      const fileName = args[0];
      this.exportData(data, fileName);
    } else if (args.length === 2 && Array.isArray(args[0]) && typeof args[1] === 'string') {
      // Scenario 2: List, headerConfig, and optional file name
      const headerConfig = args[0];
      const fileName = args[1];
      this.exportDataWithHeaders(data, headerConfig, fileName);
    } else {
      console.error('Invalid arguments provided for exportToExcel function.');
    }
  }

  private exportData(data: any[], fileName?: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName || 'exported_data.xlsx');
  }

  private exportDataWithHeaders(data: any[], headerConfig: { key: string; label: string }[], fileName?: string): void {
    const headers = headerConfig.map(header => header.key);
    const filteredData = this.filterData(data, headers, headerConfig);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName || 'exported_data.xlsx');
  }

  private filterData(data: any[], headers: string[], config: any[]): any[] {
    return data.map(item => {
      const filteredItem: any = {};
      config.forEach(header => {
        filteredItem[header.label] = item[header.key];
      });
      return filteredItem;
    });
  }
  constructor() { }
}