'use server';

export const getCategories = async () => {
  try {
    const resp = await fetch(`${process.env.API_URL}/categories`, {
      cache: 'no-store',
    });

    if (!resp.ok) return [];

    const categories: { id: string; name: string }[] = await resp.json();

    return categories;
  } catch (error) {
    console.log(error);
    return [];
  }
};
