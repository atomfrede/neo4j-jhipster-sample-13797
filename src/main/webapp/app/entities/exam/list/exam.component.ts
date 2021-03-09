import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IExam } from '../exam.model';
import { ExamService } from '../service/exam.service';
import { ExamDeleteDialogComponent } from '../delete/exam-delete-dialog.component';

@Component({
  selector: 'jhi-exam',
  templateUrl: './exam.component.html',
})
export class ExamComponent implements OnInit {
  exams?: IExam[];
  isLoading = false;

  constructor(protected examService: ExamService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.examService.query().subscribe(
      (res: HttpResponse<IExam[]>) => {
        this.isLoading = false;
        this.exams = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IExam): string {
    return item.id!;
  }

  delete(exam: IExam): void {
    const modalRef = this.modalService.open(ExamDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.exam = exam;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
