export const getEdition = async (format: string, language: string, type: string): Promise<void> => {
  const response = await fetch(`http://api.alquran.cloud/v1/edition?format=${format}&language=${language}&type=${type}`);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error);
  }
  return json;
}

