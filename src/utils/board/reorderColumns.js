export function reorderColumns(columns, sourceIndex, destinationIndex) {
  const updated = Array.from(columns);
  const [moved] = updated.splice(sourceIndex, 1);
  updated.splice(destinationIndex, 0, moved);
  
  // 🔹 ОНОВЛЮЄМО порядок кожної колонки
  return updated.map((column, index) => ({
      ...column,
      order: index // ✅ Новий порядок відповідає індексу
  }));
}