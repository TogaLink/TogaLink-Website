$(window).resize(() => {
  if ($(window).width() <= 667) {
    $('.map-instructions').html(`<b><em>Need something? </em></b> Fill out the form under the
    map to add a marker.<br><br>
    <b><em>Want to help?</em></b> Click on a marker to view the request for help. You <br>can offer help by
    logging into Disqus and posting on the<br>discussion thread that pops up.
    <br><br><b><em>Want to delete a marker?</em></b> Double click a marker to permanently<br>remove it from
    the
    map.`);
  } else {
    $('.map-instructions').html(`<b><em>Need something? </em></b> Fill out the form under the
    map to add a marker.<br><br>
    <b><em>Want to help?</em></b> Click on a marker to view the request for help. You <br>can offer help by
    logging into Disqus and posting on the<br>discussion thread that pops up.
    <br><br><b><em>Want to delete a marker?</em></b> Double click a marker to permanently<br>remove it from
    the
    map.`);
  }
});
