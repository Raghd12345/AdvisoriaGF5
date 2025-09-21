import { config } from './config';

export async function safeFetch<T>(primaryUrl: string, fallbackPath: string): Promise<T> {
  const cacheKey = `cache_${fallbackPath}`;
  
  // Try API first if configured
  if (!config.useMocks) {
    try {
      const response = await fetch(primaryUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(cacheKey, JSON.stringify(data));
        return data;
      }
    } catch (error) {
      console.warn(`API failed, falling back to mock: ${error}`);
    }
  }
  
  // Try localStorage cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.warn('Cache read failed:', error);
  }
  
  // Fallback to mock data
  try {
    const response = await fetch(fallbackPath);
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.error('Mock data fetch failed:', error);
  }
  
  throw new Error(`Failed to fetch data from ${primaryUrl} and ${fallbackPath}`);
}

export async function safePost<T>(primaryUrl: string, body: any, fallbackData: T): Promise<T> {
  if (!config.useMocks) {
    try {
      const response = await fetch(primaryUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`API POST failed, using fallback: ${error}`);
    }
  }
  
  // Return fallback data with some processing
  return {
    success: true,
    data: fallbackData,
  } as T;
}