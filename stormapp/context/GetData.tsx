import React, { createContext, useEffect, useContext, useState } from "react";
import axios from "axios";
import * as Notifications from 'expo-notifications';
import { Audio } from "expo-av";

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
  coordinates?: number[][][]; // Make coordinates optional
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
    sendLocalNotification: () => void;
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
  const [warningPolygons, setWarningPolygons] = useState<number[][][][]>([]);
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

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access notifications was denied');
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

      warnings.forEach((warning: WeatherWarning) =>
        console.log(warning.severity)
      );
      setWeatherWarnings(warnings);

      // Extract and set warning polygons for severe warnings
      const severePolygons: number[][][][] = warnings
        .filter(
          (warning: WeatherWarning) =>
            warning.severity === "Severe" && warning.coordinates
        )
        .map((warning: WeatherWarning) => warning.coordinates as number[][][]);
      setWarningPolygons(severePolygons);
      severePolygons.forEach((element) => {
        console.log(element);
      });
    } catch (error) {
      console.error("Error fetching weather warnings:", error);
    }
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
    sendLocalNotification();
  }, [warningPolygons])
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
        sendLocalNotification
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
