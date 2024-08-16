const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
console.log(PRIVATE_APP_ACCESS)


app.get('/', async (req, res) => {
    const url = 'https://api.hubspot.com/crm/v3/objects/2-33372729';
    const headers = {
        Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    
    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;

        res.render('homepage', { title: 'Custom Object List', records: data });
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.render('homepage', { title: 'Custom Object List', records: [] });
    }
});



app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
  });


app.post('/update-cobj', async (req, res) => {
    try {
      const { model, company, type } = req.body;
      const url = 'https://api.hubspot.com/crm/v3/objects/2-33372729';
      const headers = {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
          'Content-Type': 'application/json'
      }
      await axios.post(url, {properties:{ model, company, type }},{headers});
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.send('Error creating record.');
    }
  });


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));