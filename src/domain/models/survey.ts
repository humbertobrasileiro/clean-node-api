export type SurveyModel = {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  date: Date
}

export type SurveyAnswerModel = {
  image?: string
  answer: string
}

export type SurveyResultModel = {
  id: string
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export type SaveSurveyResultModel = {
  surveyId: string
  accountId: string
  answer: string
  date: Date
}
