/* global Ember, hebeutils, _ */
import DefaultStory from 'hebe-dash/components/stories/story-types/default-story/component';

var associationAllotmentData;
var associationAllotmentLocations;

export default DefaultStory.extend({
    // Story settings (including default values)
    // Uncomment any setting you need to change, delete any you don't need
    storyConfig: {
        title: 'Association managed allotment sites', // (Provide a story title)
        subTitle: 'Details of self managed allotment sites around Leeds.', // (Provide a story subtitle)
        author: 'imactivate',

        description: 'Details of all self managed association allotment sites around the city.', // (Provide a longer description of the story)
        license: 'Association managed allotment sites, (c) Leeds City association, 2016, This information is licensed under the terms of the Open Government Licence.', // (Define which license applies to usage of the story)
        dataSourceUrl: 'http://leedsdatamill.org/dataset/association-managed-allotment-sites', // (Where did the data come from?)
        feedbackEmail: 'info@leedsdatamill.org', // (Provide an email users can contact about this story)

        color: 'lime', // (Set the story colour)
        // width: '2', // (Set the width of the story. If your story contains a slider, you must define the width, even if it is the same as the default.)
        // height: '2', // (Set the height of the story)
        // headerImage: '', // (Provide an image to show in the story header instead of the title and subtitle)

        // slider: false, // (Add a horizontal slider to the story)
         scroll: true, // (Should the story vertically scroll its content?)
    },

    // Executes when user selects a location from the select tag.f
    selectedOptionChanged: function () {
        // Selected alotment
        var associationAllotment = (this.get('selectedOption')).toString();

        // Sizes and Details options
        var allotmentSizeArray = ['0-124m.sq.', '125-249m.sq.', '250m.sq.', '>250m.sq.'];
        var allotmentsDetailsArray = ['Facilities'];

        var selector = associationAllotmentData[associationAllotment];
        
        document.getElementById('associationAllotmentHolder').style.display = "block";
        
        // Add the locations
        document.getElementById('associationAllotmentLocation').innerHTML = '<tr><td><i class="fa fa-fw fa-map-marker"></i></td><td>' + selector['Location'] + "</td></tr>";

        // Set sizes
        document.getElementById('associationAllotmentSizes').innerHTML = '<tr><td><strong><i class="fa fa-fw fa-arrows-alt"></i></strong></td><td><strong>Size of plots</strong></td></tr>'

        for (var i = 0; i < allotmentSizeArray.length; i++) {
            var allotmentSize = allotmentSizeArray[i];
            document.getElementById('associationAllotmentSizes').innerHTML += '<tr><td></td><td>' + allotmentSize + ': <strong style="color: green;">' + selector[allotmentSize] + '</strong></td></tr>';
        }

        document.getElementById('associationAllotmentDetails').innerHTML = '<tr><td><strong><i class="fa fa-fw fa-info-circle"></i></strong></td><td><strong>Details</strong></td></tr>';

        for (var j = 0; j < allotmentsDetailsArray.length; j++) {
            var allotmentDetail = allotmentsDetailsArray[j];
            document.getElementById('associationAllotmentDetails').innerHTML += '<tr><td></td><td>' + allotmentDetail + ': <strong style="color: green;">' + selector[allotmentDetail] + '</strong></td></tr>';
        }

        var associationAllotmentLat = Number(selector.Lat);
        var associationAllotmentLng = Number(selector.Lng);

        var marker = Ember.A([{
            title: associationAllotment,
            body: '',
            lat: associationAllotmentLat,
            lng: associationAllotmentLng,
    }, ]);

        this.set('lat', associationAllotmentLat);
        this.set('lng', associationAllotmentLng);
        this.set('markers', marker);
        this.set('zoom', 16);

    }.observes('selectedOption'),

    setup: function () {
        this.setProperties({
            lat: 53.801277,
            lng: -1.548567,
            zoom: 12,
            markers: Ember.A([]),
            selectedItem: null
        });
    }.on('init'),

    onInsertElement: function () {
        var obj = this;

        setTimeout(function () {
            obj.set('loaded', true);
        });

        // Array to contain list of wards. This content is then shown in the selection box.
        var items = [];

        // Load the papa parse script
        $.getScript("http://www.imactivate.com/datadashboardfiles/PapaParse-4.1.0/papaparse.js", function () {
            Papa.parse('http://tomforth.co.uk/widgetCSV/allotmentsAssociation.csv', {
                download: true,
                complete: function (results) {
                    associationAllotmentData = create3DjsonWithUniqueFieldNames(results.data);
                    associationAllotmentLocations = Object.keys(associationAllotmentData);
                    setSelectContent();
                }
            });

            function create3DjsonWithUniqueFieldNames(jsonData) {
                var threeDjsonArray = [];
                var headerRow = jsonData[0];
                var threeDjsonArray = {};
                for (var row = 1; row < jsonData.length - 1; row++) {
                    var fieldName = jsonData[row][0];
                    var fieldElement = {};
                    for (var column = 1; column < jsonData[row].length; column++) {
                        var rowName = jsonData[0][column];
                        var fieldValue = jsonData[row][column];
                        fieldElement[rowName] = fieldValue;
                    }
                    threeDjsonArray[fieldName] = fieldElement;
                }

                return threeDjsonArray;
            }

            function setSelectContent() {
                for (var k = 0; k < associationAllotmentLocations.length; k++) {

                    var individualItem = {
                        id: associationAllotmentLocations[k],
                        title: associationAllotmentLocations[k],
                    };
                    items.push(individualItem);
                };

                // Populates the selection list.
                obj.set('items', items);

                setTimeout(() => {
                    obj.set('loaded', true);
                });

            }

        });
    }.on('didInsertElement'),
    mapStyles: [{
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#0c0b0b"
    }]
  }, {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{
            "color": "#f2f2f2"
    }]
  }, {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
    }]
  }, {
        "featureType": "road",
        "elementType": "all",
        "stylers": [{
            "saturation": -100
    }, {
            "lightness": 45
    }]
  }, {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#090909"
    }]
  }, {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [{
            "visibility": "simplified"
    }]
  }, {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
    }]
  }, {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
    }]
  }, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
            "color": "#d4e4eb"
    }, {
            "visibility": "on"
    }]
  }, {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [{
            "visibility": "on"
    }, {
            "color": "#fef7f7"
    }]
  }, {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#9b7f7f"
    }]
  }, {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#fef7f7"
    }]
  }]

});