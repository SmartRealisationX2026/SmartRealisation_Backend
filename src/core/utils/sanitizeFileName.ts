export function sanitizeFileName(filename: string): string {
  return filename
    .normalize('NFD')                      // décompose les accents
    .replace(/[\u0300-\u036f]/g, '')       // supprime les diacritiques
    .replace(/[^a-zA-Z0-9.\-_]/g, '_');    // remplace les caractères non valides par _
}
