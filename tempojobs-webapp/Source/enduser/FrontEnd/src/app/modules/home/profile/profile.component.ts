import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Subject, takeUntil, lastValueFrom } from 'rxjs';
import { ProfileDetail } from './user.model';
import { UserManagementService } from './user-management.service';
import { GoogleMap } from '@angular/google-maps';
import { NbToast, NbToastrService } from '@nebular/theme';

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

  constructor(
    private authService: NbAuthService,
    private userService: UserManagementService,
    private ngZone: NgZone,
    private nbToast: NbToastrService,
    private cdref: ChangeDetectorRef
  ) {
  }
  isEditProfile: boolean = false;
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
    if(this.userDetail?.googleLocation.latitude && this.userDetail?.googleLocation.longitude) {
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

        console.log({ place }, place.geometry.location?.lat(), place.geometry.location?.lng());

        //set latitude, longitude and zoom
        this.latitude = place.geometry.location?.lat();
        this.longitude = place.geometry.location?.lng();
        
        this.setLocation(place.name);
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
          console.log(address);
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
          if(res.result) this.nbToast.success(`Your new address: ${res.result.address}`,"Saved successfully!");
          else this.nbToast.danger("Some error happened");
        });
      }
    })
  }

  updateProfileDetail(newProfileDetail: ProfileDetail) {
    this.userDetail = newProfileDetail;
    this.userService._currentUserDetail.next(this.userDetail);
  }
}
