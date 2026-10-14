# Step Quest

## Beskrivning

Step Quest är ett litet idle-/RPG-spel där dina riktiga steg blir valuta. Stegen från telefonens stegräknare sparas i en "stegbank". Stegen används för att samla resurser (trä, sten, malm), och resurserna craftas till föremål. Både insamling och crafting ger XP. XP bestämmer din nivå, och högre nivå låser upp nya recept.

Appen är för den som vill ha lite extra motivation att röra på sig: ju mer du går, desto mer kan du göra i spelet.

### Skärmar

- **Gathering**: välj en aktivitet och ett recept och samla resurser för dina steg.
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

## Använda RN-komponenter

| Komponent    | Används till                                                       |
| ------------ | ------------------------------------------------------------------ |
| `View`       | Layout och behållare för alla skärmar, kort och rader.             |
| `Text`       | All text i appen, med pixelfonten `monogram`.                      |
| `Pressable`  | Knappar: aktiviteter, recept, +/−, craft/gather, inventory-rutor.  |
| `ScrollView` | Gör gathering-, crafting- och inventory-skärmarna scrollbara.      |
| `TextInput`  | Fält i Settings för att mata in antal steg att lägga till.         |
| `Modal`      | Receptmodalen med ikon, beskrivning, kostnad, XP och val av antal. |

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
| `@react-native-async-storage/async-storage` | Sparar stegbank, resurser, inventory och XP mellan sessioner.         |
| `jotai`                                     | Global state (atoms) för stegbank, resurser, crafting och spelarnivå. |

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
