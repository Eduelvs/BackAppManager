export const numericTransformer = {
  to: (value?: number | null) => value,
  from: (value: string | number | null): number => {
    if (value === null || value === undefined) return 0;
    return typeof value === 'number' ? value : Number(value);
  },
};
