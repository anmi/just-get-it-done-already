export function classes(...names: (string | undefined | null | false)[]) {
  return names.filter((f) => f).join(" ");
}
