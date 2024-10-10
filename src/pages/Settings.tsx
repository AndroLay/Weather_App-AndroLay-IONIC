import { 
  IonBackButton, 
  IonButton, 
  IonButtons, 
  IonCol, 
  IonContent, 
  IonFooter, 
  IonGrid, 
  IonHeader, 
  IonIcon, 
  IonInput, 
  IonItem, 
  IonList, 
  IonPage, 
  IonRow, 
  IonSelect, 
  IonSelectOption, 
  IonText, 
  IonTitle, 
  IonToggle, 
  IonToolbar 
} from '@ionic/react';
import { useContext, useState } from 'react';
import { AppConfig } from '../SettingContext';
import { checkmark, create, refresh, warning } from "ionicons/icons";

const Settings: React.FC = () => {
  const { setting, setSettings } = useContext(AppConfig);
  const [isApiKeyEditMode, setApiKeyEditMode] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonGrid>
          {/* Other settings components here */}

          {/* Language Select */}
          <IonRow>
            <IonSelect
              label="Language"
              className="ion-margin-top ion-margin-bottom"
              value={setting?.language}
              onIonChange={e =>
                setSettings({
                  ...setting,
                  language: e.target.value
                })
              }
              fill="solid"
            >
              <IonSelectOption value="en">en</IonSelectOption>
              <IonSelectOption value="id">id</IonSelectOption>
            </IonSelect>
          </IonRow>

          {/* Metric Select */}
          <IonRow>
            <IonSelect
              label="Metric"
              className="ion-margin-top ion-margin-bottom"
              value={setting?.metric}
              onIonChange={e =>
                setSettings({
                  ...setting,
                  metric: e.target.value
                })
              }
              fill="solid"
            >
              <IonSelectOption value="standard">Kelvin</IonSelectOption>
              <IonSelectOption value="metric">Celsius</IonSelectOption>
              <IonSelectOption value="imperial">Fahrenheit</IonSelectOption>
            </IonSelect>
          </IonRow>

          {/* Auto-refetch Toggle */}
          <IonRow>
            <IonCol>
              <IonItem>
                <IonToggle
                  justify="space-between"
                  labelPlacement="start"
                  checked={setting?.user?.auto_refetch}
                  onIonChange={e =>
                    setSettings({
                      ...setting,
                      user: {
                        auto_refetch: e.target.checked
                      }
                    })
                  }
                >
                  Auto-refetch
                </IonToggle>
              </IonItem>

              <IonItem>
                <IonInput
                  type="number"
                  label="Fetch Interval"
                  disabled={!setting?.user?.auto_refetch}
                  onIonChange={e =>
                    setSettings({
                      ...setting,
                      user: {
                        auto_refetch: setting?.user?.auto_refetch,
                        fetch_interval: e.target.value ?? 300000
                      }
                    })
                  }
                  value={setting?.user?.fetch_interval}
                  className="ion-text-end"
                  min={10000}
                />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      {/* Footer with developer info */}
      <IonFooter>
        <IonToolbar>
          <IonTitle className="ion-text-center ion-text-capitalize">Dikembangkan oleh: Andro Lay</IonTitle>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Settings;
