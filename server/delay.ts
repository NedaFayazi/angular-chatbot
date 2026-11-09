/**
 * Resolves after the given number of milliseconds.
 *
 * Used to simulate realistic network/database latency on endpoints that
 * would otherwise resolve near-instantly against the in-memory mock data,
 * so latency-dependent UI (loading indicators, etc.) can be exercised.
 */
export async function delay(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}
