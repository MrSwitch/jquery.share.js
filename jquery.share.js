/**
 * jquery.share.js
 * Appends Popular Share buttons to a DOM element
 *
 * @author Andrew Dodson
 * 
 */
(function($){

	//
	// The share function binds an on click event listeners to a DOM element.
	// 
	// 'Click' shall displays a list of network service that you may share the current page with. If the user clicks yes then the 
	//
	$.fn.share = function(title, link){

		/*	<button data-href="http://www.google.com/buzz/post?url={$url}&message={$message}&imageurl={$image}" data-dimension="700x450">\
				<img src="http://code.google.com/apis/buzz/images/google-buzz-16x16.png"> Buzz\
			</button>
			<button class="jquery-share yahoo" data-href="http://buzz.yahoo.com/vote/?language={$lang}&votetype=1&loc={$url}&guid={$url}&assettype=video&from=pub&headline={$message}&summary={$message}" data-dimension="850x700">\
								<span class="img" style="background-position:0 -48px;"></span><span class="label">Yahoo</span>\
			</button>
		*/

		return $(this).each(function(){

			var self = this,
				url = ( link || (document.URL || window.location.href).replace(/[\(\)]/g,''));

			if(title){
				$(this).attr('data-title',title);
			}
			if(link){
				$(this).attr('data-link',link);
			}

			function callback(srv,i){
				$('.'+srv+ ' .count',self).html(i||'');
			}
		
			// We can get the number of Buzz's from Google
			/*
							$.getJSON('http://www.google.com/buzz/api/buzzThis/buzzCounter?url='+encodeURIComponent(url)+'&callback=?', function(o){
				callback('google', o[url]);
			});
			*/
	
			// And the number of FaceBooks
			$.getJSON('http://api.ak.facebook.com/restserver.php?v=1.0&method=links.getStats&urls=%5B%22'+ encodeURIComponent(url) +'%22%5D&format=json&callback=?', function(json){
				callback('facebook', json[0].total_count);
			});
	
			// And the number of tweets
			// HAD Trouble with the twitter caching locally and failing to return the number of tweets.
			$.getJSON('http://urls.api.twitter.com/1/urls/count.json?url='+encodeURIComponent(url)+'&noncache='+Math.random()+'&callback=?', function(json){
				callback('twitter', json.count);
			});

			// any need to change the DOM?
			if($('button.jquery-share', this).length){
				return false;
			}

			$('<button class="jquery-share windows" data-href="http://profile.live.com/badge?url={$url}&title={$message}&screenshot={$image}" data-dimension="900x500">\
					<span class="img" style="background-position:0 0;"></span><span class="label">Messenger</span>\
				</button><button class="jquery-share twitter" data-href="http://twitter.com/share?url={$url}&text={$message}" data-dimension="550x300">\
					<span class="img" style="background-position:0 -16px;"></span><span class="label">Twitter</span>\
				</button><button class="jquery-share facebook" data-href="http://www.facebook.com/sharer.php?u={$url}&t={$message}" data-dimension="550x300">\
					<span class="img" style="background-position:0 -32px;"></span><span class="label">Facebook</span>\
				</button>')
			.each(function(){
				this.title = "Share with " + $(this).text().replace(/\s*/g,'');
				
				// Add counter Div
				$(this).append('<span class="count"></span>');

			})
			.click(function(){

				var a = {
					url		: ( $(this).parent().attr('data-link') || (document.URL || window.location.href).replace(/[\(\)]/g,'')),
					message	: ( $(this).parent().attr('data-title') || document.title.replace(/\#.*/,'') ), // CAPTURE #, for some reason this ia a bug in IE
					image	: $('meta[name=image_src]').attr('content'),
					lang	: (window.navigator.browserLanguage||window.navigator.language)
					//,id		: channel().id || ''
				};
	
				var w=800,h=500,m;
				if( $(this).attr('data-dimension') && ( m = $(this).attr('data-dimension').match(/[0-9]+/ig) ) ){
					w = m[0];
					h = m[1];
				}
				var l = (screen.width/2)-(w/2), t = (screen.height/2)-(h/2);
				window.open( $(this).attr('data-href').replace(/\{\$(.*?)\}/ig, function(m,p1){
					return (p1 in a)?encodeURIComponent(a[p1]):'';
				}), 'buzz', 'width='+w+'px,height='+h+'px,left='+l+'px,top='+t+'px,resizeable,scrollbars');
			})
			.appendTo(this);
		});		
	};

})(jQuery);