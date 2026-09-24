type SelectItem = { label: string; value: string };

export function createFilterItems(
  values: (string | null | undefined)[],
  allLabel: string,
): SelectItem[] {
  return [
    { label: allLabel, value: "all" },
    ...[...new Set(values.filter((value): value is string => !!value))]
      .map((value) => ({ label: value, value })),
  ];
}

