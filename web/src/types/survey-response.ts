// src/types/survey-response.ts
// Canonical schema mirrors the "survey_responses" collection.

export const SURVEY_RESPONSES_COLLECTION = "survey_responses";

export type SurveyAnswerValue = string | string[] | number | number[];

// A response stores the survey's ObjectId (for referential integrity) plus a
// denormalized slug + title so the admin dashboard can group and display
// survey-wise responses without an extra join on every read.
export interface SurveyResponse {
  id: string;
  surveyId: string;        // MongoDB ObjectId of the survey (string form)
  surveySlug: string;      // slug used in `/survey/[slug]`
  surveyTitle: string;     // denormalized survey title for fast display
  respondent?: string;
  answers: Record<string, SurveyAnswerValue>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

export interface SurveyResponseDocument {
  _id?: import("mongodb").ObjectId;
  surveyId: import("mongodb").ObjectId;
  surveySlug: string;
  surveyTitle: string;
  respondent?: string;
  answers: Record<string, SurveyAnswerValue>;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  deletedBy?: string;
}

// A summary "group" of responses for a single survey (used by the admin
// survey-wise overview).
export interface SurveyResponseGroup {
  surveyId: string;
  surveySlug: string;
  surveyTitle: string;
  icon: string;
  category: string;
  count: number;            // number of non-deleted responses for this survey
  answeredQuestions: number;
  lastResponseAt?: string;
}
