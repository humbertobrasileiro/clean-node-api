import { SaveSurveyResultModel, SurveyResultModel } from '@/domain/models/survey'

export interface SaveSurveyResultRepository {
  save (data: SaveSurveyResultModel): Promise<SurveyResultModel>
}
