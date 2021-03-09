import { IQuestion } from 'app/entities/question/question.model';

export interface IExam {
  id?: string;
  title?: string | null;
  questions?: IQuestion[] | null;
}

export class Exam implements IExam {
  constructor(public id?: string, public title?: string | null, public questions?: IQuestion[] | null) {}
}

export function getExamIdentifier(exam: IExam): string | undefined {
  return exam.id;
}
