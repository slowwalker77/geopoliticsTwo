export interface SteemitPost {
  id: number;
  post_id: number;
  author: string;
  permlink: string;
  title: string;
  body: string;
  created: string;
  updated?: string;
  category: string;
  json_metadata: string | object;
  net_votes: number;
  children: number;
  pending_payout_value: string;
  total_payout_value: string;
  curator_payout_value: string;
  url: string;
  root_title: string;
  beneficiaries: any[];
  max_accepted_payout: string;
  percent_steem_dollars: number;
  allow_replies: boolean;
  allow_votes: boolean;
  allow_curation_rewards: boolean;
  author_reputation: string;
  promoted: string;
  body_length: number;
  reblogged_by: string[];
  replies: any[];
  author_rewards: number;
  total_vote_weight: number;
  root_comment: number;
  max_cashout_time: string;
  total_pending_payout_value: string;
  active_votes: any[];
  replies_by_author_count: number;
  tags?: string[];
}

export interface SteemitAuthor {
  name: string;
  displayName?: string;
  about?: string;
  location?: string;
  website?: string;
  profile_image?: string;
  cover_image?: string;
  reputation?: string;
  post_count?: number;
  follower_count?: number;
  following_count?: number;
}

export interface ArticleCategory {
  id: string;
  name: string;
  description?: string;
  tag: string;
}

export interface ProcessedArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorDisplayName?: string;
  authorImage?: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  categoryName: string;
  tags: string[];
  readTime: number;
  imageUrl?: string;
  slug: string;
  votes: number;
  comments: number;
  steemitUrl: string;
}