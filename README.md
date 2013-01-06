# 下からニュッとGoogleマップを表示するライブラリ

スマートフォン向けのGoogleマップ表示用ライブラリ。  
表示領域を極力邪魔しないように、ボタンクリックで下からニュッとGoogleマップが表示します。

## デモ

[jquery.SPGMaps.jsデモ](http://demo.sus-happy.net/javascript/SPGMaps/)

## 利用方法
中心点を座標で指定する

    SPGMaps.startLatLng(35.171388,136.881623);

中心点を住所で指定する

    SPGMaps.startAddress("愛知県名古屋市中村区名駅1-1-4");

ユーザコントローラを追加する（左上に閉じるボタンを追加する）

    // 「startLatLng」「startAddress」を実行する前に呼び出す必要があります。
    var SPGMapsClose = function( controlDiv, map ){
      var controlUI = $("<div>").css({"padding":"15px"}).text("閉じる");
    	$(controlDiv).append( controlUI );
    	google.maps.event.addDomListener(controlUI.get(0), 'click', function() {
    		SPGMaps.end();
    	});
    }
    SPGMaps.insertContoroller( SPGMapsClose, 1, google.maps.ControlPosition.TOP_LEFT );
    SPGMaps.startLatLng(35.171388,136.881623);
