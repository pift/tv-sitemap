var request = require('request')
  , JSONStream = require('JSONStream')
  , es = require('event-stream')
  , http = require('http');


var Path = {programs :"http://www.dr.dk/mu-online/api/1.0/page/tv/programs?index="
			, episodes: "http://www.dr.dk/mu-online/api/1.0/page/tv/player/"
		};
var letters = ["a"];  // ,"b","c","d","e"


letters.forEach(function(e,i){
	
	var programList = "";
	http.get(Path.programs + e, function(res) {
		res.on('data', function(chunk) {
			programList += chunk;
		});
		res.on('end', function() {

			JSON.parse(programList).Programs.Items.forEach(function(f){

				console.log (f.SeriesTitle);

				var episodeList = "";
				http.get(Path.episodes + f.SeriesSlug, function(_res) {
					_res.on('data', function(chunk) {
						episodeList += chunk;
					});
					_res.on('end', function() {
						console.log (Path.episodes + f.SeriesSlug)
						try {
							JSON.parse(episodeList).RelationsList.Items.forEach(function(g){
								console.log (g.Slug);
							})

						} catch (e) {
							//console.error("Error:", e)
						}
						
					   
					});
				}).on('error', function(e) {
					  //console.error("Error: ", e);
				});

			});
		});
	}).on('error', function(e) {
		  console.log("Got error: ", e);
	});


});

