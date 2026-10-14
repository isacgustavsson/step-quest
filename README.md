# Step Quest

## Beskrivning

Step Quest är ett litet idle-/RPG-spel där dina riktiga steg blir valuta. Stegen från telefonens stegräknare sparas i en "stegbank". Stegen används för att samla resurser (trä, sten, malm), och resurserna craftas till föremål. Både insamling och crafting ger XP. XP bestämmer din nivå, och högre nivå låser upp nya recept.

Appen är för den som vill ha lite extra motivation att röra på sig: ju mer du går, desto mer kan du göra i spelet.

### Skärmar

- **Gathering**: välj en aktivitet och ett recept och samla resurser för dina steg.
- **Map**: en tilemap (ritad i Tiled) som går att panorera och pinch-zooma. Tryck på en ruta så går spelaren dit runt hinder som vatten, sten och träd. Positionen sparas.
- **Crafting**: gör föremål av resurserna.
- **Inventory**: visar resurser och craftade föremål. Tryck på ett föremål för att öppna detaljskärmen.
- **Settings**: lägg till steg manuellt (för test i simulator) och nollställ framsteg.
- **Details** (`details/[label]`): visar ikon, typ och antal för en resurs eller ett föremål.

Tryck på ett recept för att öppna en modal med ikon, beskrivning, kostnad och XP. Där väljer du också hur många gånger du vill samla eller crafta.

## Så bygger och kör du projektet

Du behöver [Node.js](https://nodejs.org) (LTS) och appen [Expo Go](https://expo.dev/go) på telefonen.

```bash
git clone https://github.com/isacgustavsson/step-quest.git
cd step-quest/app
npm install
npx expo start
```

Skanna QR-koden som visas i terminalen: med kameran på iOS och i Expo Go-appen på Android. Telefonen och datorn måste vara på samma nätverk.

Stegräknaren fungerar bara på en riktig telefon. I simulatorn kan du lägga till steg under **Settings**.

## Rita kartor

Kartan ritas i [Tiled](https://www.mapeditor.org) (gratis) och sparas som JSON i `app/assets/maps/world.json`. Appen läser filen direkt, så det räcker att spara i Tiled.

1. Öppna `app/assets/maps/world.json` i Tiled.
2. Måla i lagret `ground` (mark) och `decor` (träd, buskar m.m. ovanpå marken). Lagren ritas i samma ordning som i Tiled.
3. Rutor som inte går att gå på har en bool-property `blocked = true` på tilen i tilesetet (Tileset-panelen → markera tile → Custom Properties). Det räcker att någon tile på en ruta, i något lager, är `blocked`.
4. Spelaren startar på punkten som heter `spawn` i objektlagret `objects`.
5. Spara som JSON (`.json`, inte `.tmj`, eftersom Metro bara kan läsa in `.json`). Tilesetet måste vara inbäddat i kartan (*Embed tileset*).

Ny karta: Orthogonal, tile layer format CSV, tile size 16×16, och ett inbäddat tileset utan spacing/margin.

Tilesetet är [Tiny Town](https://kenney.nl/assets/tiny-town) av Kenney (CC0) och ligger i `app/assets/maps/tileset.png`. Både Tiled och appen använder samma bild; appen förstorar pixlarna utan utsmetning.

## Använda RN-komponenter

| Komponent              | Används till                                                                  |
| ---------------------- | ----------------------------------------------------------------------------- |
| `View`                 | Layout och behållare för alla skärmar, kort och rader.                        |
| `Text`                 | All text i appen, med pixelfonten `monogram`.                                 |
| `Pressable`            | Knappar: aktiviteter, recept, +/−, craft/gather, inventory-rutor.             |
| `ScrollView`           | Gör skärmarna scrollbara och visar recepten som en horisontell karusell.      |
| `TextInput`            | Fält i Settings för antal steg att lägga till, och för antal i receptmodalen. |
| `Modal`                | Receptmodalen med ikon, beskrivning, kostnad, XP och val av antal.            |
| `KeyboardAvoidingView` | Skjuter upp receptmodalen så att tangentbordet inte täcker den.               |

`Alert` och `Keyboard` från `react-native` används också (meddelanden vid lyckad/misslyckad handling och för att stänga tangentbordet), men de är API:er och inte komponenter.

## Använda Expo SDK-moduler

| Modul          | Används till                                                                  |
| -------------- | ----------------------------------------------------------------------------- |
| `expo-sensors` | `Pedometer` läser telefonens stegräknare, och nya steg sätts in i stegbanken. |
| `expo-haptics` | Vibrationsfeedback när en insamling eller crafting lyckas eller misslyckas.   |
| `expo-image`   | Visar bakgrundsbilder, ikoner för aktiviteter, recept och resurser.           |
| `expo-font`    | Laddar den egna pixelfonten `monogram` vid start.                             |

Navigering sker med **Expo Router** (filbaserad routing i `src/app/`).

### Övriga externa paket

| Paket                                       | Används till                                                          |
| ------------------------------------------- | --------------------------------------------------------------------- |
| `@react-native-async-storage/async-storage` | Sparar stegbank, resurser, inventory, XP och kartposition.            |
| `jotai`                                     | Global state (atoms) för stegbank, resurser, crafting och spelarnivå. |
| `react-native-gesture-handler`              | Pan-, pinch- och tryckgester på kartan.                               |
| `react-native-reanimated`                   | Animerar kartans zoom/förflyttning och spelarens gång på UI-tråden.   |
| `@shopify/react-native-skia`                | Ritar hela kartan i en canvas med tiles från tilesetet.               |

## Uppfyllda krav

### Godkänt (G)

- [x] Minst 4 RN-komponenter och minst 4 moduler från Expo SDK
- [x] Komponenterna och modulerna är antecknade i README.md, tillsammans med en lista över uppfyllda krav
- [x] Expo Router används för navigering, och minst en skärm tar emot en parameter (`details/[label]`)
- [x] Git och GitHub har använts, med commits spridda över arbetets gång
- [x] Projektmappen innehåller en README.md enligt beskrivningen
- [ ] Uppgiften är inlämnad i tid
- [ ] Muntlig presentation är genomförd

### Väl godkänt (VG)

- [ ] Alla punkter för godkänt är uppfyllda
- [x] Ytterligare en valfri extern modul används (`@react-native-async-storage/async-storage`)
- [ ] Appen hämtar data från ett Web-API
- [ ] Användningen av AI-verktyg dokumenteras i README
