const vocals = [
  {
    es: 'á',
    en: 'a'
  },
  {
    es: 'é',
    en: 'e'
  },
  {
    es: 'í',
    en: 'i'
  },
  {
    es: 'ó',
    en: 'o'
  },
  {
    es: 'ú',
    en: 'u'
  }
];

/**
 * Elimina las tildes de un string
 * @param message string a parsear
 * @return mensaje parseado
 */
export const replaceTildes = (message: string): string => vocals.reduce((prev, actual) => {
  return prev = prev.replace(new RegExp(actual.es), actual.en);
}, message);
