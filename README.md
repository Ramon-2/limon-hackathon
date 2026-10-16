# Limon

**Hire a local to plan your day.** Limon is a link-in-bio marketplace where travelers commission local creators to plan custom day trips, so they can travel like someone who lives there. It also sends tourism money to people who grew up in the area.

## Run it

Limon is a static site with no build step. Serve the folder with any web server:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` straight from disk won't work, because ES modules need a server.

## Try the loop

1. **Find a local.** The home page is a map of Orange County. Hover a face to see that creator's travel style, filter by category, or take the 3-question match quiz.
2. **Pick a creator.** Their profile leads with what's happening this week, a booking card (Day Trip or Weekend, plus Standard, Plus or Premium) and a style web across the home-page categories.
3. **Browse free sample days.** Each creator has three, with insider tips on every stop: what to get, parking, the best time to go, local secrets and the story behind the place.
4. **Book a day.** Checkout is a demo, and nothing is charged.
5. **Switch to the creator studio.** Open the request, build the itinerary and watch Limon fact-check it before it's sent.

## How Limon checks every plan

`js/validate.js` checks each itinerary before it reaches a traveler:
- opening hours and closed days
- travel time between stops
- budget per person
- pace (how many stops for a relaxed, balanced or active day)

## Google Maps (optional)

Without a key, Limon searches its own demo places and estimates drive times with its own traffic model. To search real places with live hours and traffic-aware drive times, add a Google Maps Platform browser key to `js/config.js`. The key needs the Maps JavaScript API, Places API (New) and Routes API enabled. Restrict it to your site's URLs.

## Built with

Plain HTML, CSS and JavaScript modules, plus [Leaflet](https://leafletjs.com/) with OpenStreetMap tiles. There's no framework and no backend, and orders are kept in your browser's localStorage.

## Demo data

The creators, their portraits and the businesses are fictional. Parks, beaches, museums and other public landmarks are real places, but hours and prices are placeholders.
