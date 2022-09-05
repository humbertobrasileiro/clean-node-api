import { SurveyResultModel } from '@/domain/models/survey'

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>

export interface SaveSurveyResult {
  save (data: SaveSurveyResultModel): Promise<SaveSurveyResultModel>
}