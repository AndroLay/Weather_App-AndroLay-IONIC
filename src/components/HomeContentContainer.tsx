import { useContext, useEffect, useState } from "react"
import { WeatherCard, WeatherCardError } from "./WeatherCard"
import { AppConfig } from "../SettingContext"
import { IonCol, IonGrid, IonItem, IonList, IonRow, IonSearchbar, IonText } from "@ionic/react"

import "./HomeContentContainer.css";

// TODO: set api as secret
const apiInfo = {
    'apiKey': 'd0803559f03dafe4ee9b2515f4dc8c21',
}

type SettingType = {
    'language': string,
    'apiKey': string,
    'metric': string,
    'user': {
        'auto_refetch': boolean,
        'fetch_interval': number
    }
}

// TODO: de-coupling this function from UI file
async function getCityPosition({city, setting}: {city: string | null, setting: SettingType}){
    // retrieve data from Geocoder API
    if (city !== null && city !== undefined){
        let response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${setting?.apiKey}`) || []
        const json_response = await response.json()
        return json_response
    }
    return [];
}

async function getCurrentWeather({latitude, longitude, setting}: 
    {latitude: number | null, longitude: number | null, setting: SettingType}){
    // retrieve data from current weather API
    if (latitude && longitude){
        let response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${setting.apiKey}&units=${setting.metric}&lang=${setting.language}`)
        let json_data = await response.json()
        console.log(json_data)
        return json_data
    }
}

async function getHourlyWeather({latitude, longitude, setting}: 
    {latitude: number | null, longitude: number | null, setting: SettingType}){
    
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${setting.metric}&appid=${setting.apiKey}`)
    let response_json = await response.json()
    return response_json?.list ?? []
}


export default function HomeContentContainer({setting}: {setting: SettingType}){
    const [city, setSelectedCity] = useState<string | null>('manado')
    const [hourlyWeatherApiInfo, setHourlyWeatherApiInfo] = useState<Array<{
        'dt': number, // forecasted time
        'main': {
            'temp': number,
        },
        'weather': Array<{
            'id': number,
            'main': string,
            'description': string,
            'icon' : string | null
        }>
    }>>([])

    const [weatherApiInfo, setWeatherApiInfo] = useState<{
        'city': string | null,
        'latitude': number | null,
        'longitude': number | null,
        'temp': number | null,
        'weather': {
            'id': number | null,
            'main': string | null,
            'description': string | null,
            'icon': string | null
        },
        'forecast_date': number | null

    }>({
        'city': null,
        'latitude': null,
        'longitude': null,
        'temp': null,
        'weather': {
            'id': null,
            'main': null,
            'description': null,
            'icon': null
        },
        'forecast_date': null
    })

    async function dataFetching({city}: {city: string | null}){
        const city_location = await getCityPosition({city: city, setting: setting})
        const weather_info_data = await getCurrentWeather({
            latitude: city_location?.[0]?.lat,
            longitude: city_location?.[0]?.lon,
            setting: setting
        })
        return {
            'city': city_location?.[0]?.name,
            'latitude': city_location?.[0]?.lat,
            'longitude': city_location?.[0]?.lon,
            'temp': weather_info_data?.main?.temp,
            'weather': weather_info_data?.weather?.[0],
            'forecast_date': weather_info_data?.dt
        }
    }

    async function hourlyDataFetching({city}: {city: string | null}){
        const city_location = await getCityPosition({city: city, setting: setting})
        const forecast_data_list = await getHourlyWeather({
            latitude: city_location?.[0]?.lat,
            longitude: city_location?.[0]?.lon,
            setting: setting
        })
        return forecast_data_list
    }

    useEffect(() => {
        console.log(`city selected: ${city}`)
        dataFetching({city: city})
        .then(res => {
            setWeatherApiInfo(res)
        })

        hourlyDataFetching({city: city})
            .then( res => {
                setHourlyWeatherApiInfo(res)
            })
    }, [city, setting])

    useEffect(() => {
        if (
            (weatherApiInfo?.city !== undefined 
                || weatherApiInfo?.city !== null
            ) && setting?.user?.auto_refetch){

            // call every 5 minute
            let data_fetch_interval = setInterval(
                () => {
                    console.info("start to re-fetch data")
                    dataFetching({city: weatherApiInfo?.city})
                        .then(res =>setWeatherApiInfo(res))
                },
            setting?.user?.fetch_interval ?? 300000
            )
            return () => clearInterval(data_fetch_interval)
        }
    })

    useEffect(() => {
        console.log(weatherApiInfo)
    }, [weatherApiInfo])

    return (
        <div>
            <IonSearchbar 
                placeholder="Cari kota disini" 
                onIonInput={
                e => setSelectedCity(e?.target?.value ?? null)
                }
                debounce={500}
                color="dark"
            />
            {/* Dummy Data */}
            { weatherApiInfo?.city &&
                <WeatherCard 
                    temp={weatherApiInfo?.temp} 
                    imageUrl={weatherApiInfo?.weather?.icon}
                    description={weatherApiInfo?.weather?.description} 
                    city={weatherApiInfo?.city} 
                    units={setting.metric}
                    name={weatherApiInfo?.weather?.main}
                    forecast_date={weatherApiInfo?.forecast_date}
                />
            }
            {
                weatherApiInfo?.city === undefined
                && <WeatherCardError 
                        message="Nama tempat tidak ditemukan"
                    />
                    
            }
            <IonGrid>
                {   weatherApiInfo?.city !== undefined &&
                    <IonRow className="ion-justify-content-center ion-align-items-center">
                    <IonCol className="ion-text-center">
                        <IonText color="dark">
                        <h3>PREDIKSI CUACA</h3>
                        </IonText>
                    </IonCol>
                    </IonRow>
                }
                <IonRow className="forecast_hourly_container">
                    {hourlyWeatherApiInfo.map( weather_data => {
                        return (
                            <IonCol key={hourlyWeatherApiInfo.indexOf(weather_data)}>
                                <WeatherCard 
                                    temp={weather_data?.main.temp}
                                    city={weatherApiInfo?.city}
                                    description={weatherApiInfo?.weather?.description}
                                    units={setting?.metric}
                                    name={weather_data?.weather?.[0]?.main}
                                    imageUrl={weather_data?.weather?.[0]?.icon}
                                    forecast_date={weather_data?.dt}
                                />
                            </IonCol>
                        )
                    })}
                </IonRow>
            </IonGrid>
        </div>
    )
}