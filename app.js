var request = require('request')
  //, JSONStream = require('JSONStream')
  //, es = require('event-stream')
  , http = require('http')
  , fs = require('fs');


var Path = {api: {
				programs :"http://www.dr.dk/mu-online/api/1.0/page/tv/programs?index="
				, episodes: "http://www.dr.dk/mu-online/api/1.0/page/tv/player/"
			}
			, www: {
				programs: "http://www.dr.dk/tv/se/"
			}
		};
var letters = ["a"];  // ,"b","c","d","e"

var out = "";




letters.forEach(function(e,i){
	
	var programList = "";
	http.get(Path.api.programs + e, function(res) {
		res.on('data', function(chunk) {
			programList += chunk;
		});
		res.on('end', function() {
			var episodeList = [];
			JSON.parse(programList).Programs.Items.forEach(function(f){
				// Serie
				out += printItem(f.SeriesSlug, f.PrimaryBroadcastStartTime);
				episodeList.push( Path.api.episodes + f.Slug );
			});
			nextEpisode(episodeList); 
		});
	}).on('error', function(e) {
		  console.log("Got error: ", e);
	});
});


var nextEpisode = function(list){
	if (list.length > 0) {
		loadEpisode(list);
	} else {
		endXML();
	}

}
 
var loadEpisode = function(list){ // Path.episodes + f.Slug
	var episodeList = "";
	var url = list.pop();
	http.get(url, function(_res) {
		_res.on('data', function(chunk) {
			episodeList += chunk;
		});
		_res.on('end', function() {
			try {
				var list = JSON.parse(episodeList);
				out += printItem(f.SeriesSlug+"/"+f.Slug, f.PrimaryBroadcastStartTime);
				list.RelationsList.Items.forEach(function(g){
					out += printItem(g.SeriesSlug+"/"+g.Slug, g.PrimaryBroadcastStartTime);
				});
			} catch (e) {
				console.error("Error:", e)
			};
			list
			nextEpisode(list);				   
		});
	}).on('error', function(e) {
		  console.error("Error: ", e);
	});


}



var printItem = function(urn,modified){
		return "<url>\n" +
		"	<loc>http://www.dr.dk/tv/se/"+urn+"</loc>\n" +
		"	<lastmod>"+modified+"</lastmod>\n" +
		"</url>\n";

}


var startXML = function(){
	out += 	"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
		"<urlset" +
		"	xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" \n" +
		"	xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" \n" +
		"	xsi:schemaLocation=\"http://www.sitemaps.org/schemas/sitemap/0.9 \n" +
		"		http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd\"> \n";

}
var endXML = function(){
	out += "</urlset>";
	fs.writeFile('sitemap.xml', out, function (err) {
	  if (err) return console.log(err);
	  console.log('WRITE > sitemap.xml');
	});
}


















