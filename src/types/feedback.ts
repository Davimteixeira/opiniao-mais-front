export interface FeedbackStats {
  nps: number;
  total_responses: number;
  average_rating: number;
  nps_change: number;
  response_rate_change: number;
  average_rating_change: number;
}

export interface RecentFeedback {
  id: number;
  user: string;
  rating: number;
  comment: string | null;
  submitted_at: string;
}

export type Period = '7d' | '30d' | '90d' | '12m';
