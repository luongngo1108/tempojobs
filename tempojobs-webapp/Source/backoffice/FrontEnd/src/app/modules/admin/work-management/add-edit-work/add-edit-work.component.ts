import { RxFormBuilder, email, model } from '@rxweb/reactive-form-validators';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone, ChangeDetectorRef, Inject } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { Subject, takeUntil, map, Observable, startWith, lastValueFrom, catchError } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { GoogleMap } from '@angular/google-maps';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { WorkModel } from '../work.model';
import { DataStateModel } from '../../datastate-management/data-state.model';
import { QuillConfiguration } from 'src/app/modules/shared/components/rich-inline-edit/rich-inline-edit.component';
import { WorkManagementService } from 'src/app/modules/shared/services/work-management.service';
import { DatastateService } from '../../datastate-management/datastate.service';
import { UserManagementService } from '../../user-management/user-management.service';
import { GoogleMapLocation } from 'src/app/modules/shared/models/user.model';
import { ConfirmDialogComponent } from 'src/app/modules/shared/components/confirm-dialog/confirm-dialog.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { WorkApplyDialogComponent } from '../work-apply-dialog/work-apply-dialog.component';
@Component({
  selector: 'app-add-edit-work',
  templateUrl: './add-edit-work.component.html',
  styleUrls: ['./add-edit-work.component.scss']
})
export class AddEditWorkComponent {
  frmCreateWork: FormGroup;
  workModel: WorkModel = new WorkModel();
  createBy: any;
  listWorkType: DataStateModel[] = [];
  listWorkStatus: DataStateModel[] = [];
  listProvince: any;
  listDistrict: any;
  listUser: any;
  editorOptions = QuillConfiguration;
  matcher = new MyErrorStateMatcher();
  private destroy$: Subject<void> = new Subject<void>();
  filteredOptions: Observable<any>;
  myControl = new FormControl<string>('');
  provinceName: string;
  action: string;

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
  workHoursValue: number = 0.5;
  workProfitValue: string = "";

  constructor(
    private frmBuilder: RxFormBuilder,
    private workService: WorkManagementService,
    private dataStateService: DatastateService,
    private router: Router,
    private userService: UserManagementService,
    private authService: NbAuthService,
    private ngZone: NgZone,
    public dialog: MatDialog,
    private cdref: ChangeDetectorRef,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEditWorkComponent>
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
        this.listWorkStatus.sort((a, b) => a.order - b.order)
      }
    });
    this.userService.getUserByRole("User").subscribe(resp => {
      if (resp.result) {
        this.listUser = resp.result;
      }
    });
  }

  ngOnInit() {
    this.action = this.data.action;
    if (this.data.model && this.action === "Edit") this.workModel = this.data.model;
    if (!this.data.model && this.action === "Add") this.workModel = new WorkModel();
    this.dialogRef.updatePosition({ right: '0' })
    this.frmCreateWork = this.frmBuilder.formGroup(WorkModel, this.workModel);
    // this.authService.onTokenChange().pipe(takeUntil(this.destroy$))
    //   .subscribe((token: NbAuthJWTToken) => {
    //     if (token.isValid()) {
    //       this.createBy = token.getPayload();
    //     }
    //   });
    // this.userService.getUserByUserId(this.workModel?.createdById).subscribe(res => {
    //   if (res.result) {
    //     this.createBy = {
    //       displayName: res.result.displayName,
    //       id: res.result['_id'],
    //       role: res.result.role,
    //       email: res.result.email
    //     }
    //   }
    // })
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

    try {
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
    } catch (error) {

    }

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
    try {
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
    catch (error) {
      console.log(error)
    }
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
    
      if (model.createdById) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          backdropClass: 'custom-backdrop',
          hasBackdrop: true,
          data: {
            content: this.action === 'Add' ? `Create new work?` : `All data will be change?`,
            nextButtonContent: "Sure"
          },
        });
        this.userService.getUserDetailByUserId(model?.createdById).subscribe(res => {
          if (res.result) {
            this.createBy = res.result;
            console.log(this.createBy)
          }
        })
        dialogRef.afterClosed().subscribe(async result => {
          if (result) {
            // Save work
            this.workModel = model;
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
            }
            if (this.createBy) {
              model.createdBy = this.createBy;
            }
            if (!model.workApply) {
              model.workApply = [];
            }
            console.log(model)
            var respSaveWork = await lastValueFrom(this.workService.saveWork(model));
            if (respSaveWork.result) {
              this.workModel = respSaveWork.result;
              this.dialogRef.close(true);
            }
          }
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 'toast1', severity: 'warn', summary: 'Warning',
          detail: `Please select a user!`, life: 4000
        });
        return;
      }  
    }
  }

  displayFn(province: any): string {
    return province && province.name ? province.name : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.listProvince.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  formatLabel(value: number): string {
    return `${value}h`;
  }

  openUserDetail(id: string) {
    const dialogRef = this.dialog.open(UserProfileComponent, {
      height: 'auto',
      width: '600px',
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        userId: id
      },
    });
  }

  changeWorkStatus(status: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        content: `Notification will be sent to the when you change to 'Từ chối duyệt' or 'Đã duyệt' or 'Cần thanh toán'.`,
        nextButtonContent: "Sure"
      },
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.workService.changeWorkStatus(status.dataStateId, this.workModel.workId).subscribe(res => {
          if (res.result) {
            this.workModel = res.result;
            this.frmCreateWork.controls['workStatusId'].setValue(this.workModel.workStatusId);
            this.messageService.clear();
            this.messageService.add({
              key: 'toast1', severity: 'success', summary: 'Success',
              detail: `Change work status successfully`, life: 4000
            });
          }
        })
      }
    });
  }

  openUserApplied() {
    const dialogRef = this.dialog.open(WorkApplyDialogComponent, {
      backdropClass: 'custom-backdrop',
      hasBackdrop: true,
      data: {
        model: this.workModel
      },
    });

    // dialogRef.afterClosed().subscribe(res => {
    //   if(res) {
    //     this.workService.changeWorkStatus(status.dataStateId, this.workModel.workId).subscribe(res => {
    //       if (res.result) {
    //         this.workModel = res.result;
    //         this.frmCreateWork.controls['workStatusId'].setValue(this.workModel.workStatusId);
    //         this.messageService.clear();
    //         this.messageService.add({
    //           key: 'toast1', severity: 'success', summary: 'Success',
    //           detail: `Change work status successfully`, life: 4000
    //         });
    //       }
    //     })
    //   }
    // }); 
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return (control && control.invalid);
  }
}
