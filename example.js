var lounge = require('./lounge') || require('csgolounge-api');
var express = require('express');
var app = express();


app.get('/', function (req, res) {
    res.redirect('/matches');
});

app.get('/matches', function(req, res) {
    lounge.getMatches(function(matches){
        res.send(matches);
    });
});

app.get('/matches/:id', function(req, res) {
    var matchId = req.params.id;
    lounge.getMatch(matchId, function(match){
        res.send(match);
    })
});

lounge.onWin(4422, function(match){
    console.log('Winner ! ' + match.teams[match.winner].name);
})


app.listen(5000);

console.log('App listening on port 5000. Visit http://localhost:5000')
