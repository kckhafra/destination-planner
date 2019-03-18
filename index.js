'use strict'

const youtube_Key = "AIzaSyBIMGSvhmScS5Mjtuhbo2n8QtPAxqBjgmQ"
const GEO_SEARCH_URL = 'http://www.mapquestapi.com/geocoding/v1/address';

let map;
let results;

//GOOD-----display map on start screen when page loads
  function createMap(position) {
   map = L.map('map', {
      center: ([position.coords.latitude, position.coords.longitude]),
      layers: MQ.mapLayer(),
      zoom: 11
    });    
    populateMap(position.coords.latitude, position.coords.longitude);
}
  
//GOOD-----Get user's current location and display on map
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(createMap);
  }  
 }

//GOOD-----On Search button click, scroll page to map 
function watchSearch() {
  $('#search-form').submit(function(event) {
    event.preventDefault();
    $('html,body').animate({scrollTop: $("#map").offset().top});
    
    let query = { 
      key: 'R0OL2YLpWtAiZpcpqDU6MPkjAu58HLOp',
      location: $('#search-term').val(),
    }

    $.getJSON(GEO_SEARCH_URL, query, function(data) {
      let lat = data.results[0].locations[0].latLng.lat;
      let lng = data.results[0].locations[0].latLng.lng;
      //call YouTube API here so the map results populate with marker from populateMap function below and a link to the YouTube search results
      callYoutubeAPI()
      data.results.forEach(result => {
        result.locations.forEach(location => {populateMap(location, result.providedLocation.location)});
      });
      $('#search-term').val('')
    });
  })
}

// INCOMPLTE----This will populate the results on the map and add markers
function populateMap(location, locationText) {
  // results.forEach(item => {
      L.marker([location.latLng.lat, location.latLng.lng], {
          text: locationText,
          type: 'marker',
          position: 'bottom',
          alt: locationText + 'Learn more about' + locationText + 'on YouTube',
          icon: {
              primaryColor: '#ffffff',
              secondaryColor: '#333333',
              size: 'md',
          },
      }).bindPopup(`${locationText} <br><a class="markerPopup" target='_blank' aria-label='Read more about <span class="cityName">${locationText}</span> on YouTube' href=${location.url}>YouTube</a>`).openPopup().addTo(map);
  // });
};

//create a function that includes an event handler that passes locationText to call Youtube API
function populateMapWithoutPopup(lat, lng) {
  L.marker([lat, lng], {
    text: 'Current Location',
    type: 'marker',
    position: 'bottom',
    icon: {
        primaryColor: '#ffffff',
        secondaryColor: '#333333',
        size: 'md',
    },
})
}

function callYoutubeAPI(location){
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=where+to+eat+in+${location}+best+restaurants&maxResults=1&&safeSearch=moderate&key=${youtube_Key}`)
    .then(youtubeResult =>
      youtubeResult.json())
    };

//Loads the IFrame Player API code asyncrhonously
  // let tag = document.createElement('script');
  
  // tag.src = "https://www.youtube.com/iframe_api";
  // var firstScriptTag = document.getElementsByTagName('script')[0];
  // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player) after the API code downloads.
      // var player;
      // function onYouTubeIframeAPIReady() {
      //   player = new YT.Player('player', {
      //     height: '390',
      //     width: '640',
      //     videoId: 'M7lc1UVf-VE',
      //     events: {
      //       'onReady': onPlayerReady,
      //       'onStateChange': onPlayerStateChange
      //     }
      //   });
      // }

// The API will call this function when the video player is ready.
  // function onPlayerReady(event) {
  //   event.target.playVideo();
  // }
  
//call listeners
function initializePage(){
  getLocation();
  watchSearch();
  callYoutubeAPI();
}

$(initializePage());
