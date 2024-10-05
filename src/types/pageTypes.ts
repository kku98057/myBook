export interface pageProps {
  id: number;
  front: string;
  back: string;
}
export interface pageState {
  page: number;
  nextPage: (by: number) => void;
  prevPage: (by: number) => void;
  setPage: (by: number) => void;
}
