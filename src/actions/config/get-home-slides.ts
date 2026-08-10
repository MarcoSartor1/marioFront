'use server';

export interface HomeSlide {
  id: string;
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  linkUrl: string | null;
  order: number;
  isActive: boolean;
}

export const getHomeSlides = async (all = false): Promise<HomeSlide[]> => {
  try {
    const resp = await fetch(`${process.env.API_URL}/home-slides${all ? '?all=true' : ''}`, {
      next: { revalidate: 60, tags: ['home-slides'] },
    });

    if (!resp.ok) return [];

    return await resp.json();
  } catch (error) {
    console.error('Error fetching home slides:', error);
    return [];
  }
};
