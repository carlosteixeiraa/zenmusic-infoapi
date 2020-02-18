var express = require('express');
var fetchInfo = require('youtube-info');
var LastFM = require('last-fm');
var cors = require('cors');
var yts = require('yt-search');
var lastfm = new LastFM('4e07cd8b1bcaf4a4e84fd56c3e0ca1d9', { userAgent: 'zenmusic / alpha1.0.0' })
var app = express();
var port = process.env.PORT || 18732;


app.use(cors());

/* api video info route */
app.get('/info/video/:id', (req, res) => {
    fetchInfo(req.params.id, (err, info) => {
        if(err) {
            console.log('ups! something happened. ' + err);
        } else {

            var sl = 'https://zenmusic-streamingapi.herokuapp.com/' + req.params.id;
            var sc = 'https://zenmusic-streamingapi.herokuapp.com/chunk/' + req.params.id;

            var vnfs = info.title.split('-');
            var an = vnfs[0];
            var mn = vnfs[1];

            var resposta = {
                "streaming_live" : sl,
                "streaming_chunked" : sc,
                "video_name" : info.title,
                "artist_name" : an,
                "music_name" : mn,
                "genre" : info.genre,
                "views" : info.views,
                "likes" : info.likeCount
            };

            res.send(resposta);
        }
    });
});

app.get('/music/search/:q', (req, res) => {

    var response = [];
    yts(req.params.q, (err, r) => {
        if(err) {
            console.log(err);
        } else {
            var videos = r.videos;
            videos.forEach((v, i) => {
                var sl = 'https://zenmusic-streamingapi.herokuapp.com/' + v.videoId;
                var sc = 'https://zenmusic-streamingapi.herokuapp.com/chunk/' + v.videoId;
                console.log(v);
                response[i] = {
                    "id": v.videoId,
                    "streaming_live" : sl,
                    "streaming_chunked" : sc,
                    "title": v.title,
                    "timestamp": v.timestap,
                    "views": v.views,
                    "thumb": v.image
                };
            });
        }

        res.send(response);

      });

});

/* server listener */
app.listen(port, () => {
    console.log('info api listening on http://localhost:' + port);
});
