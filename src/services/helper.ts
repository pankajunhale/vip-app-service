export class DB_Helper {
    constructor() {}
    
    getOffset(currentPage: number = 1, listPerPage: number) {
        return (currentPage - 1) * (listPerPage)
    }
      
    emptyOrRows(rows: any) {
        if (!rows) {
          return [];
        }
        return rows;
    }
}