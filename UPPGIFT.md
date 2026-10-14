# Inlämning 1 React Native

**Kurs:** Applikationsutveckling (APP) SUVNET25
**Arbetsform:** Individuellt
**Utlämnad:** måndag 21 september 2026
**Deadline:** onsdag 7 oktober 2026 20:00
**Presentation:** onsdag 7 oktober 2026
**Kompletteringsdeadline:** onsdag 28 oktober 2026 20:00

---

## Uppgiften

Du ska individuellt skapa en nativ app med hjälp av React Native (RN), Expo och TypeScript. Vad du bygger är valfritt, välj något litet nog att bli färdigt och stort nog att vara intressant.

Appen ska använda minst **4 komponenter från React Native** och minst **4 moduler från Expo SDK**.

### Vad räknas som vad?

**React Native-komponenter**
Byggstenarna som följer med RN självt. Du importerar dem från `react-native`.
Exempelvis: `View`, `Text`, `Image`, `Pressable`, `TextInput`, `ScrollView`, `FlatList`, `Modal` & `Switch`.

**Expo SDK-moduler**
Paket som ger dig tillgång till telefonens funktioner. Du installerar dem med `npx expo install`.
Exempelvis: `expo-location`, `expo-camera`, `expo-image-picker`, `expo-haptics`, `expo-notifications`, `expo-sensors`, `expo-file-system`.

Tänk på att `StyleSheet` är ett API, inte en komponent, och räknas inte. Expo Router räknas inte som en av dina fyra Expo-moduler – den är ett eget krav (se nedan).

### Navigering

Appen ska använda **Expo Router** för navigering. Det är Expos filbaserade router och standardvalet i `create-expo-app`. Vi går igenom den på föreläsning 2 (onsdag 23 september).

Det räcker inte med två skärmar som aldrig pratar med varandra – navigeringen ska göra appen bättre. Minst en skärm ska ta emot en parameter (t.ex. `app/detaljer/[id].tsx` + `useLocalSearchParams`).

---

## Inlämning

**Du MÅSTE använda Git och GitHub för att bli godkänd på uppgiften.** Commit:a löpande under arbetets gång, inte allt på slutet – historiken är en del av det du visar upp.

Inlämningen sker via läroplattformen. Zippa projektmappen **utan `node_modules`**. Mappen `.git` måste följa med så att jag hittar till ditt publika repo.

### README.md

I projektmappen ska det, utöver all kod, finnas en `README.md` som innehåller:

1. **Titel** på projektet
2. **Beskrivning** – vad appen gör och vem den är för
3. **Så bygger och kör du projektet** – steg för steg, från `git clone` till appen igång i Expo Go
4. **Använda RN-komponenter** – lista dem och skriv en rad om vad var och en används till
5. **Använda Expo SDK-moduler** – samma sak
6. **Uppfyllda krav** – kryssa av listorna längst ner i det här dokumentet

Skriv README:n för någon som aldrig sett projektet. Det är den jag läser först.

---

## Presentation

Du ska presentera din applikation för klassen på presentationsdagen. Presentationerna sker i mindre grupper och du har **ca 12 minuter**.

Presentationen ska innehålla:

- **Appen** – visa den körandes, inte bara skärmdumpar
- **Moduler** – vilka 4 expo moduler du använt, till vad och hur de används (dvs i koden).
- **Arbetsprocessen** – hur du planerat, genomfört och strukturerat arbetet
- **En reflekterande del** – vad var svårt? Vad skulle du gjort annorlunda? Vad tar du med dig?

---

## Krav för godkänt (G)

1. Projektet använder minst **4 RN-komponenter** och minst **4 moduler från Expo SDK**
2. De använda komponenterna och modulerna är **antecknade i README.md**, tillsammans med en lista över uppfyllda krav
3. **Expo Router** används för navigering i appen, och minst en skärm tar emot en parameter
4. **Git och GitHub** har använts, med commits spridda över arbetets gång
5. Projektmappen innehåller en **README.md** enligt beskrivningen ovan
6. Uppgiften är **inlämnad i tid**
7. **Muntlig presentation** är genomförd

## Krav för väl godkänt (VG)

1. Alla punkter för godkänt är uppfyllda
2. **Ytterligare en valfri extern modul** används i projektet från [reactnative.directory](https://reactnative.directory)
3. Appen **hämtar data från ett Web-API**
4. **Användningen av AI-verktyg dokumenteras i README** – vilka verktyg du använt, till vad, och hur du verifierat att koden gör det du tror. Ta även upp det i presentationens reflekterande del.

---

## Tips

**Externa paket och New Architecture.** React Native kör sedan version 0.82 enbart den nya arkitekturen. Äldre paket kan sakna stöd. Sök paket på [reactnative.directory](https://reactnative.directory) och filtrera på **Expo Go** och **New Architecture** – då slipper du paket som inte går att köra.

**Paket med egen native-kod fungerar inte i Expo Go.** Har paketet en `ios/`- eller `android/`-mapp kräver det en development build. Håll dig till Expo SDK och rena JS-paket så räcker Expo Go hela vägen.

**AI-regeln i kursen: AI får skriva, du måste förstå och verifiera.** Du ska kunna förklara varje rad i ditt projekt på presentationen. Kod du inte kan redogöra för räknas inte som din.

**Börja smått.** En app med fyra komponenter som fungerar är bättre än en app med tolv som inte gör det.

**Vill du faktiskt lansera appen?** Vi går igenom processen på föreläsningen om leverans, måndag 26 oktober.
