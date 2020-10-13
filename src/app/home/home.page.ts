import { Component, ElementRef, ViewChild } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;

import { MessagingService } from '../services/messaging.service';
import { AlertController, ToastController } from '@ionic/angular';
import { ArchDataService} from '../services/arch-data.service';

//HOW ABOUT TRACKING THE USER LOCATION AND GIVING THEM MOTIVATIONAL 
//PUSH NOTIFICATIONS AS THEY GET NEARER


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  currentLat;
  currentLng;

  //Regerence to the DOM object
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  //Reference to the google map
  map: google.maps.Map;
  home: google.maps.Marker;
  //Specify only one info window to be keeping track of
  infoWindow = new google.maps.InfoWindow();

  constructor(private archService: ArchDataService, private messagingService: MessagingService, private alertCtrl: AlertController, private toastCtrl: ToastController) { 

    this.listenForMessages();

    }

  ionViewWillEnter() {

    this.archService.getProducts();
    this.loadMap();
    this.getCurrentPosition();

  }


  // -------------- WEB PUSH NOTIFICATION FUNCTIONALITY ------------------------- //

  listenForMessages() {
    this.messagingService.getMessages().subscribe(async (msg: any) => {

      console.log("New message" , msg)

      const alert = await this.alertCtrl.create({

        //Different information stored in the notiication
        header: msg.notification.title,
        subHeader: msg.notification.body,
        message: msg.data.info,
        buttons: ['OK'],
      });
 
      await alert.present();
    });
  }
 
  requestPermission() {
    this.messagingService.requestPermission().subscribe(
      async token => {
        //If we get permission, display a little toast
        const toast = await this.toastCtrl.create({
          message: 'Got your token',
          duration: 2000
        });
        toast.present();
      },
      async (err) => {
        //If we get an error, display the reason
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: err,
          buttons: ['OK'],
        });
 
        await alert.present();
      }
    );
  }
 
  async deleteToken() {
    this.messagingService.deleteToken();
    const toast = await this.toastCtrl.create({
      message: 'Token removed',
      duration: 2000
    });
    toast.present();
  }


  // ------------------------ GOOGLE MAP RELATED CODE BELOW ------------------------ //

  loadMap() {

    // You can create a style for your map and hide certain things.
    // In this case, hiding "Points of Interest"
    // You can pass this styles object into the mapOptions as "styles"
    let styles: google.maps.MapTypeStyle[] = [
      {
        featureType: "poi",
        stylers: [
          {
            visibility: 'off'
          }
        ]
      }
    ]

    let mapOptions: google.maps.MapOptions = {

      mapTypeId: google.maps.MapTypeId.TERRAIN,
      styles: styles,
      //Hide the type controls, eg satellite, terrain
      mapTypeControl: false

    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)

  }

  async getCurrentPosition() {

    // await Geolocation.getCurrentPosition().then(resp => {

    //   const lat = resp.coords.latitude;
    //   const lng = resp.coords.longitude
    //   this.focusMap(lat, lng);
    //   this.addMarker(lat, lng, '<p>Whats the difference between a p</p><b>and a b?</b>');

    // });

    const lat = 51.896833883012484;
    const lng = -8.470458984375002
    this.focusMap(lat, lng);

    this.addMarker(lat, lng, '<p>Whats the difference between a p</p><b>and a b?</b>');

  }

  focusMap(lat, lng) {

    let latLng = new google.maps.LatLng(lat, lng);

    this.map.setCenter(latLng);
    this.map.setZoom(15);

  }

  addMarker(lat, lng, info){

    //Making sure the latlng is a googls maps type
    let latLng = new google.maps.LatLng(lat, lng);

    //Make sure home is a google marker type so we get all the typings
    this.home = new google.maps.Marker({

      //Usually need to specify what map element it's going to be displayed on
      map: this.map,
      position: latLng,
      animation: google.maps.Animation.DROP

    })

    let infoWindow = new google.maps.InfoWindow({

      content: info,

    });

    //We've created an info window, but now we need to attach it to the marker
    this.home.addListener('click', () => 
    
      //Specify which map to display the window on, and what the anchor is - in this case the home marker.
      infoWindow.open(this.map, this.home)
    
    )

    

  }

  removeMarker(){
    //Setting a marker to null simply removes the marker
    this.home.setMap(null);

  }

  toggleMarker(){

    if(this.home.getAnimation() !== null){
      this.home.setAnimation(null);
    }else{
      this.home.setAnimation(google.maps.Animation.BOUNCE);
    }

  }

  showNearbyPlaces(){

    //Using google services is basically always the same, you
    // a) define a sservice
    // b) define a request
    // c) sent it to the service

    //You have to create a google places search request
    let request: google.maps.places.PlaceSearchRequest = {

      type: 'restaurant',
      keyword:'kebab',
      radius: 1000,
      //Using our home marker's position to set the location to search from
      location: this.home.getPosition()
    };
  
    //And then pass it into the google Places service
    let service = new google.maps.places.PlacesService(this.map);
  
    service.nearbySearch(request, (results, status) => {

      console.log('Results ', results)

      if (status === google.maps.places.PlacesServiceStatus.OK) {
        
        for(let place of results){

          this.addNearbyMarker(place)

        }


      }
    });

  }

  //Using all these google types as much as possible, really helps with code copletion
  addNearbyMarker(place: google.maps.places.PlaceResult){

    // You can define some cutom elements for an icon, like scalesize etc.
    // const icon = {
    //   url: place.icon,
    //   scaledSize: new google.maps.Size(25, 25),
    //   origin: new google.maps.Point(0, 0),
    //   anchor: new google.maps.Point(0, 0)
    // };

    let marker = new google.maps.Marker({

      map: this.map,
      animation: google.maps.Animation.DROP,
      position: place.geometry.location,
      icon: place.photos[0].getUrl({maxWidth: 35, maxHeight: 35})


    });

    marker.addListener('click', () => {
      let photo = '';

      if (place.photos.length > 0) {
        photo = place.photos[0].getUrl({maxWidth: 75, maxHeight: 75})

      }
      this.infoWindow
        .setContent(`<img src="${photo}" style="width: 100%;max-height: 100px;object-fit: contain; "/><br>
      <b style="color: black;"> ${place.name}</b><br>${place.vicinity}`);
      this.infoWindow.open(this.map, marker);
    });

  }

  //Use type custom event for code completion etc. This event comes from the ionChange in the searchbar
  findPlace(e : CustomEvent){

    console.log(e.detail.value);

    //When creating a query to search for places, you need an object with a query and fields etc.
    let request = {

      query: e.detail.value,
      fields: ['name' ]
    };
  
    //And then pass it into the google Places service
    let service = new google.maps.places.PlacesService(this.map);

    //Using a 'textSearch' instead of a 'nearbySearch' as previous.
    service.textSearch(request, (results, status) => {

      console.log('Results ', results)

      if (status === google.maps.places.PlacesServiceStatus.OK) {
        
        for(let place of results){

          this.addNearbyMarker(place)

        }

      }
    });



  }


}


