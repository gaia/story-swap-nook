
export const validateISBN = (isbn: string): boolean => {
  // Remove any hyphens or spaces from the ISBN
  const cleanISBN = isbn.replace(/[-\s]/g, '');
  
  if (cleanISBN.length === 10) {
    return validateISBN10(cleanISBN);
  } else if (cleanISBN.length === 13) {
    return validateISBN13(cleanISBN);
  }
  return false;
};

const validateISBN10 = (isbn: string): boolean => {
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const digit = parseInt(isbn[i]);
    if (isNaN(digit)) return false;
    sum += digit * (10 - i);
  }
  
  const last = isbn[9].toLowerCase();
  const checksum = (11 - (sum % 11)) % 11;
  return last === (checksum === 10 ? 'x' : checksum.toString());
};

const validateISBN13 = (isbn: string): boolean => {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(isbn[i]);
    if (isNaN(digit)) return false;
    sum += digit * (i % 2 === 0 ? 1 : 3);
  }
  
  const lastDigit = parseInt(isbn[12]);
  if (isNaN(lastDigit)) return false;
  
  const checksum = (10 - (sum % 10)) % 10;
  return lastDigit === checksum;
};

export const fetchBookData = async (isbn: string) => {
  const cleanISBN = isbn.replace(/[-\s]/g, '');
  const response = await fetch(
    `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanISBN}&format=json&jscmd=data`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch book data');
  }
  
  const data = await response.json();
  const bookData = data[`ISBN:${cleanISBN}`];
  
  if (!bookData) {
    throw new Error('Book not found');
  }
  
  return {
    title: bookData.title,
    author: bookData.authors?.[0]?.name || 'Unknown Author',
    cover_url: bookData.cover?.large || bookData.cover?.medium || bookData.cover?.small,
    description: bookData.notes || bookData.excerpts?.[0]?.text || null,
  };
};
