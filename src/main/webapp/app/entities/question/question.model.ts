import { IExam } from 'app/entities/exam/exam.model';

export interface IQuestion {
  id?: string;
  content?: string | null;
  exam?: IExam | null;
}

export class Question implements IQuestion {
  constructor(public id?: string, public content?: string | null, public exam?: IExam | null) {}
}

export function getQuestionIdentifier(question: IQuestion): string | undefined {
  return question.id;
}
