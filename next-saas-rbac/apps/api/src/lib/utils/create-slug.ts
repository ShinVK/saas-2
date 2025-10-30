export function createSlug(text: string): string {
  return text
    .normalize('NFD') // split accents from letters
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-zA-Z0-9\s-]/g, '') // remove symbols except spaces and hyphens
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // spaces to hyphens
    .replace(/-+/g, '-') // collapse multiple hyphens
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
}
