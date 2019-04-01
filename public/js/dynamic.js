$("#v").submit(function(e) {
  e.preventDefault();
  var t = $(this),
    msg = $("#msg");
  $.getJSON({
    url: "/validate/" + $("#nv").val(),
    beforeSend: function() {
      t.find("button").prop("disabled", true);
      msg.html(`<div class="spinner-border" role="status"></div>`);
    },
    success: function(d) {
      if (d.valid) {
        msg.html('<div class="alert alert-success">Number is Valid!</div>');
      } else {
        msg.html('<div class="alert alert-danger">Number is Invalid</div>');
      }
    },
    complete: function() {
      t.find("button").prop("disabled", false);
    }
  });
});
