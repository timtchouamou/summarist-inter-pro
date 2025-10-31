import { Book } from '@/types/book';

const BASE_URL = 'https://us-central1-summaristt.cloudfunctions.net';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getSelectedBook(): Promise<Book> {
  const data = await fetchApi<Book>('/getBooks?status=selected');
  return data;
}

export async function getRecommendedBooks(): Promise<Book[]> {
  const data = await fetchApi<Book[]>('/getBooks?status=recommended');
  return data;
}

export async function getSuggestedBooks(): Promise<Book[]> {
  const data = await fetchApi<Book[]>('/getBooks?status=suggested');
  return data;
}

export async function getBookById(id: string): Promise<Book> {
  const data = await fetchApi<Book>(`/getBook?id=${id}`);
  return data;
}

export async function searchBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];
  const data = await fetchApi<Book[]>(`/getBooksByAuthorOrTitle?search=${encodeURIComponent(query)}`);
  return data;
}

// Helper function to get audio duration from audio URL
export async function getAudioDuration(audioUrl: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };
    audio.onerror = () => {
      reject(new Error('Failed to load audio'));
    };
    audio.src = audioUrl;
  });
}

// Format duration in minutes and seconds
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}