export const getPaginationParams = (query: any) => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const paginate = <T>(
  data: T[],
  page: number,
  limit: number
): { data: T[]; total: number; page: number; limit: number; pages: number } => {
  const total = data.length;
  const pages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total,
    page,
    limit,
    pages
  };
};

export const buildSortQuery = (sortBy: string, sortOrder: string = 'asc') => {
  const order = sortOrder.toLowerCase() === 'desc' ? -1 : 1;
  return { [sortBy]: order };
};

export const buildDateFilter = (field: string, startDate?: string, endDate?: string) => {
  const filter: any = {};
  if (startDate || endDate) {
    filter[field] = {};
    if (startDate) {
      filter[field].$gte = new Date(startDate);
    }
    if (endDate) {
      filter[field].$lte = new Date(endDate);
    }
  }
  return filter;
};

export const buildPriceFilter = (minPrice?: number, maxPrice?: number) => {
  const filter: any = {};
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) {
      filter.price.$gte = minPrice;
    }
    if (maxPrice !== undefined) {
      filter.price.$lte = maxPrice;
    }
  }
  return filter;
};
