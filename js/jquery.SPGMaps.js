/* ---------------------------------------------
 * jquery.SPGMaps.js
 * 下からニュッとGoogleMapを表示するライブラリ
 * Created By SUSH
 -------------------------------------------- */
var SPGMaps = {
	"win"	: $("<div>"),
	"size"	: new Object,
	"map"	: null,
	"flag"	: false,
	"address"	: null,
	"controller": new Array
};

/*
 * 初期設定
 **/
SPGMaps.init = function() {
	SPGMaps.flag = true;
	SPGMaps.win.css( {
		"position"	:"absolute",
		"top" : 0, "left" : 0,
		"background":"#fff",
		"width"		:"100%",
		"transition" : "transform 200ms ease-out",
		"-o-transition" : "-o-transform 200ms ease-out",
		"-ms-transition" : "-ms-transform 200ms ease-out",
		"-moz-transition" : "-moz-transform 200ms ease-out",
		"-webkit-transition" : "-webkit-transform 200ms ease-out"
	} );
}

/*
 * 住所からGoogleMapsの位置を指定する
 * address : マーカーの住所
 * option : GoogleMaps表示オプション
 **/
SPGMaps.startAddress = function( address, option ) {
	if(! SPGMaps.flag ) return false;
	else SPGMaps.flag = false;

	SPGMaps.viewWindow();
	if( SPGMaps.address != address ) {
		var iopt = {
			"zoom" : 19,
			"type" : google.maps.MapTypeId.ROADMAP,
			"marker": true
		};
		if(option) $.extend( iopt, option );
		
		SPGMaps.address = address;
		SPGMaps.map = null;
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode( { 'address': address }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var myOptions = {
					zoom: iopt.zoom,
					center: results[0].geometry.location,
					mapTypeId: iopt.type,
					navigationControl: true,
					navigationControlOptions: {
						style: google.maps.NavigationControlStyle.SMALL,
						position: google.maps.ControlPosition.LEFT_TOP
					}
				};
				SPGMaps.map = new google.maps.Map(SPGMaps.win.get(0), myOptions);
				
				if( iopt.marker ) {
					var marker = new google.maps.Marker({
						map: SPGMaps.map, 
						position: results[0].geometry.location
					});
				}
				
				SPGMaps.contorollerInit();
			} else {
				// alert("Geocode was not successful for the following reason: " + status);
			}
		});
	}
}

/*
 * 緯度・経度からGoogleMapsの位置を指定する
 * lat : 緯度
 * lng : 経度
 * option : GoogleMaps表示オプション
 **/
SPGMaps.startLatLng = function( lat, lng, option ) {
	if(! SPGMaps.flag ) return false;
	else SPGMaps.flag = false;
	
	var latlng = new google.maps.LatLng( lat, lng );
	if(! latlng ) return false;

	// ニュッと出す
	SPGMaps.viewWindow();

	// マップ表示オプション設定
	var iopt = {
		"zoom" : 19,
		"type" : google.maps.MapTypeId.ROADMAP,
		"marker": true
	};
	if(option) $.extend( iopt, option );
	
	SPGMaps.map = null;
	var myOptions = {
		zoom: iopt.zoom,
		center: latlng,
		mapTypeId: iopt.type,
		navigationControl: true,
		navigationControlOptions: {
			style: google.maps.NavigationControlStyle.SMALL,
			position: google.maps.ControlPosition.LEFT_TOP
		}
	};
	// GoogleMaps設定
	SPGMaps.map = new google.maps.Map(SPGMaps.win.get(0), myOptions);
	
	// マーカー表示
	// オプション markser がfalseの場合は非表示
	if( iopt.marker ) {
		var marker = new google.maps.Marker({
			map: SPGMaps.map, 
			position: latlng
		});
	}
	
	SPGMaps.contorollerInit();
}

/*
 * 下からニュッと表示する
 **/
SPGMaps.viewWindow = function() {
	SPGMaps.resize();
	SPGMaps.win.css( {
		"transform":"translate3d(0,"+SPGMaps.size.height+"px,0)",
		"-o-transform":"translate3d(0,"+SPGMaps.size.height+"px,0)",
		"-ms-transform":"translate3d(0,"+SPGMaps.size.height+"px,0)",
		"-moz-transform":"translate3d(0,"+SPGMaps.size.height+"px,0)",
		"-webkit-transform":"translate3d(0,"+SPGMaps.size.height+"px,0)"
	} );
	$("body").data( "overflow", $("body").css("overflow") ).css("overflow", "hidden").append( SPGMaps.win );

	$(window).bind( "resize", SPGMaps.resize );
	setTimeout( function() {
		SPGMaps.win.css( {
			"transform":"translate3d(0,0,0)",
			"-o-transform":"translate3d(0,0,0)",
			"-ms-transform":"translate3d(0,0,0)",
			"-moz-transform":"translate3d(0,0,0)",
			"-webkit-transform":"translate3d(0,0,0)"
		} );
	}, 1 );
}

/*
 * 下へニュッと隠す
 **/
SPGMaps.end = function() {
	SPGMaps.win.css( {
		"transform":"translate3d(0,"+SPGMaps.size.height+"px,0)",
		"-o-transform":"translate3d(0,"+SPGMaps.size.height+"px,0)",
		"-ms-transform":"translate3d(0,"+SPGMaps.size.height+"px,0)",
		"-moz-transform":"translate3d(0,"+SPGMaps.size.height+"px,0)",
		"-webkit-transform":"translate3d(0,"+SPGMaps.size.height+"px,0)"
	} );
	setTimeout( function() {
		SPGMaps.win.remove();
		SPGMaps.flag = true;
		$(window).unbind( "resize", SPGMaps.resize );
		$("body").css( "overflow", $("body").data("overflow") );
	}, 200 );
}

/*
 * ウィンドウ全面に合わせる
 **/
SPGMaps.resize = function() {
	$("body").scrollTop(0);
	SPGMaps.size = {
		"width":(window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth),
		"height":(window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight)
	};
	SPGMaps.win.css( {
		"height": SPGMaps.size.height
	} );
}

/*
 * ユーザーコントローラーを追加する
 * startAddress、startLatLngより前に記述する
 **/
SPGMaps.insertContoroller = function( controller, index, position ) {
	var result = $("<div>").get(0);
	var cotrol = new controller( result, SPGMaps.map );
	result.index = index;
	if( SPGMaps.map ) {
		return false;
	}
	SPGMaps.controller.push({
		"result"	: result,
		"position"	: position
	});
	return result;
}
/*
 * GoogleMaps生成後コントローラーを追加
 **/
SPGMaps.contorollerInit = function() {
	if( SPGMaps.controller.length ) {
		while( SPGMaps.controller.length ) {
			var c = SPGMaps.controller.shift();
			SPGMaps.map.controls[c.position].push( c.result );
		}
	} else {
		var SPGMapsClose = function( controlDiv, map ){
			var UI = $("<div>").css({
				"padding":"2px 5px",
				"border":"1px solid #666",
				"background":"#fff",
				"font":"12px/1.6 verdana"
			}).text("CLOSE");
			$(controlDiv).css("padding", "15px").append( UI );
			google.maps.event.addDomListener(UI.get(0), 'click', function() {
				SPGMaps.end();
			});
		}
		var wrap = $("<div>").get(0);
		var cotrol = new SPGMapsClose( wrap, SPGMaps.map );
		wrap.index = 1;
		SPGMaps.map.controls[ google.maps.ControlPosition.TOP_LEFT ].push( wrap );
	}
}

jQuery( function() {
	$(window).load( SPGMaps.init );
} );