"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Briefcase,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  AlertCircle,
} from "lucide-react";
import JobCard from "./components/JobCard";
import JobModal from "./components/JobModal";
import { Job, JobsApiResponse, SortByOption, OrderOption, JobTypeOption } from "./types/job";

const API_BASE_URL = "https://jobapi.cgdiomampo.dev/jobs";

export default function Home() {
  // --- State ---
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Pagination info from API
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filters
  const [page, setPage] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [jobType, setJobType] = useState<JobTypeOption>("");
  const [sortBy, setSortBy] = useState<SortByOption>("posted_date");
  const [order, setOrder] = useState<OrderOption>("desc");

  const perPage = 24;

  // Debounce logic for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, jobType, sortBy, order]);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchJobs = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", perPage.toString());
        if (debouncedKeyword) params.append("keyword", debouncedKeyword);
        if (jobType) params.append("job_type", jobType);
        params.append("sort_by", sortBy);
        params.append("order", order);

        const url = `${API_BASE_URL}?${params.toString()}`;
        console.log("Fetching:", url);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data: JobsApiResponse = await response.json();

        setJobs(data.data || []);
        setTotalJobs(data.total || 0);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error("Fetch error:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load jobs. Please check your connection.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page, debouncedKeyword, jobType, sortBy, order]);

  // --- Handlers ---
  const handleNextPage = (): void => setPage((p) => Math.min(totalPages, p + 1));
  const handlePrevPage = (): void => setPage((p) => Math.max(1, p - 1));
  const toggleOrder = (): void => setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  const handleViewDetails = (job: Job): void => setSelectedJob(job);
  const handleCloseModal = (): void => setSelectedJob(null);

  // --- Formatters ---
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">JobFinder</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Personal Job Feed</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex text-sm text-slate-500 gap-4">
              <span className="flex items-center gap-1">
                <Clock size={14} /> {totalJobs.toLocaleString()} jobs available
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs (e.g. React, Python)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            {/* Filters Row */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {/* Job Type */}
              <div className="relative min-w-[140px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as JobTypeOption)}
                >
                  <option value="">All Types</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="relative min-w-[150px]">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortByOption)}
                >
                  <option value="scraped_at">Scraped Date</option>
                  <option value="posted_date">Posted Date</option>
                  <option value="title">Job Title</option>
                </select>
              </div>

              {/* Order Toggle */}
              <button
                onClick={toggleOrder}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium min-w-[110px] justify-center"
              >
                <ArrowUpDown className="w-4 h-4 text-slate-500" />
                {order === "asc" ? "Ascending" : "Descending"}
              </button>
            </div>
          </div>
        </div>

        {/* Content State Handling */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm animate-pulse"
              >
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 && !error ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="inline-flex bg-slate-50 p-4 rounded-full mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No jobs found</h3>
            <p className="text-slate-500">Try adjusting your search terms or filters</p>
          </div>
        ) : (
          <>
            {/* Results info */}
            <div className="mb-4 text-sm text-slate-500">
              Showing {((page - 1) * perPage) + 1} - {Math.min(page * perPage, totalJobs)} of {totalJobs.toLocaleString()} jobs
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  formatDate={formatDate}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center mt-12 mb-8">
              <div className="inline-flex items-center bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-r border-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <span className="px-3 sm:px-4 py-2.5 bg-slate-50 text-slate-600 text-sm font-bold min-w-[100px] sm:min-w-[120px] text-center">
                  {page} / {totalPages}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-l border-slate-200"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={handleCloseModal}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}
