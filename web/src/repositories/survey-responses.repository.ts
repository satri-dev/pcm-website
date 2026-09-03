// src/repositories/survey-responses.repository.ts
import { getDb } from "@/core/lib/db";
import { getPublishedSurveyBySlug } from "./surveys.repository";

export const SURVEY_RESPONSES_COLLECTION = "survey_responses";

export interface SurveyResponseDocument {
  surveyId: string;
  respondent?: string;
  answers: Record<string, string | string[] | number | number[]>;
  createdAt: Date;
}

export async function createSurveyResponse(input: {
  surveyId: string;
  respondent?: string;
  answers: Record<string, string | string[] | number | number[]>;
}) {
  // Only accept responses for published, non-deleted surveys.
  const survey = await getPublishedSurveyBySlug(input.surveyId);
  if (!survey) return null;

  const db = await getDb();
  const doc: SurveyResponseDocument = {
    surveyId: input.surveyId,
    respondent: input.respondent?.trim() || undefined,
    answers: input.answers || {},
    createdAt: new Date(),
  };
  const result = await db
    .collection<SurveyResponseDocument>(SURVEY_RESPONSES_COLLECTION)
    .insertOne(doc);
  return { id: result.insertedId.toString(), ...doc };
}
