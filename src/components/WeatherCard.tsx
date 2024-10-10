import {  
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle, 
    IonIcon, 
    IonImg, 
    IonRow, 
    IonText
} from "@ionic/react";
import { warning } from "ionicons/icons";
import "./WeatherCard.css";

export function WeatherCardError({message}: {message: string}){
    return (
        <IonCard color="danger" className="error_card">
            <IonCardContent>
                <IonRow className="ion-align-items-center">
                    <IonIcon
                        icon={warning} 
                        className="ion-margin-right" 
                        size="large"/>
                    <IonText className="ion-padding-left">
                        <h2>{message}</h2>
                    </IonText>
                </IonRow>
            </IonCardContent>
        </IonCard>
    )
}

export function WeatherCard({temp, description, imageUrl, city, units, name, forecast_date}: 
    {
        temp: number | null, 
        description: string | null, 
        imageUrl: string | null, 
        city: string | null,
        units: string,
        name: string | null,
        forecast_date: number | null
    }) {
        const date_string = new Date((forecast_date || 0) * 1000);
        return (
            <div className="weather_card_wrapper">
                <IonCard className="weather_card_inner_card ion-margin-top" color="light">
                    {city && (
                        <IonCardHeader>
                        <IonCardTitle 
                            className="ion-text-capitalize ion-text-center" 
                            style={{ color: '#000000', fontWeight: 'bold', fontSize: '24px' }}
                        >
                            {city}
                        </IonCardTitle>


                            <IonCardSubtitle className="ion-text-center subtitle">
                                <p>
                                    {date_string.getHours().toString().padStart(2, "0")}:{date_string.getMinutes().toString().padEnd(2, "0")}
                                </p>
                                <p>
                                    {date_string?.getDate()}/{date_string.getMonth() + 1}/{date_string.getFullYear()}
                                </p>
                            </IonCardSubtitle>
                        </IonCardHeader>
                    )}
                    <IonRow className="ion-justify-content-center">
                        {imageUrl && (
                            <IonImg
                                src={`https://openweathermap.org/img/wn/${imageUrl}@2x.png`}
                                className="image_container"
                            />
                        )}
                    </IonRow>
                    <IonCardContent className="ion-text-center">
                        <IonText>
                            <h1 className="city_name">{name}</h1>
                        </IonText>
                        <IonText>
                            <h3 className="ion-text-capitalize weather_description">{description}</h3>
                        </IonText>
                        {temp && (
                            <IonText>
                                <p className="temperature">{temp} {units === "standard" ? "K" : units === "metric" ? "°C" : "°F"}</p>
                            </IonText>
                        )}
                    </IonCardContent>
                </IonCard>
            </div>
        );
    }
