This is a hackathon-time project I put together as part of an application to work for Mobeye.

# Description

* displays a list of micromania stores on a google map
* allows the user to select stores
* allows the user to download selected stores as a CSV file

# Usage

The project can be tested at http://ahogg-mobeye-test.meteor.com.

> See the Known issues section regarding the map not centering on France

If you want to test it locally, read on.

After installing meteor and cloning this repo, you should be able to run

```bash
cd mobeye
meteor
```

Just point your browser at the URL displayed on the console.

# Known issues

Don't bug me about these.

* The CSV export function works, but it isn't great (see notes in client/App.jsx)
* It is possible to select the same store multiple times (I'd implement this properly, but it is an acceptable corner to cut within the parameters of the exercise)
* On the meteor.com testing server, the map does not center on France automatically as it should. I suspect this is because the store collection takes longer to reach the client, so the markers aren't added as part of the initialization code. It doesn't really matter.

# Implementation notes

## Data provenance

The micromania website has a store locator, and it is possible to extract store info + spatial coords by parsing the response of the appropriate service call. Unfortunately, it's quite unwieldy because parsing the data is not straightforward, and because it is spatially paginated (50 results around a location). Extracting the store info for the whole of France is non-trivial.

I could have used a website like horaires-ouverture.com to scrape the data, because their pagination is simpler to navigate and getting store names/addresses is just a question of extracting the fields from the DOM. But they don't provide spatial coords, so an extra geocoding step would have been required.

I decided to use the Google Places API to save time. Two `textualSearch`es ("micromania France" and "micromania Paris") did the trick. I cut a corner and took only the first page of results for micromania Paris.

## Data storage

The raw JSON I got from Google Places is in `private/google-places-result.json`. I hacked the backend code to import it straight into the Mongo store collection when the latter is empty. I think there must be more elegant/maintainable ways of doing this, but hey: it's a hackathon :)

## Tech stack

This is my first time using MeteorJS. It's quite comfortable, and I can see how it fits the "lean startup" model. I need a bit more convincing to adopt it for larger scale projects. In particular, I'm not keen on the use of globals to export symbols.

This is also my first time using the semantic:ui CSS/UI framework. It's quite nice, though I haven't tested the project on other browsers.
