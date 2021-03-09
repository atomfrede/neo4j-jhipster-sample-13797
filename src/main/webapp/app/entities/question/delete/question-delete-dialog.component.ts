import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IQuestion } from '../question.model';
import { QuestionService } from '../service/question.service';

@Component({
  templateUrl: './question-delete-dialog.component.html',
})
export class QuestionDeleteDialogComponent {
  question?: IQuestion;

  constructor(protected questionService: QuestionService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.questionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
