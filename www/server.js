import express from 'express';
import tele from './models/TV.js';

const app = express();
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

app.get('/', async function(req,res){
    const wishlist = await tele.loadMany({Achete : 0})
    const have = await tele.loadMany({Achete : 1})
    let sum = 0;
    for(let i = 0;i<have.length ;i++){
        sum = sum + have[i].Prix;
    };
    res.render('TvList.ejs', {wishlist,have,sum});
});

app.post("/add", async function (req, res) {
  const tv = new tele();
  tv.Marque = req.body.Marque;
  tv.Prix = parseInt(req.body.Prix);
  tv.Taille = parseInt(req.body.Taille);
  tv.Achete = 0;
  await tv.save();
  res.redirect('/');
});

app.post("/buy", async function (req, res) {
    const tv = await tele.load({id : req.body.idtv})
    tv.update({Achete : 1});
    tv.update({Casse : 0})
    await tv.save();
    res.redirect('/');
});

app.post("/broke", async function (req, res) {
    const tv = await tele.load({id : req.body.idtv})
    tv.update({Casse : 1});
    tv.update({Cause : req.body.Cause})
    await tv.save();
    res.redirect('/');
});

// app.get("/", async function (req, res) {
//   const tasks = await TV.loadMany();
//   res.render('TvList.ejs', { tasks: tasks });
// });

app.listen(80);
