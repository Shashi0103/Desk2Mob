export interface FileShare {
  id: string;
  code: string;
  filename: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  created_at: string;
  expires_at: string;
  downloaded: boolean;
  download_count: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}