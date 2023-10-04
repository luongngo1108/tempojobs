import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkModel } from 'src/app/shared/models/work.model';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {
  listWork: WorkModel[] = [];
  listColors: string[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private workService: WorkManagementService,
  ) {
    this.workService.getAllWork().pipe(takeUntil(this.destroy$)).subscribe(resp => {
      if (resp.result) {
        this.listWork = resp.result;
        console.log(this.listWork);
      }
    });
  }

  ngOnInit(): void {
    this.listColors.push('info');
    this.listColors.push('success');
    this.listColors.push('warning');
    this.listColors.push('danger');
    this.listColors.push('primary');
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  randomColor(): string {
    return this.listColors[Math.floor(Math.random() * this.listColors.length)];
  }
}
