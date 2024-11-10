import React, { createContext, useEffect, useContext, useState } from "react";
import axios from "axios";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { Audio } from "expo-av";

/*
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
  console.log('Background task fired!');
  const { sound } = await Audio.Sound.createAsync(
    require('../assets/sounds/audio.mp3')
  );

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Warning",
      body: "The NWS has issued a warning for your area",
      sound: "default", // Prevent default sound from playing
    },
    trigger: null, // Immediately trigger the notification
  });

  // Play the custom sound
  await sound.playAsync();
});
*/
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface WeatherWarning {
  id: string;
  title: string;
  description: string;
  area: string;
  severity: string;
  coordinates?: number[][]; // Make coordinates optional
}

interface WeatherContextType {
  weatherWarnings: WeatherWarning[];
  fetchWeatherWarnings: () => void;
  area: string;
  setArea: (area: string) => void;
  origin: Origin;
  setOrigin: (origin: Origin) => void;
  destination: Origin;
  setDestination: (destination: Origin) => void;
  places: Place[];
  setPlaces: (places: Place[]) => void;
  errorMsg: string | null;
  setErrorMsg: (errorMsg: string | null) => void;
  setDemoPolygon: (demoPolygons: number[][]) => void;
  watching: boolean;
  setWatching: (watching: boolean) => void;
}

interface Place {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
  vicinity: string;
}

interface Origin {
  latitude: number | null;
  longitude: number | null;
}
const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};

interface WeatherProviderProps {
  children: React.ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({
  children,
}) => {
  const [weatherWarnings, setWeatherWarnings] = useState<WeatherWarning[]>([]);
  const [area, setArea] = useState<string>("OK");
  const [warningPolygons, setWarningPolygons] = useState<number[][]>([]);
  const [origin, setOrigin] = useState<Origin>({
    latitude: null,
    longitude: null,
  });

  const [destination, setDestination] = useState<Origin>({
    latitude: null,
    longitude: null,
  });
  const [places, setPlaces] = useState<Place[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [demoPolygon, setDemoPolygon] = useState<number[][]>([]);
  const [watching, setWatching] = useState<boolean>(false);
  const [warning, setWarning] = useState<boolean>(false);

  useEffect(() => {
    if(watching){
      console.log('watching');
      console.log('warning test',warning)
      if(warning){
        console.log('warning');
        setTimeout(() => {
        sendLocalNotification();
      }, 5000);
      }
    }
  }, [watching, warning]);
  useEffect(() => {
    console.log("Demo polygon:", demoPolygon);
    fetchWeatherWarnings();
  }, [demoPolygon]);
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access notifications was denied");
      }
    };

    requestPermissions();
  }, []);

  const fetchWeatherWarnings = async () => {
    console.log("looking");
    try {
      const response = await fetch(
        `https://api.weather.gov/alerts/active/area/${area}`
      );
      const data = await response.json();
      // console.log(data.features);

      // Map the response data to the WeatherWarning interface
      const warnings = data.features.map((feature: any) => {
        const coordinates = feature.geometry
          ? feature.geometry.coordinates
          : undefined;
        //console.log(`Coordinates for ${feature.id}:`, coordinates); // Log coordinates for testing

        return {
          id: feature.id,
          title: feature.properties.headline,
          description: feature.properties.description,
          area: feature.properties.areaDesc,
          severity: feature.properties.severity,
          coordinates,
        };
      });

      // console.log(warnings);
      setWeatherWarnings(warnings);
      

      // Extract and set warning polygons for severe warnings
      let severePolygons = warnings
        .filter(
          (warning: WeatherWarning) =>
            warning.severity === "Severe" && warning.coordinates
        )
        .map((warning: WeatherWarning) => warning.coordinates as number[][]); 
      setWarningPolygons(severePolygons);

      /* Print each element of warningPolygons separately
      severePolygons.forEach((polygon: number[][], index: number) => {
        console.log(`Polygon ${index + 1}:`);
        polygon.forEach((coordinatePair: number[]) => {
          console.log(
            `Latitude: ${coordinatePair[1]}, Longitude: ${coordinatePair[0]}`
          );
        });
      });
*/

const demoPolygons = demoPolygon;
severePolygons = severePolygons.concat([[demoPolygons]]);
console.log('new polygons', severePolygons);
      // Check if origin is within any of the polygons
      if (origin.latitude !== null && origin.longitude !== null) {
        const originPoint: [number, number] = [
          origin.longitude,
          origin.latitude,
        ];
        const isInPolygon: boolean = severePolygons.some(
          (polygon: number[][][]) => isPointInPolygon(originPoint, polygon)
        );
        console.log(`Origin is within polygon bounds: ${isInPolygon}`);
      }
    } catch (error) {
      console.error("Error fetching weather warnings:", error);
    }
  };

  const isPointInPolygon = (point: number[], polygons: number[][][]): boolean => {
    console.log('given polygon',polygons)
  let x = point[0], y = point[1];
  console.log('points: ' + point[0] + ' ' + point[1]);
  let inside = false;

  // Iterate through each polygon
  for (const polygon of polygons) {
    console.log('checking polygon', polygon);
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      let xi = polygon[i][0], yi = polygon[i][1];
      let xj = polygon[j][0], yj = polygon[j][1];
      //console.log('xi: ' + xi + ' yi: ' + yi + ' xj: ' + xj + ' yj: ' + yj, x, y);

      let intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    if (inside)
      setWarning(true);
       break; // If inside one polygon, no need to check others
  }

  console.log(inside);
  return inside;
};


  const sendLocalNotification = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/audio.mp3')
    );
  
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Warning",
        body: "The NWS has issued a warning for your area",
        sound: '../assets/sounds/audio.mp3', // Use the local path to the sound file
      },
      trigger: null, // Immediately trigger the notification
    });
  
    // Play the sound
    await sound.playAsync();
  }

  useEffect(() => {
    const fetchPlaces = async () => {
      if (origin.latitude && origin.longitude) {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${origin.latitude},${origin.longitude}&radius=10000&type=local_government_office&key=${GOOGLE_API_KEY}`
          );
          setPlaces(response.data.results);
        } catch (error) {
          console.error("Error fetching places:", error);
        }
      }
    };

    fetchPlaces();
  }, [origin]);
  useEffect(() => {
    console.log("Places:", places);
    // Fetch weather warnings initially
    fetchWeatherWarnings();

    // Set up an interval to fetch weather warnings every minute
    const intervalId = setInterval(() => {
      fetchWeatherWarnings();
    }, 60000); // 60000 milliseconds = 1 minute

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [area]);
  /*
  useEffect(() => {
    const registerBackgroundTask = async () => {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
        minimumInterval: 5, // 1 minute
        stopOnTerminate: false,
        startOnBoot: true,
      });
    };

    registerBackgroundTask();
  }, []);
  */
  return (
    <WeatherContext.Provider
      value={{
        weatherWarnings,
        fetchWeatherWarnings,
        area,
        setArea,
        origin,
        setOrigin,
        destination,
        setDestination,
        places,
        setPlaces,
        setErrorMsg,
        errorMsg,
        setDemoPolygon,
        watching,
        setWatching,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
