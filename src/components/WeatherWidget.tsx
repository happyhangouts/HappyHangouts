import React, { useState, useEffect } from "react";
import { Sun, CloudRain, CloudSun, Wind, Thermometer, Droplets, Coffee, MapPin, ChevronRight, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { audio } from "../utils/audio";
import { getSubcategorySpots, filterSpotsByCity } from "../utils/spots";

type City = "Delhi" | "Gurgaon" | "Noida";

interface WeatherData {
  temp: number;
  condition: string;
  humidity: string;
  wind: string;
  uvIndex: string;
  type: "outdoor" | "indoor" | "both";
  description: string;
  recommendation: string;
  spots: string[];
}

const citySpots: Record<City, { indoor: string[]; outdoor: string[] }> = {
  Delhi: {
    indoor: ["Blue Tokai in Champa Gali", "Cha Bar in Connaught Place", "National Gallery Cafe"],
    outdoor: ["Sunder Nursery Gardens", "Lodhi Art District Walk", "Deer Park in Hauz Khas"]
  },
  Gurgaon: {
    indoor: ["Cozy Cafe inside Sector 15", "Hamoni Golf Cafe", "The Piano Man CyberHub"],
    outdoor: ["Aravali Hills Scenic Road", "CyberHub Open Plaza", "Leisure Valley Park"]
  },
  Noida: {
    indoor: ["The Reader's Cafe Sector 18", "Sava Cozy Cafe in 104", "Roastery Coffee House"],
    outdoor: ["Okhla Bird Sanctuary Scenic Trail", "Noida Botanical Gardens", "Sector 137 Central Park"]
  }
};

const getLiveWeatherConfig = (city: City, temp: number, code: number, humidity: number, windSpeed: number): WeatherData => {
  let condition = "Pleasant Skies";
  let type: "outdoor" | "indoor" | "both" = "both";
  let recommendation = "Perfect Time to Meet";
  let description = "";

  const isRainy = (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
  const isStormy = code >= 95;
  const isHot = temp >= 32;
  const isCold = temp <= 18;

  if (isStormy) {
    condition = "Thunderstorm Warning";
    type = "indoor";
    recommendation = "⚡ Indoor Companion Gathering Recommended";
    description = `An active storm code is reported in NCR right now. Keep it dry—gather with companions for hot chai, samosas, or inside virtual matching rooms!`;
  } else if (isRainy) {
    condition = "Monsoon Drizzle";
    type = "indoor";
    recommendation = "☔ Cozy Monsoon Cafe Vibe Recommended";
    description = `A refreshing monsoon drizzle (${temp}°C) is gracing ${city} right now. Excellent excuse to claim a window seat, grab a warm beverage, and share some quiet conversation.`;
  } else if (isHot) {
    condition = "Sunny & Warm";
    type = "indoor";
    recommendation = "☕ Chilled Indoor Meetup Recommended";
    description = `A radiant ${city} sun is out with temperatures hitting ${temp}°C. We recommend stepping out of the direct heat into one of our curated local cafes with companion checking.`;
  } else if (isCold) {
    condition = "Cozy Winter Vibe";
    type = "both";
    recommendation = "❄️ Steaming Hot Coffee or Tea Session";
    description = `A crisp winter chill is sweeping ${city} (${temp}°C). The absolute best excuse to coordinate with a companion over steaming tandoori chai or a warm, hot coffee walk.`;
  } else {
    condition = "Pleasant & Clear";
    type = "outdoor";
    recommendation = "🌿 Prime Outdoor Adventure Weather";
    description = `Absolute stellar outdoor weather in ${city} right now (${temp}°C)! Crisp breeze and balanced climate—perfect for badminton rallies, garden walks, or scenic drives.`;
  }

  const spotsList = type === "indoor" ? citySpots[city].indoor : citySpots[city].outdoor;

  return {
    temp,
    condition,
    humidity: `${humidity}%`,
    wind: `${windSpeed} km/h`,
    uvIndex: isHot ? "High (7)" : "Moderate (3)",
    type,
    description,
    recommendation,
    spots: spotsList
  };
};

const initialWeatherDatabase: Record<City, WeatherData> = {
  Delhi: {
    temp: 34,
    condition: "Sunny & Warm",
    humidity: "48%",
    wind: "12 km/h",
    uvIndex: "High (7)",
    type: "indoor",
    description: "It is quite warm outside right now! Afternoon rays are intense, making it the perfect time to tuck into a chilled, air-conditioned cafe for meaningful dialogue.",
    recommendation: "☕ Cozy Indoor Cafe Session Recommended",
    spots: citySpots["Delhi"].indoor
  },
  Gurgaon: {
    temp: 28,
    condition: "Cool Overcast",
    humidity: "40%",
    wind: "16 km/h",
    uvIndex: "Low (2)",
    type: "outdoor",
    description: "Incredible breezy overcast sky over Millennium City! Absolute prime weather for an outdoor nature walk, sunset stroll, or Aravali highway cruise.",
    recommendation: "🌿 Scenic Outdoor Nature Walk Recommended",
    spots: citySpots["Gurgaon"].outdoor
  },
  Noida: {
    temp: 24,
    condition: "Cozy Monsoon Drizzle",
    humidity: "86%",
    wind: "9 km/h",
    uvIndex: "Very Low (1)",
    type: "indoor",
    description: "A soothing rainy atmosphere has swept NCR. Grab an umbrella and find a window-side corner at a lovely cafe to read or share a warm cup of masala tea.",
    recommendation: "☕ Monsoon Cafe & Tea Session Recommended",
    spots: citySpots["Noida"].indoor
  }
};

interface WeatherWidgetProps {
  selectedSubcategory?: string;
}

export default function WeatherWidget({ selectedSubcategory }: WeatherWidgetProps) {
  const [activeCity, setActiveCity] = useState<City>("Delhi");
  const [weatherData, setWeatherData] = useState<Record<City, WeatherData>>(initialWeatherDatabase);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const cityCoordinates: Record<City, { lat: number; lon: number }> = {
    Delhi: { lat: 28.6139, lon: 77.209 },
    Gurgaon: { lat: 28.4595, lon: 77.0266 },
    Noida: { lat: 28.5355, lon: 77.391 }
  };

  const fetchAllWeather = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const updatedData = { ...weatherData };
      
      const promises = (["Delhi", "Gurgaon", "Noida"] as City[]).map(async (city) => {
        const { lat, lon } = cityCoordinates[city];
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
        );
        if (!res.ok) throw new Error(`Weather fetch failed for ${city}`);
        const json = await res.json();
        
        const temp = Math.round(json.current.temperature_2m);
        const code = json.current.weather_code;
        const humidity = json.current.relative_humidity_2m;
        const windSpeed = Math.round(json.current.wind_speed_10m);
        
        updatedData[city] = getLiveWeatherConfig(city, temp, code, humidity, windSpeed);
      });

      await Promise.all(promises);
      setWeatherData(updatedData);
      setIsLive(true);
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastUpdated(timeString);
    } catch (err) {
      console.warn("Failed to fetch live real-time NCR weather, using preloaded realistic cache.", err);
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllWeather();
    // Auto-refresh weather every 5 minutes
    const interval = setInterval(() => {
      fetchAllWeather(true);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCityChange = (city: City) => {
    audio.playClick();
    setActiveCity(city);
  };

  const handleManualRefresh = () => {
    audio.playPageTransition();
    fetchAllWeather();
  };

  const data = weatherData[activeCity];

  // Dynamic spots filtering based on chosen Hobby/Goal (subcategory)
  const rawSubcategorySpots = selectedSubcategory ? getSubcategorySpots(selectedSubcategory) : [];
  const subcategorySpotsForCity = selectedSubcategory ? filterSpotsByCity(rawSubcategorySpots, activeCity) : [];
  
  // Use chosen subcategory spots if available, else fallback to standard citySpots
  const finalSpotsToShow = subcategorySpotsForCity.length > 0
    ? subcategorySpotsForCity
    : (rawSubcategorySpots.length > 0 ? rawSubcategorySpots : data.spots);

  // Dynamic recommendation text incorporating the chosen Hobby/Goal (subcategory)
  const displayRecommendation = selectedSubcategory
    ? `${data.type === "outdoor" ? "🌿 Active Outdoor" : "☕ Cozy Indoor"} "${selectedSubcategory}" Vibe`
    : data.recommendation;

  const displayDescription = selectedSubcategory
    ? `The current ${activeCity} climate (${data.temp}°C, ${data.condition}) is perfect for your goal: "${selectedSubcategory}"! We highly recommend meeting up at a vetted local venue.`
    : data.description;

  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes("sunny") || cond.includes("clear") || cond.includes("warm") || cond.includes("hot")) {
      return <Sun className="w-10 h-10 text-amber-500 animate-spin-slow" />;
    } else if (cond.includes("monsoon") || cond.includes("drizzle") || cond.includes("rain") || cond.includes("shower")) {
      return <CloudRain className="w-10 h-10 text-blue-400 animate-bounce" />;
    } else {
      return <CloudSun className="w-10 h-10 text-sky-400 animate-pulse" />;
    }
  };

  return (
    <div id="weather-outlook-widget" className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-md transition-all duration-300 hover:shadow-lg relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-50 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-50">
        <div>
          <span className="text-[9px] uppercase tracking-widest font-extrabold text-blue-600 block mb-1 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-emerald-500" : "bg-amber-500"} animate-pulse`} />
            {isLive ? `Live Weather Sync (${lastUpdated})` : "NCR Weather Planner"}
          </span>
          <h4 className="text-sm font-bold text-slate-800 font-display flex items-center gap-1.5">
            Live Vibe Forecast
            {loading && <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />}
          </h4>
        </div>

        {/* City Tab buttons & manual sync */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex bg-slate-100/80 p-1 rounded-xl">
            {(["Delhi", "Gurgaon", "Noida"] as const).map((city) => (
              <button
                key={city}
                onClick={() => handleCityChange(city)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                  activeCity === city
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          <button
            onClick={handleManualRefresh}
            title="Force refresh weather data"
            className="p-1.5 bg-slate-100/80 hover:bg-slate-200/80 rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Stats Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center mb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100/50">
            {getWeatherIcon(data.condition)}
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-display">{data.temp}</span>
              <span className="text-lg font-bold text-slate-500">°C</span>
            </div>
            <p className="text-[11px] font-bold text-slate-700">{data.condition}</p>
          </div>
        </div>

        {/* Micro-metrics Grid */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50/70 p-3 rounded-2xl border border-slate-100/50">
          <div className="text-center">
            <span className="text-[8px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Humidity</span>
            <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-slate-700">
              <Droplets className="w-3 h-3 text-sky-500" />
              {data.humidity}
            </div>
          </div>
          <div className="text-center border-x border-slate-200/50">
            <span className="text-[8px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Wind</span>
            <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-slate-700">
              <Wind className="w-3 h-3 text-slate-400" />
              {data.wind}
            </div>
          </div>
          <div className="text-center">
            <span className="text-[8px] uppercase tracking-widest font-bold text-slate-400 block mb-1">UV Index</span>
            <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-slate-700">
              <Thermometer className="w-3 h-3 text-amber-500" />
              {data.uvIndex.split(" ")[0]}
            </div>
          </div>
        </div>
      </div>

      {/* OUTDOOR vs INDOOR RECOMMENDATION BADGE */}
      <div className={`p-4 rounded-2xl border mb-4 flex items-start gap-3 transition-all duration-300 ${
        data.type === "outdoor"
          ? "bg-emerald-50/50 border-emerald-100/60 text-emerald-800"
          : "bg-blue-50/50 border-blue-100/60 text-blue-800"
      }`}>
        <div className={`p-2 rounded-xl shrink-0 ${
          data.type === "outdoor" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"
        }`}>
          {data.type === "outdoor" ? <Sparkles className="w-4 h-4 animate-pulse" /> : <Coffee className="w-4 h-4 animate-bounce" />}
        </div>
        <div className="flex-1">
          <h5 className="font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
            {displayRecommendation}
          </h5>
          <p className="text-[11px] leading-relaxed opacity-90 font-light">
            {displayDescription}
          </p>
        </div>
      </div>

      {/* Suggested spots matching weather conditions */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
        <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400 block mb-2.5 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-red-500" />
          {selectedSubcategory ? `Certified spots for "${selectedSubcategory}" in ${activeCity}:` : `Recommended Spots for ${activeCity} Vibe:`}
        </span>
        <div className="flex flex-col gap-1.5">
          {finalSpotsToShow.map((spot, i) => (
            <div key={i} className="flex items-center justify-between text-[11px] text-slate-700 py-1 border-b border-slate-200/30 last:border-0">
              <span className="font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {spot}
              </span>
              <span className="text-[8px] uppercase tracking-widest font-bold text-blue-500 flex items-center gap-0.5">
                Go Visit <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
