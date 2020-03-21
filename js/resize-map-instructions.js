$(window).resize(() => {
  if ($(window).width() <= 667) {
    $('.map-instructions').html(`Click on a marker to view the request for help. You can also offer help 
    by posting on the discussion thread that pops up. Double click a marker to permanently remove it from 
    the map.`);
  } else {
    $('.map-instructions').html(`Click on a marker to view the request for help. You can also offer help<br>by
    posting on the discussion thread that pops up. Double click a<br>marker to permanently remove it from the
    map.`);
  }
});
