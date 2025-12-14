export class AdminAnalytics {
  id: string;
  analyticsDate: Date;
  totalSearches: number;
  successfulSearches: number;
  newUsers: number;
  activePharmacies: number;
  topMedications?: any | null; // JSON
  searchHeatmap?: any | null; // JSON
  generatedAt: Date;
}

