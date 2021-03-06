$(function() {
  var crs25831 = new L.Proj.CRS('EPSG:25831','+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
     {
          resolutions: [1100, 550, 275, 100, 50, 25, 10, 5, 2, 1, 0.5, 0.25]
     }
  );

  var initPoint = [41.6480, 2.7712];
  var initZoom = 11;
  var maxZoom = 11;
  var map = L.map('mapid',{crs: crs25831, attributionControl: false, maxZoom: maxZoom, center: initPoint, zoom: initZoom});
  var map1 = L.map('mapid1',{crs: crs25831, attributionControl: false, maxZoom: maxZoom, center: initPoint, zoom: initZoom});
  var map2 = L.map('mapid2',{crs: crs25831, attributionControl: false, maxZoom: maxZoom, center: initPoint, zoom: initZoom});

  var servicio1 = 'http://mapcache.icc.cat/map/bases/service?';
  var layer1 = 'orto';
  var attribution1 = 'Mapa &copy; <a href="http://www.icgc.cat">Institut Cartogràfic i Geològic de Catalunya</a>';

  var servicio2 = 'http://mapcache.icc.cat/map/costa/service/service?';
  var layer2 = 'costa2701';
  var attribution2 = 'Mapa &copy; <a href="http://www.icgc.cat">Institut Cartogràfic i Geològic de Catalunya</a>';

  var myLayer1 = L.tileLayer.wms(servicio1, {
    layers: layer1,
    format: 'image/jpeg',
    transparent: true,
    crs: crs25831,
    attribution : attribution1,
});

  var myLayer2 = L.tileLayer.wms(servicio2, {
    layers: layer2,
    format: 'image/jpeg',
    transparent: true,
    crs: crs25831,
    attribution : attribution2,
});

  var myLayer3 = L.tileLayer.wms(servicio1, {
    layers: layer1,
    format: 'image/jpeg',
    transparent: true,
    attribution : attribution1,
});

  var myLayer4 = L.tileLayer.wms(servicio2, {
    layers: layer2,
    format: 'image/jpeg',
    transparent: true,
    crs: crs25831,
    attribution : attribution2,
});

  map.addLayer(myLayer1);
  map.addLayer(myLayer2);

  map1.addLayer(myLayer3);
  map2.addLayer(myLayer4);

  L.control.sideBySide(myLayer1, myLayer2).addTo(map);

  map1.sync(map2);
  map2.sync(map1);

  var hash = new L.Hash(map);
  var hash2 = new L.Hash(map1);

  $('#mapid').hide();

  $('.btn-sticky button').on('click',function(){
    $('.panel-sticky').show();
  });

  $('.btn-sync').on('click',function(){
    $('#mapid').hide();
    $('#mapid1').show();
    $('#mapid2').show();
    $('.panel-sticky').hide();
    map1.invalidateSize();
    map2.invalidateSize();
  });

  $('.btn-sidebyside').on('click',function(){
    $('#mapid').show();
    $('#mapid1').hide();
    $('#mapid2').hide();
    map.invalidateSize();
    $('.panel-sticky').hide();
  });

  $('.list-booksmarks').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
    var selectedD = $(this).find('option').eq(clickedIndex).val();
    var center = hash.parseHash(selectedD);
    map.setView(center.center, center.zoom);
  });

  var features = bookmarks.features;

  function compare(a,b) {
    if (a.properties.NOM < b.properties.NOM)
      return -1;
    if (a.properties.NOM > b.properties.NOM)
      return 1;
    return 0;
  }

  features.sort(compare);

  var list = "";
  for(var i = 0, length = features.length; i < length; i++){
    var feature = features[i];
    list += "<option value='#11/"+feature.geometry.coordinates[1]+"/"+feature.geometry.coordinates[0]+"'>"+feature.properties.NOM+"</option>"
  }
  $('.list-booksmarks').append(list);

  $('.list-booksmarks').removeClass('hide');

  $('.list-booksmarks').selectpicker('refresh');

  $('.info-btn').on('click',function(){
    $('#infomodal').modal('show');
  });

  $('.enllaca').on('click',function(){
    var currentURL = window.location;
    $('#urlMap').val(currentURL);
    var iframecode = '<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="'+currentURL+'" ></iframe>';
    $('#iframeMap').html(iframecode);
    $('#enllacamodal').modal('show');
  });

  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $("#share").jsSocials({
      showLabel: false,
      showCount: false,
      shares: ["email", "twitter", "facebook", "googleplus", "pinterest", "whatsapp"]
    });
  }else{
    $("#share").jsSocials({
      showLabel: false,
      showCount: false,
      shares: ["email", "twitter", "facebook", "googleplus", "pinterest"]
    });
  }

  $(document).hotkeys('alt+ctrl+j', 'alt+ctrl+m', function(){
    $('#alertmodal .alertmodal-body').html("Aquesta és l'última aplicació publicada amb Jaume Miranda com a director de l'Institut Cartogràfic i Geològic de Catalunya<br><br><i>tempus fugit</i>");
    $('#alertmodal').modal('show');
  });

});
