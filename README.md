# HackKstate24
Project repo for hack kstate 2024

storm warn 

this app will alert users if they are inside of a storm warning area and guide them to a safehouse or safe building in the area.

nws weather apis:
https://www.weather.gov/documentation/services-web-api
active alerts
https://api.weather.gov/alerts/active?area=OK

map apis?:
https://wiki.openstreetmap.org/wiki/Points_of_interest


install expo cli

npm i -g expo-cli

start: npx expo start

React native routing
https://www.npmjs.com/package/react-native-maps-directions

schools, governemnt buildings, hospital


For our project, we devolped a mobile app that will alert you if you are in a severe weather warning
zone, and then give you directions to the nearest public safehouse. This would be used when traveling
or in an area that you are not familiar with.

We used the national weather service to get the severe weather warning zones. Then we compare those zones with your location and if you are in a severe weather warning zone, it will alert you and give you directions to the nearest safehouse, which we got the locations from Google map places.

We used react native to devolp this app. Neither of us were familar with it and learned the basics over the weekend. 