import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { PaymentHistory } from 'src/app/shared/models/payment-history.model';
import { PaymentServiceService } from 'src/app/shared/services/payment-service.service';
import { Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-profile-activity',
  templateUrl: './profile-activity.component.html',
  styleUrls: ['./profile-activity.component.scss']
})
export class ProfileActivityComponent implements OnInit, OnDestroy {
  userPaymentHistories: PaymentHistory[] = [];
  private destroy$: Subject<void> = new Subject<void>();
  userLoggedIn: any;
  constructor(
    private paymentService: PaymentServiceService,
    private authService: NbAuthService
  ) {
    this.authService.onTokenChange().pipe(takeUntil(this.destroy$))
      .subscribe(async (token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.userLoggedIn = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
          
        }});
      
  }
  ngOnInit(): void {
    this.paymentService.getPaymentHistoryByUserId(this.userLoggedIn.user.id).subscribe(res => {
      if(res.result) this.userPaymentHistories = res.result;
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
