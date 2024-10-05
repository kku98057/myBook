export interface pageProps {
  id: number;
  front: string;
  back: string;
  frontUrl?: string;
  backUrl?: string;
}
export interface pageState {
  page: number;
  nextPage: (by: number) => void;
  prevPage: (by: number) => void;
  setPage: (by: number) => void;
}
