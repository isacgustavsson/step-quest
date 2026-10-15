# Step Quest

## Beskrivning

Step Quest är ett litet idle-/RPG-spel där dina riktiga steg blir valuta. Stegen från telefonens stegräknare sparas i en "stegbank". Stegen används för att samla resurser (trä, sten, malm) från objekt på kartan, och resurserna craftas till föremål. Både insamling och crafting ger XP. XP bestämmer din nivå, och högre nivå låser upp nya recept.

Appen är för den som vill ha lite extra motivation att röra på sig: ju mer du går, desto mer kan du göra i spelet.

### Skärmar

- **Map** (första fliken): en tilemap (ritad i Tiled) som går att panorera och pinch-zooma. Tryck på en ruta så går spelaren dit runt hinder som vatten, sten och träd. Positionen sparas. Tryck på ett resursobjekt (träd, buske, sten …) så går spelaren fram till det och en modal visar vad insamlingen kostar i steg och hur många resurser den ger. Varje insamling ger en fast mängd, och objektet försvinner sedan från kartan tills det växer tillbaka.
- **Crafting**: gör föremål av resurserna.
- **Inventory**: resurser och craftade föremål i en gemensam grid med fasta rutor. Håll in en sak och dra den till en annan ruta: på en tom ruta flyttas den dit, på en annan sak byter de plats. Placeringen sparas. Tryck på en sak för att öppna detaljskärmen.
- **Settings**: lägg till steg manuellt (för test i simulator) och nollställ framsteg.
- **Details** (`details/[id]`): visar ikon, typ och antal för en resurs eller ett föremål.

I Crafting trycker du på ett recept för att öppna en modal med ikon, beskrivning, kostnad och XP. Där väljer du också hur många gånger du vill samla eller crafta.

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

Kartan ritas i [Tiled](https://www.mapeditor.org) (gratis) och sparas som JSON i `app/assets/maps/world-cainos.json`. Appen läser filen direkt, så det räcker att spara i Tiled. Alla kartor och deras id:n står i `MAP_SOURCES` i `app/src/map/maps.ts`.

**Flera kartor.** En ny karta läggs till i `MAP_SOURCES` med ett eget id. Id:t sparas i spelarens position och i återväxten för resursobjekt, så det får inte ändras när kartan väl används. Spelaren byter karta med `enterMapAtom` i `app/src/state/map.ts`. Objekt-id:n i Tiled behöver bara vara unika inom en karta.

1. Öppna `app/assets/maps/world-cainos.json` i Tiled.
2. Måla i lagret `ground` (mark) och `decor` (låga saker som blommor och buskar ovanpå marken). Lagren ritas i samma ordning som i Tiled.
3. Rutor som inte går att gå på har en bool-property `blocked = true` på tilen i tilesetet (Tileset-panelen → markera tile → Custom Properties). Det räcker att någon tile på en ruta, i något lager, är `blocked`.
4. Spelaren startar på punkten som heter `spawn` i objektlagret `objects`.
5. Resursobjekt läggs som tile-objekt (_Insert Tile_, `T`) i objektlagret `resources`. Varje objekt behöver en string-property `resource` med resursens id, t.ex. `birch_log` eller `copper_ore`. Id:n, namn och ikoner finns i `app/src/data/resources.ts`, och nivå, stegkostnad, mängd, XP och återväxttid finns i `app/src/data/gathering.ts`. Objektets fot går inte att gå på, utom när objektet är samlat och borta. Ett objekt växer inte tillbaka medan spelaren står på foten.
6. Höga eller breda saker som inte går att samla, t.ex. stora träd och hus, läggs som tile-objekt i objektlagret `props`. Deras fot är alltid ett hinder.
7. Spara som JSON (`.json`, inte `.tmj`, eftersom Metro bara kan läsa in `.json`). Tilesetet måste vara inbäddat i kartan (_Embed tileset_).

Ny karta: Orthogonal, tile layer format CSV, tile size 16×16, och inbäddade tilesets utan spacing/margin. Cainos-grafiken är ritad i 32 px, så gräs-tilesetet används som 16×16 (en Cainos-ruta blir 2×2 rutor) och objekten är flera rutor stora. Spelaren går en 16-ruta i taget, och appen ritar grafiken i 1:1.

**Stora objekt och djup.** Objekt i `resources` och `props` får vara större än en ruta. Bara foten, den nedersta raden rutor som objektet täcker, är ett hinder; resten av bilden går att gå bakom. Objekten ritas uppifrån och ner, och spelaren hamnar bakom ett objekt vars fot står nedanför spelaren. Tile-lagren djupsorteras inte, så allt som spelaren ska kunna gå bakom läggs som objekt. Objekt som spelaren ska gå ovanpå, t.ex. plattformen i mitten av kartan, får en bool-property `floor = true` på tilen eller objektet. De ritas alltid under spelaren och andra objekt, och deras fot är inget hinder. Foten centreras under bilden och är lika bred som bilden i hela rutor, om inte tilen eller objektet har en int-property `footWidth` (träden har `footWidth = 1`, en 16-ruta under stammen). Skala inte objekt olika mycket på bredden och höjden i Tiled; appen skalar alltid lika i båda led efter bredden. Slå på _Snap to Grid_ så att objekten hamnar på rutor.

**Objekt-tilesetet.** Träd, buskar, stenar och props ligger i tilesetet `cainos-objects`, ett _collection_-tileset där varje tile är en rektangel ur `cainos-plant.png` eller `cainos-props.png`. Varje tile har en property `name` (t.ex. `tree large`, `rock medium`, `barrel`). Ett nytt objekt läggs till i Tiled under _Tileset → Add Tiles_, med bilden vald och rektangeln satt under tilens _Image Rect_.

Kartan kan använda flera tilesets. Lägg bilden i `app/assets/maps/` och lägg till filnamnet i `TILESET_IMAGES` i `app/src/map/tilemap.ts`, eftersom Metro bara kan läsa in bilder med fasta sökvägar.

## Innehåll och sparfil

Resurser (`data/resources.ts`), föremål (`data/items.ts`), insamlingsrecept (`data/gathering.ts`) och crafting-recept (`data/crafting.ts`) har stabila id:n, t.ex. `pine_branch`. Id:t sparas i sparfilen och i Tiled, och namnet är bara det som visas, så ett namn kan ändras utan att någons framsteg försvinner.

Hela spelet sparas under en nyckel i AsyncStorage, med ett versionsnummer. Ändras formen på något som sparas höjs `SAVE_VERSION` i `app/src/state/migrations.ts` och en migrering läggs till, så att gamla sparfiler uppgraderas när appen startar. Sparfiler från innan det fanns en version (en nyckel per atom, namn i stället för id) migreras automatiskt.

På iOS hämtas steg som togs medan appen var stängd när appen öppnas, upp till en vecka bakåt. Android har ingen sådan historik, så där räknas bara steg medan appen är öppen.

Grafiken är [Pixel Art Top Down – Basic](https://cainos.itch.io/pixel-art-top-down-basic) av Cainos (`cainos-*.png`). `tileset.png` är [Tiny Town](https://kenney.nl/assets/tiny-town) av Kenney (CC0), från den första kartan, och används inte av någon karta just nu. Både Tiled och appen använder samma bilder; appen ritar pixlarna utan utsmetning.

## Använda RN-komponenter

| Komponent              | Används till                                                                  |
| ---------------------- | ----------------------------------------------------------------------------- |
| `View`                 | Layout och behållare för alla skärmar, kort och rader.                        |
| `Text`                 | All text i appen, med pixelfonten `monogram`.                                 |
| `Pressable`            | Knappar: aktiviteter, recept, +/−, craft/gather, inventory-rutor.             |
| `ScrollView`           | Gör skärmarna scrollbara och visar recepten som en horisontell karusell.      |
| `TextInput`            | Fält i Settings för antal steg att lägga till, och för antal i receptmodalen. |
| `Modal`                | Receptmodalen i Crafting och samlingsmodalen på kartan.                       |
| `KeyboardAvoidingView` | Skjuter upp receptmodalen så att tangentbordet inte täcker den.               |

`Alert` och `Keyboard` från `react-native` används också (meddelanden vid lyckad/misslyckad handling och för att stänga tangentbordet), men de är API:er och inte komponenter.

## Använda Expo SDK-moduler

| Modul          | Används till                                                                  |
| -------------- | ----------------------------------------------------------------------------- |
| `expo-sensors` | `Pedometer` läser telefonens stegräknare, och nya steg sätts in i stegbanken. På iOS hämtas även steg från tiden appen var stängd. |
| `expo-haptics` | Vibrationsfeedback när en insamling eller crafting lyckas eller misslyckas.   |
| `expo-image`   | Visar bakgrundsbilder, ikoner för aktiviteter, recept och resurser.           |
| `expo-font`    | Laddar den egna pixelfonten `monogram` vid start.                             |

Navigering sker med **Expo Router** (filbaserad routing i `src/app/`).

### Övriga externa paket

| Paket                                       | Används till                                                          |
| ------------------------------------------- | --------------------------------------------------------------------- |
| `@react-native-async-storage/async-storage` | Sparar hela spelet (stegbank, resurser, inventory, XP, position, återväxt) i en versionerad sparfil. |
| `jotai`                                     | Global state (atoms) för stegbank, resurser, crafting och spelarnivå. |
| `react-native-gesture-handler`              | Pan-, pinch- och tryckgester på kartan, och drag and drop i inventoryt. |
| `react-native-reanimated`                   | Animerar kartans zoom/förflyttning, spelarens gång och sakerna som dras i inventoryt, på UI-tråden. |
| `@shopify/react-native-skia`                | Ritar hela kartan i en canvas med tiles från tilesetet.               |

## Uppfyllda krav

### Godkänt (G)

- [x] Minst 4 RN-komponenter och minst 4 moduler från Expo SDK
- [x] Komponenterna och modulerna är antecknade i README.md, tillsammans med en lista över uppfyllda krav
- [x] Expo Router används för navigering, och minst en skärm tar emot en parameter (`details/[id]`)
- [x] Git och GitHub har använts, med commits spridda över arbetets gång
- [x] Projektmappen innehåller en README.md enligt beskrivningen
- [ ] Uppgiften är inlämnad i tid
- [ ] Muntlig presentation är genomförd

### Väl godkänt (VG)

- [ ] Alla punkter för godkänt är uppfyllda
- [x] Ytterligare en valfri extern modul används (`@react-native-async-storage/async-storage`)
- [ ] Appen hämtar data från ett Web-API
- [ ] Användningen av AI-verktyg dokumenteras i README
