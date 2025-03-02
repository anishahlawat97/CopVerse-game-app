interface City {
  id: string;
  name: string;
  imageUrl: string;
  distance: number;
}

interface Vehicle {
  id: string
  type: string
  range: number
  count: number
  imageUrl: string
}

interface ResultData {
  success: boolean;
  message: string;
  winners: WinnerData[] | null;
}

interface WinnerData {
  name: string;
  cityId: string;
}