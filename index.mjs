import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, '../views'));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, '../public')));

const planets = (await import('npm-solarsystem')).default;
app.get('/', async (req, res) => {
    const response = await fetch('https://pixabay.com/api/?key=5589438-47a0bca778bf23fc2e8c5bf3e&q=solar%20system&per_page=50&orientation=horizontal');
    const data = await response.json();
    let random_index = Math.floor(Math.random() * data.hits.length);
    res.render('home', {
        home: { image: data.hits[random_index].largeImageURL }
    });
});


//original nasa date that is hardcoded for datalet nasa_ = "https://api.nasa.gov/planetary/apod?api_key=9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD&date=2025-03-09"

app.get('/getInfo', async (req, res) => {
    let selected = req.query.object;
    let planetInfo;


    if (selected === 'Home') {
        const response = await axios.get(home_);
        const images = response.data.hits;
        const randomImage = images[Math.floor(Math.random() * images.length)].webformatURL;
        res.render('home', { home: { image: randomImage } });
        return;
    }

    if (selected === `NASA`) {
        try {
            let requestedDate = req.query.date;
            let nasaApiUrl = `https://api.nasa.gov/planetary/apod?api_key=9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD`;
            if (requestedDate) {
                nasaApiUrl += `&date=${requestedDate}`;
            }
            const response = await axios.get(nasaApiUrl);
            const nasaData = response.data;
            res.render('nasa', { nasa: nasaData });
            return;
        } catch (error) {
            alert('Date must be between Jun 16, 1995 and Current  date.');
        }
    }

    if (selected === 'Asteroids' || selected === 'Meteorites') {
        let celestialInfo;
        if (selected === 'Asteroids') {
            celestialInfo = planets.getAsteroids();
        } else {
            celestialInfo = planets.getMeteorite();
        }

        console.log(celestialInfo);

        res.render('info', { celestial: celestialInfo, selected });
        return;
    }




    if (planets[`get${selected}`]()) {
        planetInfo = planets[`get${selected}`]();
    } else {
        planetInfo = null;
    }

    res.render('planetInfo', { planet: planetInfo, planetName: selected });
    return;
});


export default app;


// this code under was for just gettign planet info and sending it to the info.ejs file
// It was also for nasa but it was hard to incorporate it with the other code so we 
// just used the nasa code to the getInfo code

// app.get('/nasa', async (req, res) => {
//     try {
//         const response = await axios.get(nasa_);
//         const nasaData = response.data;
//         res.render('nasa', { nasa: nasaData });
//     } catch (error) {
//         console.error('Error fetching NASA image:', error);
//         res.status(500).send('Error fetching NASA image');
//     }
// });


// app.get('/mars', (req, res) => {
//     let marsInfo = planets.getMars();
//     res.render('mars', {mars : marsInfo});
// });

// app.get('/venus', (req, res) => {
//     let venusInfo = planets.getVenus();
//     res.render('venus', {venus : venusInfo});
// });

//vv makes the top code more dynamic
// app.get('/getPlanetInfo', (req, res) => {
//     let planetSelector = req.query.planet;
//     let planetInfo;
//     console.log(planetSelector);
//     if (planets[`get${planetSelector}`]()) {
//         planetInfo = planets[`get${planetSelector}`]();
//     } else {
//         planetInfo = null;
//     }
//     console.log(planetInfo);

//     res.render('planetInfo', { planet: planetInfo, planetName : planetSelector });
// });

// app.get('/getInfo', (req, res) => {
//     let selected  = req.query.object;
//     let celestialInfo;
//     console.log(planets)
//     console.log(selected);
//     console.log(planets[`get${selected}`]());
//     if (planets[`get${selected}`]()) {
//         celestialInfo = planets[`get${selected}`]();
//     } else {
//         celestialInfo = null;
//     }
//     console.log(celestialInfo);

//     res.render('info' ,{ celestial : celestialInfo,selected });
// });


