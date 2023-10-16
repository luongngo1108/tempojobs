import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Subject, takeUntil, lastValueFrom } from 'rxjs';
import { ProfileDetail } from './user.model';
import { UserManagementService } from './user-management.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  // zoom = 12;
  // center: google.maps.LatLngLiteral;
  // options: google.maps.MapOptions = {
  //   mapTypeId: 'hybrid',
  //   zoomControl: true,
  //   scrollwheel: true,
  //   disableDoubleClickZoom: false,
  // };
  
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  @ViewChild('pacInput', { static: false }) pacInputElement: ElementRef;
  map: google.maps.Map;
  searchBox: google.maps.places.SearchBox;
  markers: google.maps.Marker[] = [];

  private destroy$: Subject<void> = new Subject<void>();
  user: any = {};
  userDetail: ProfileDetail;
  constructor(
    private authService: NbAuthService,
    private userService: UserManagementService,
    private cdref: ChangeDetectorRef,
    private ngZone: NgZone
  ) {

  }
  isEditProfile: boolean = false;
  ngOnInit(): void {
    this.isEditProfile = false;
    this.authService.onTokenChange().pipe(takeUntil(this.destroy$))
      .subscribe(async (token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
          var res = await lastValueFrom(this.userService.getUserDetailById(this.user.user.id));
          if(res.result) {
            this.userDetail = res.result;
          }
        }
      });
    this.initializeMap();
  }

  ngAfterViewInit(): void {
    
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

  initializeMap() {
    const mapProperties = {
      center: { lat: -33.8688, lng: 151.2195 },
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.cdref.detectChanges()

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
    this.searchBox = new google.maps.places.SearchBox(this.pacInputElement.nativeElement);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.pacInputElement.nativeElement);

    this.map.addListener("bounds_changed", () => {
      this.ngZone.run(() => {
        this.searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
      });
    });

    this.searchBox.addListener("places_changed", () => {
      this.ngZone.run(() => {
        this.onPlacesChanged();
      });
    });
  }

  onPlacesChanged() {
    const places = this.searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    // Clear out the old markers.
    this.markers.forEach((marker) => {
      marker.setMap(null);
    });
    this.markers = [];

    // For each place, get the icon, name, and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon as string,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      this.markers.push(
        new google.maps.Marker({
          map: this.map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have a viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    this.map.fitBounds(bounds);
  }

  updateProfileDetail(newProfileDetail: ProfileDetail) {
    this.userDetail = newProfileDetail;
  }
}
