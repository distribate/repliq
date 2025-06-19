export type ProfileStatsMeta = {
  views_by_day: number;
  views_by_month: number;
  views_all: number,
  rank: number
};

export type ProfileViewsDetails = {
  initiator: string;
  recipient: string;
  avatar: string | null;
  created_at: string;
};

export type ProfileStatsCharts = {
  views_by_day: Array<{ 
    hour: string;
    count: number 
  }>;
  views_by_month: Array<{ 
    day: string;
    count: number 
  }>;
}

export type ProfileStatsDetailed = {
  details: ProfileViewsDetails[],
  meta: ProfileStatsMeta,
  charts: ProfileStatsCharts
}