export function formatPrice(price) {
  return Number(price || 0).toLocaleString()
}

export function normalizeFilterParams(params = {}) {
  return {
    keyword: (params.keyword ?? '').toString().trim(),
    city: (params.city ?? '').toString().trim(),
    rentType: (params.rentType ?? '').toString().trim(),
    minPrice:
      params.minPrice === '' || params.minPrice == null
        ? null
        : Number(params.minPrice),
    maxPrice:
      params.maxPrice === '' || params.maxPrice == null
        ? null
        : Number(params.maxPrice)
  }
}

export function cleanEmptyQuery(query = {}) {
  const result = {}

  Object.keys(query).forEach((key) => {
    const value = query[key]
    if (value !== '' && value !== null && value !== undefined) {
      result[key] = value
    }
  })

  return result
}
