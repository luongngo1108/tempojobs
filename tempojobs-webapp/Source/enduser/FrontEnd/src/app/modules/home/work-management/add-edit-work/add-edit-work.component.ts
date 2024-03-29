import { RxFormBuilder, email } from '@rxweb/reactive-form-validators';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { WorkModel } from 'src/app/shared/models/work.model';
import { WorkManagementService } from 'src/app/shared/services/work-management.service';
import { Subject, takeUntil, map, Observable, startWith, lastValueFrom } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { DataStateManagementService } from 'src/app/shared/services/data-state-management.service';
import { DataStateModel } from 'src/app/shared/models/data-state.model';
import { GoogleMapLocation, ProfileDetail, User } from '../../profile/user.model';
import { UserManagementService } from '../../profile/user-management.service';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { QuillConfiguration } from 'src/app/shared/components/rich-inline-edit/rich-inline-edit.component';
import { GoogleMap } from '@angular/google-maps';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { PaymentServiceService } from 'src/app/shared/services/payment-service.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-edit-work',
  templateUrl: './add-edit-work.component.html',
  styleUrls: ['./add-edit-work.component.scss']
})
export class AddEditWorkComponent implements OnInit, OnDestroy, AfterViewInit {
  frmCreateWork: FormGroup;
  workModel: WorkModel = new WorkModel();
  createBy: any;
  listWorkType: DataStateModel[] = [];
  listWorkStatus: DataStateModel[] = [];
  listProvince: any;
  listDistrict: any;
  editorOptions = QuillConfiguration;
  matcher = new MyErrorStateMatcher();
  private destroy$: Subject<void> = new Subject<void>();
  filteredOptions: Observable<any>;
  myControl = new FormControl<string>('');
  provinceName: string;

  // Google map start
  @ViewChild('search')
  public searchElementRef!: ElementRef;
  @ViewChild(GoogleMap)
  public map!: GoogleMap;
  geocoder = new google.maps.Geocoder();

  zoom = 15;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDefaultUI: true,
    fullscreenControl: true,
    disableDoubleClickZoom: true,
    mapTypeId: 'roadmap',
    // maxZoom:this.maxZoom,
    // minZoom:this.minZoom,
  };
  latitude!: any;
  longitude!: any;
  markers: google.maps.Marker[] = [];
  // Google map end
  workHoursValue: number = 1;
  workProfitValue: string = "";

  minDate: Date = new Date();

  userProfile: ProfileDetail = new ProfileDetail();

  constructor(
    private frmBuilder: RxFormBuilder,
    private workService: WorkManagementService,
    private dataStateService: DataStateManagementService,
    private router: Router,
    private userService: UserManagementService,
    private authService: NbAuthService,
    private ngZone: NgZone,
    public dialog: MatDialog,
    private paymentService: PaymentServiceService,
    private cdref: ChangeDetectorRef,
    private messageService: MessageService
  ) {
    this.workModel = window?.history?.state?.work ?? new WorkModel();
    this.dataStateService.getListProvince().pipe(takeUntil(this.destroy$)).subscribe(resp => {
      if (resp) {
        this.listProvince = resp;
      }
    }).add(() => {
      if (this.workModel?.workProvince) {
        this.listProvince.map((province, index) => {
          if (province.codename === this.workModel?.workProvince) {
            this.listDistrict = this.listProvince[index].districts;
          }
        })
      }
    });
    this.dataStateService.getDataStateByType("WORK_TYPE").pipe(takeUntil(this.destroy$)).subscribe(resp => {
      if (resp.result) {
        this.listWorkType = resp.result;
      }
    });
    this.dataStateService.getDataStateByType("WORK_STATUS").pipe(takeUntil(this.destroy$)).subscribe(resp => {
      if (resp.result) {
        this.listWorkStatus = resp.result;
      }
    });
  }

  ngOnInit() {
    if (this.workModel) {
      this.workHoursValue = this.workModel?.workHours;
    }
    this.frmCreateWork = this.frmBuilder.formGroup(WorkModel, this.workModel);
    this.authService.onTokenChange().pipe(takeUntil(this.destroy$))
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.createBy = token.getPayload();
          if (this.createBy?.user?.id) {
            this.userService.getUserDetailByUserId(this.createBy?.user?.id).pipe(takeUntil(this.destroy$)).subscribe(profile => {
              if (profile.result) this.userProfile = profile.result;
            })
          }
        }
      });
    this.frmCreateWork.get('workProvince').valueChanges.subscribe((valueChanges) => {
      this.provinceName = this.listProvince?.find(province => province.codename === valueChanges)?.name;
      this.listProvince.map((province, index) => {
        if (province.codename === valueChanges) {
          this.listDistrict = this.listProvince[index].districts;
        }
      })
    });
    this.frmCreateWork.get('workHours').valueChanges.subscribe((valueChanges) => {
      if (valueChanges && valueChanges !== this.workHoursValue) {
        this.workHoursValue = valueChanges;
        this.frmCreateWork.get('workHours').setValue(valueChanges);
      }
    });
    this.frmCreateWork.get('workProfit').valueChanges.subscribe((valueChanges) => {
      if (valueChanges && valueChanges !== this.workProfitValue) {
        this.workProfitValue = valueChanges.toString();
        const cleanValue = valueChanges.replace(/[^0-9]/g, '');
        const numberValue = Number(cleanValue);
        const formattedValue = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(numberValue);
        this.frmCreateWork.get('workProfit').setValue(formattedValue.replace('₫', ''));
      }
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : '';
        return name ? this._filter(name as string) : this.listProvince.slice();
      }),
    );
  }

  async ngAfterViewInit(): Promise<void> {
    // Set user marker on google map
    if (this.workModel?.googleLocation?.latitude && this.workModel?.googleLocation?.longitude) {
      this.latitude = this.workModel.googleLocation.latitude;
      this.longitude = this.workModel.googleLocation.longitude;
      this.center = {
        lat: this.latitude,
        lng: this.longitude,
      };

      this.setLocation(this.workModel.googleLocation.address);
    } else {
      this.latitude = 10.8483685;
      this.longitude = 106.7730437;
      this.center = {
        lat: this.latitude,
        lng: this.longitude,
      };
    }
    // Binding autocomplete to search input control
    let autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef.nativeElement
    );
    // Align search box to center
    // this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
    //   this.searchElementRef.nativeElement
    // );
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        //get the place result
        const bounds = new google.maps.LatLngBounds();
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        console.log({ place }, place.geometry.location?.lat(), place.geometry.location?.lng());

        //set latitude, longitude and zoom
        this.latitude = place.geometry.location?.lat();
        this.longitude = place.geometry.location?.lng();

        this.setLocation(place.name);
        if (!this.workModel.googleLocation) this.workModel.googleLocation = new GoogleMapLocation();
        this.workModel.googleLocation.address = place.formatted_address;
        this.cdref.detectChanges();
      });
    });

    this.map.googleMap.addListener('click', (event) => {
      var location = event.latLng;
      this.latitude = location?.lat();
      this.longitude = location?.lng();
      const latLng = {
        lat: parseFloat(this.latitude.toString()),
        lng: parseFloat(this.longitude.toString())
      }

      this.geocoder.geocode({ location: latLng }).then(response => {
        if (response.results[0]) {
          const address = response.results[0].formatted_address;
          if (!this.workModel.googleLocation) this.workModel.googleLocation = new GoogleMapLocation();
          this.workModel.googleLocation.address = address;
          this.cdref.detectChanges();
          this.setLocation(address);
        }
      })
    });
  }
  setLocation(title: string = null) {
    this.center = {
      lat: this.latitude,
      lng: this.longitude,
    };
    // set marker
    this.markers.forEach((marker) => {
      marker.setMap(null);
    });
    this.markers = [];
    const latLng = {
      lat: parseFloat(this.latitude.toString()),
      lng: parseFloat(this.longitude.toString())
    }
    this.markers.push(
      new google.maps.Marker({
        map: this.map.googleMap,
        title: title,
        position: latLng,
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveData() {
    if (this.frmCreateWork.valid) {
      const model: WorkModel = Object.assign({}, this.frmCreateWork.value);
      model.googleLocation = new GoogleMapLocation();
      const currentDate = new Date();
      const diffTime = Math.abs(Number(model.startDate) - Number(currentDate));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      var amount = diffDays * 5000 + model.quantity * 1000;
      if (model?.workStatusId === this.listWorkStatus?.find(workStatus => workStatus.dataStateName === 'Từ chối duyệt')?.dataStateId) {
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'info', summary: 'Thông báo',
          detail: `Số tiền công việc trước sẽ được hoàn trả, bạn cần thanh toán để đăng công việc này.`, life: 50000
        });
      }
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        backdropClass: 'custom-backdrop',
        hasBackdrop: true,
        data: {
          content: `Bạn có chắc muốn đăng công việc này?`,
          nextButtonContent: "Chắc chắn"
        },
      });

      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          // Save work
          this.workModel = model;
          console.log(this.workModel)
          const latLng = {
            lat: parseFloat(this.latitude?.toString()),
            lng: parseFloat(this.longitude?.toString())
          }
          try {
            await this.geocoder.geocode({ location: latLng }).then(async response => {
              if (response.results[0]) {
                this.workModel.googleLocation.address = response.results[0].formatted_address;
                this.workModel.googleLocation.latitude = this.latitude;
                this.workModel.googleLocation.longitude = this.longitude;
              }
            })
          } catch (error) {
            console.log("Request limited!!!");
          }

          if (!this.workModel?.workId) {
            model.workId = 0;
            model.workStatusId = this.listWorkStatus?.find(workStatus => workStatus.dataStateName === 'Đang duyệt')?.dataStateId;
          } else {
            if (model.workStatusId === this.listWorkStatus?.find(workStatus => workStatus.dataStateName === 'Từ chối duyệt')?.dataStateId) {
              model.workStatusId = this.listWorkStatus?.find(workStatus => workStatus.dataStateName === 'Đang duyệt')?.dataStateId;
            }
          }
          if (this.createBy) {
            model.createdById = this.createBy?.user?.id;
            model.createdBy = this.userProfile;
          }
          if (!model.workApply) {
            model.workApply = [];
          }
          var respSaveWork = await lastValueFrom(this.workService.saveWork(model));
          if (respSaveWork.result) {
            this.workModel = respSaveWork.result;
            this.messageService.clear();
            this.messageService.add({
              key: 'root-toast', severity: 'success', summary: 'Thành công',
              detail: 'Công việc của bạn đã được đưa vào hàng chờ duyệt của chúng tôi!', life: 20000
            });
            this.router.navigateByUrl('/created-manage');
          }
        }
      });
    }
  }

  displayFn(province: any): string {
    return province && province.name ? province.name : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.listProvince.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return (control && control.invalid);
  }
}
