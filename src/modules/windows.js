//
// Windows
//

(function(){

function formatUser(o){
	if(o.id){
		o.email = (o.emails?o.emails.preferred:null);
		o.picture = 'https://apis.live.net/v5.0/'+o.id+'/picture?access_token='+hello.getAuthResponse('windows').access_token;
		o.thumbnail = 'https://apis.live.net/v5.0/'+o.id+'/picture?access_token='+hello.getAuthResponse('windows').access_token;
	}
}

function formatFriends(o){
	if("data" in o){
		for(var i=0;i<o.data.length;i++){
			formatUser(o.data[i]);
		}
	}
	return o;
}

hello.init({
	windows : {
		name : 'Windows live',

		uri : {
			// REF: http://msdn.microsoft.com/en-us/library/hh243641.aspx
			auth : 'https://login.live.com/oauth20_authorize.srf',
			base : 'https://apis.live.net/v5.0/',

			// Friends
			"me/friends" : "me/friends",
			"me/following" : "me/friends",
			"me/followers" : "me/friends",

			"me/share" : function(p,callback){
				// If this is a POST them return
				callback( p.method==='get' ? "me/feed" : "me/share" );
			},
			"me/feed" : function(p,callback){
				// If this is a POST them return
				callback( p.method==='get' ? "me/feed" : "me/share" );
			},
			"me/files" : 'me/skydrive/files'
		},
		scope : {
			basic			: 'wl.signin,wl.basic',
			email			: 'wl.emails',
			birthday		: 'wl.birthday',
			events			: 'wl.calendars',
			photos			: 'wl.photos',
			videos			: 'wl.photos',
			friends			: '',
			files			: 'wl.skydrive',
			
			publish			: 'wl.share',
			publish_files	: 'wl.skydrive_update',
			create_event	: 'wl.calendars_update,wl.events_create',

			offline_access	: 'wl.offline_access'
		},
		wrap : {
			me : function(o){
				formatUser(o);
				return o;
			},
			'me/friends' : formatFriends,
			'me/followers' : formatFriends,
			'me/following' : formatFriends,
			'me/albums' : function(o){
				if("data" in o){
					for(var i=0;i<o.data.length;i++){
						o.data[i].photos = 'https://apis.live.net/v5.0/'+o.data[i].id+'/photos';
						o.data[i].files = 'https://apis.live.net/v5.0/'+o.data[i].id+'/photos';
					}
				}
				return o;
			},
			'default' : function(o){
				if("data" in o){
					for(var i=0;i<o.data.length;i++){
						if(o.data[i].picture){
							o.data[i].thumbnail = o.data[i].picture;
						}
					}
				}
				return o;
			}
		},
		xhr : false,
		jsonp : function(p){
			if( p.method.toLowerCase() !== 'get' && !hello.utils.hasBinary(p.data) ){
				//p.data = {data: JSON.stringify(p.data), method: p.method.toLowerCase()};
				p.data.method = p.method.toLowerCase();
				p.method = 'get';
			}
		}
	}
});

})();