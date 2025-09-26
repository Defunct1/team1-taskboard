// utils/board/reorderColumns.js
export function reorderColumns(columns, sourceIndex, destinationIndex) {
  const updated = Array.from(columns);
  const [moved] = updated.splice(sourceIndex, 1);
  updated.splice(destinationIndex, 0, moved);

  // Оновлюємо порядок колонок відповідно до їх індексу
  return updated.map((column, index) => ({
    ...column,
    order: index,
  }));
}

// Додати колонку в кінець
export function addNewColumn(columns, newColumn) {
  const maxOrder = columns.reduce((max, col) => Math.max(max, col.order ?? 0), -1);
  return [
    ...columns,
    {
      ...newColumn,
      order: maxOrder + 1,
    },
  ];
}
