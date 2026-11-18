export const CATEGORIES = [
  { value: "food", label: "Їжа" },
  { value: "transport", label: "Транспорт" },
  { value: "housing", label: "Житло" },
  { value: "health", label: "Здоров'я" },
  { value: "entertainment", label: "Розваги" },
  { value: "other", label: "Інше" },
];

export function categoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}