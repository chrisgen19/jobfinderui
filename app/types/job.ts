export interface Job {
  id: number;
  title: string;
  job_type: string;
  poster_name: string | null;
  posted_date: string | null;
  salary: string | null;
  description: string;
  tags: string[];
  company_name: string | null;
  company_logo: string | null;
  job_url: string;
  search_keyword: string | null;
  scraped_at: string;
}

export interface JobsApiResponse {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  data: Job[];
}

export type SortByOption = "scraped_at" | "posted_date" | "title";
export type OrderOption = "asc" | "desc";
export type JobTypeOption = "" | "Full Time" | "Part Time" | "Contract" | "Freelance";
