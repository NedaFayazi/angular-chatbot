import { type FieldState } from '@angular/forms/signals';

export function visibleError(field: FieldState<string>) {
  if (!field.touched() || field.valid()) {
    return null;
  }
  return field.errors()[0]?.message ?? null;
}
