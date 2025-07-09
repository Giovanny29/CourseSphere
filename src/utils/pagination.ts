/**
 * Retorna os itens da página atual com base no array original
 */
export function paginate<T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number,
): T[] {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return items.slice(startIndex, startIndex + itemsPerPage);
}

/**
 * Calcula o número total de páginas com base no tamanho da lista
 */
export function getTotalPages(
  totalItems: number,
  itemsPerPage: number,
): number {
  return Math.ceil(totalItems / itemsPerPage);
}
