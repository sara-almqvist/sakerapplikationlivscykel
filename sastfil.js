const express = require(express);
const bodyParser = require('body-parser');
const mysql = require('mysql');

//Hårdkodade lösenord och användaruppgifter bör ligga i .env, vault eller annan säker lösning
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'SalonBooking',
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const query =
    "SELECT * FROM users WHERE username = '" +
    username +
    "' AND password = '" +
    password +
    "'"; //Risk för SQL-injektion med username och password
  db.query(query, (err, rows) => {
    if (err) {
      return res.send('Fel inträffade vid databasfråga: ' + err);
    }
    if (rows.length > 0) {
      res.send('Välkommen <b>' + username + '</b>, du är inloggad!'); //Risk för cross-site scripting (XSS)
    } else {
      res.send('Ogiltiga användaruppgifter.');
    }
  });
});
app.get('/messages', (req, res) => {
  const msg = req.query.msg || 'Inget meddelande';
  res.send('<h1>Dina meddelanden</h1><p>' + msg + '</p>'); //Risk för att användaren ändrar i URL-söksträngen och kan komma åt andra meddelanden som den inte ska ha tillgång till. Plus XSS-risk
});

// Starta servern (lokalt)
app.listen(3000, () => {
  console.log('Server kör på http://localhost:3000');
});
