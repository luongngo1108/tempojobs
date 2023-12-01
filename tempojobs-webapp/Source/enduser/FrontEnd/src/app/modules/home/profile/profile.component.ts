import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone, inject } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Subject, takeUntil, lastValueFrom, Observable } from 'rxjs';
import { ProfileDetail } from './user.model';
import { UserManagementService } from './user-management.service';
import { GoogleMap } from '@angular/google-maps';
import { NbToast, NbToastrService } from '@nebular/theme';
import { MessageService } from 'primeng/api';
import { Storage, getDownloadURL, uploadBytesResumable, uploadString } from "@angular/fire/storage";
import { ref, uploadBytes } from 'firebase/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  auth: NbAuthJWTToken
  private destroy$: Subject<void> = new Subject<void>();
  user: any = {};
  userDetail: ProfileDetail;
  title = "cloudsSorage";
  selectedFile: File = null;

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
    mapId: 'f9761bc900e107a5'
    // maxZoom:this.maxZoom,
    // minZoom:this.minZoom,
  };
  latitude!: any;
  longitude!: any;
  markers: google.maps.Marker[] = [];
  // Google map end
  isEditProfile: boolean = false;

  constructor(
    private authService: NbAuthService,
    private userService: UserManagementService,
    private ngZone: NgZone,
    private cdref: ChangeDetectorRef,
    private messageService: MessageService,
    private storage: Storage = inject(Storage)
  ) {
  }
  ngOnInit(): void {
    this.isEditProfile = false;
    this.authService.onTokenChange().pipe(takeUntil(this.destroy$))
      .subscribe(async (token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
        }
      });
  }

  async ngAfterViewInit(): Promise<void> {
    var res = await lastValueFrom(this.userService.getUserDetailByUserId(this.user.user.id));
    if (res.result) {
      this.userDetail = res.result;
    }      
    // Set user marker on google map
    if(this.userDetail?.googleLocation?.latitude && this.userDetail?.googleLocation?.longitude) {
      this.latitude = this.userDetail.googleLocation.latitude;
      this.longitude = this.userDetail.googleLocation.longitude;
      this.center = {
        lat: this.latitude,
        lng: this.longitude,
      };

      this.setLocation(this.userDetail.googleLocation.address);
    } else {
      this.latitude = 10.8483685;
      this.longitude = 106.7730437;
      this.center = {
        lat: this.latitude,
        lng: this.longitude,
      };
    }  
    this.cdref.detectChanges();
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
        this.userDetail.googleLocation.address = place.formatted_address;
        this.cdref.detectChanges()
      });
    });

    this.map.googleMap.addListener( 'click', (event) => {
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
          this.userDetail.googleLocation.address = address;
          this.cdref.detectChanges()
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

  changeTab(tabName: string) {
    switch (tabName) {
      case 'about-me':
        this.isEditProfile = false;
        break;
      case 'edit-profile':
        this.isEditProfile = true;
        break;
    }
  }

  saveLocation() {
    const latLng = {
      lat: parseFloat(this.latitude.toString()),
      lng: parseFloat(this.longitude.toString())
    }
    this.geocoder.geocode({ location: latLng }).then(response => {
      if (response.results[0]) {
        this.userDetail.googleLocation.address = response.results[0].formatted_address;
        this.userDetail.googleLocation.latitude = this.latitude;
        this.userDetail.googleLocation.longitude = this.longitude;
        this.userService.saveGoogleMapLocation(this.userDetail.googleLocation).subscribe(res => {
          if(res.result) {
            this.messageService.clear();
            this.messageService.add({key: 'toast1', severity: 'success', summary: 'Thành công', 
              detail: `Đã thay đổi địa chỉ thành: ${res.result.address}.`, life: 20000  });
            // this.nbToast.success(`Your new address: ${res.result.address}`,"Saved successfully!");
          }
          else {
            this.messageService.clear();
            this.messageService.add({key: 'toast1', severity: 'error', summary: 'Lỗi', 
              detail: `Có lỗi xảy ra.`, life: 10000  });
          };
        });
      }
    })
  }

  updateProfileDetail(newProfileDetail: ProfileDetail) {
    this.userDetail = newProfileDetail;
    this.userService._currentUserDetail.next(this.userDetail);
  }

  async updateImage(event) {
    const file = event.target.files[0];
    if(file) {
      var n = Date.now();
      const filePath = `UserImages/${file.name}`;
      var storageRef = ref(this.storage,filePath )
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      this.userDetail.avatarUrl = downloadURL;
      this.userService.saveProfileDetail(this.userDetail).subscribe(res => {
        if (res.result) {
          this.messageService.clear();
          this.messageService.add({
            key: 'toast1', severity: 'success', summary: 'Thành công',
            detail: `Đổi ảnh đại diện thành công!`, life: 2000
          });
        }
        else {
          this.messageService.clear();
          this.messageService.add({
            key: 'toast1', severity: 'warn', summary: 'Lỗi',
            detail: `Có lỗi xảy ra!`, life: 2000
          });
        }
      })
    }
    else {
      this.messageService.clear();
            this.messageService.add({key: 'toast1', severity: 'error', summary: 'Lỗi', 
              detail: `Ảnh không hợp lệ.`, life: 2000  });
    }
  }
}
