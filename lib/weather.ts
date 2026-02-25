import { tool } from "ai";
import { z } from "zod";

// Zettersfeld / Steinermandl – Startplatz (2220 m)
const LAUNCH = { lat: 46.875198, lon: 12.788446, name: "Startplatz Zettersfeld" };
// Touch Heaven – Landeplatz (~670 m, Tal bei Lienz)
const LANDING = { lat: 46.8289, lon: 12.769, name: "Landeplatz Touch Heaven" };

const TIMEZONE = "Europe/Vienna";

const CURRENT_PARAMS = [
  "temperature_2m",
  "apparent_temperature",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
  "precipitation",
  "rain",
  "showers",
  "snowfall",
  "cloud_cover",
].join(",");

const HOURLY_PARAMS = [
  "temperature_2m",
  "temperature_80m",
  "temperature_120m",
  "temperature_180m",
  "rain",
  "showers",
  "snowfall",
  "cloud_cover",
  "visibility",
  "wind_speed_10m",
  "wind_speed_80m",
  "wind_speed_120m",
  "wind_speed_180m",
  "wind_direction_10m",
  "wind_direction_80m",
  "wind_direction_120m",
  "wind_direction_180m",
  "wind_gusts_10m",
].join(",");

const DAILY_PARAMS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "apparent_temperature_max",
  "apparent_temperature_min",
].join(",");

interface LocationWeather {
  name: string;
  elevation: number;
  current: Record<string, unknown>;
  hourly: Record<string, unknown>;
  daily: Record<string, unknown>;
}

async function fetchLocation(
  lat: number,
  lon: number,
  name: string,
  forecastDays: number,
): Promise<LocationWeather> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", CURRENT_PARAMS);
  url.searchParams.set("hourly", HOURLY_PARAMS);
  url.searchParams.set("daily", DAILY_PARAMS);
  url.searchParams.set("timezone", TIMEZONE);
  url.searchParams.set("forecast_days", String(forecastDays));

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const data = await res.json();

  return {
    name,
    elevation: data.elevation,
    current: data.current,
    hourly: data.hourly,
    daily: data.daily,
  };
}

function windDirectionLabel(deg: number): string {
  const dirs = ["N", "NO", "O", "SO", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function assessConditions(launch: LocationWeather, landing: LocationWeather) {
  const lc = launch.current as Record<string, number>;
  const tc = landing.current as Record<string, number>;

  const warnings: string[] = [];
  let flyable = "gut";

  // Nordföhn: Druckgradient Berg → Tal (approximiert über Temperatur-Inversion + Windrichtung)
  // Open-Meteo liefert kein surface_pressure, daher nutzen wir Wind + Richtung als Föhn-Indikator
  const launchWindDir = lc.wind_direction_10m ?? 0;
  const launchWindSpeed = lc.wind_speed_10m ?? 0;
  const isNorthWind = launchWindDir >= 315 || launchWindDir <= 45;
  if (isNorthWind && launchWindSpeed > 25) {
    warnings.push("Starker Nordwind am Startplatz – Nordföhn-Verdacht, Flug sehr unwahrscheinlich");
    flyable = "nicht fliegbar";
  } else if (isNorthWind && launchWindSpeed > 15) {
    warnings.push("Nordwind am Startplatz – mögliche Föhn-Tendenz");
    if (flyable === "gut") flyable = "unsicher";
  }

  // Böen
  const gusts = lc.wind_gusts_10m ?? 0;
  if (gusts > 40) {
    warnings.push(`Böen ${gusts} km/h am Startplatz – nicht fliegbar`);
    flyable = "nicht fliegbar";
  } else if (gusts > 30) {
    warnings.push(`Böen ${gusts} km/h am Startplatz – grenzwertig`);
    if (flyable !== "nicht fliegbar") flyable = "unsicher";
  }

  // Wind Startplatz
  if (launchWindSpeed > 30) {
    warnings.push(`Wind ${launchWindSpeed} km/h am Startplatz – nicht fliegbar`);
    flyable = "nicht fliegbar";
  } else if (launchWindSpeed > 20) {
    warnings.push(`Wind ${launchWindSpeed} km/h am Startplatz – eingeschränkt`);
    if (flyable !== "nicht fliegbar") flyable = "unsicher";
  }

  // Starker Talwind
  const talWind = tc.wind_speed_10m ?? 0;
  if (talWind > 25) {
    warnings.push(`Starker Talwind ${talWind} km/h – ungünstig für Landung`);
    if (flyable !== "nicht fliegbar") flyable = "unsicher";
  }

  // Niederschlag
  const precip = lc.precipitation ?? 0;
  const rain = lc.rain ?? 0;
  const snow = lc.snowfall ?? 0;
  if (precip > 0 || rain > 0 || snow > 0) {
    warnings.push("Niederschlag – kein Flug möglich");
    flyable = "nicht fliegbar";
  }

  // Wolken / Sicht
  const clouds = lc.cloud_cover ?? 0;
  if (clouds > 90) {
    warnings.push("Geschlossene Wolkendecke – Nebel/tiefe Wolken wahrscheinlich, Flug fraglich");
    if (flyable !== "nicht fliegbar") flyable = "unsicher";
  }

  return { flyable, warnings };
}

export const weatherTool = tool({
  description:
    "Ruft Live-Wetterdaten für das Paragliding-Fluggebiet Lienzer Dolomiten ab (Startplatz Zettersfeld 2220m + Landeplatz Touch Heaven Tal). Nutze dieses Tool wenn der Gast nach Wetter, Flugbedingungen oder Terminen fragt.",
  inputSchema: z.object({
    type: z
      .enum(["current", "forecast"])
      .default("current")
      .describe("current = aktuelle Bedingungen, forecast = nächste 3 Tage"),
  }),
  execute: async ({ type }) => {
    try {
      const days = type === "forecast" ? 3 : 1;
      const [launch, landing] = await Promise.all([
        fetchLocation(LAUNCH.lat, LAUNCH.lon, LAUNCH.name, days),
        fetchLocation(LANDING.lat, LANDING.lon, LANDING.name, days),
      ]);

      const assessment = assessConditions(launch, landing);

      const launchCurrent = launch.current as Record<string, number>;
      const landingCurrent = landing.current as Record<string, number>;

      const summary = {
        zeitpunkt: (launch.current as Record<string, string>).time,
        startplatz: {
          name: launch.name,
          höhe: `${launch.elevation}m`,
          temperatur: `${launchCurrent.temperature_2m}°C (gefühlt ${launchCurrent.apparent_temperature}°C)`,
          wind: `${launchCurrent.wind_speed_10m} km/h aus ${windDirectionLabel(launchCurrent.wind_direction_10m)}`,
          böen: `${launchCurrent.wind_gusts_10m} km/h`,
          wolken: `${launchCurrent.cloud_cover}%`,
          niederschlag: `${launchCurrent.precipitation}mm`,
        },
        landeplatz: {
          name: landing.name,
          höhe: `${landing.elevation}m`,
          temperatur: `${landingCurrent.temperature_2m}°C (gefühlt ${landingCurrent.apparent_temperature}°C)`,
          wind: `${landingCurrent.wind_speed_10m} km/h aus ${windDirectionLabel(landingCurrent.wind_direction_10m)}`,
          böen: `${landingCurrent.wind_gusts_10m} km/h`,
        },
        flugbedingungen: assessment.flyable,
        hinweise: assessment.warnings.length > 0 ? assessment.warnings : ["Keine besonderen Warnungen"],
      };

      if (type === "forecast") {
        return {
          ...summary,
          vorhersage_startplatz: {
            daily: launch.daily,
            hourly_wind: {
              time: (launch.hourly as Record<string, unknown[]>).time,
              wind_speed_10m: (launch.hourly as Record<string, unknown[]>).wind_speed_10m,
              wind_gusts_10m: (launch.hourly as Record<string, unknown[]>).wind_gusts_10m,
              wind_direction_10m: (launch.hourly as Record<string, unknown[]>).wind_direction_10m,
              cloud_cover: (launch.hourly as Record<string, unknown[]>).cloud_cover,
              visibility: (launch.hourly as Record<string, unknown[]>).visibility,
              rain: (launch.hourly as Record<string, unknown[]>).rain,
            },
          },
          vorhersage_landeplatz: {
            daily: landing.daily,
          },
        };
      }

      return summary;
    } catch (e) {
      console.error("Weather fetch error:", e);
      return {
        error: "Wetterdaten konnten leider nicht abgerufen werden. Bitte den Gast auf den WhatsApp-Wetterkanal verweisen.",
      };
    }
  },
});
