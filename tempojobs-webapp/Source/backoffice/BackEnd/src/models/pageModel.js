export class Page {
    constructor(size, totalElements, totalPages, pageNumber, filter) {
      this.size = size;
      this.totalElements = totalElements;
      this.totalPages = totalPages;
      this.pageNumber = pageNumber;
      this.filter = filter;
    }
}

export class PagedData {
    constructor(data, page) {
        this.data = data;
        this.page = page;
    }
}

export class FilterMapping {
    constructor(prop, value, filterType) {
        this.prop = prop;
        this.value = value;
        this.filterType = filterType;
    }
}