var pc = document.getElementById("post-code");

pc.innerHTML =
  'var settings = {\n\t"url": "' +
  window.location.href +
  '",\n\t"method": "POST",\n\t"headers": {\n\t\t"Content-Type": "application/json"\n\t},\n\t"data": JSON.stringify({\n\t\t"json": { \n\t\t\t"message" : "This is awesome!" \n\t\t}\n\t}),\n};\n\n$.ajax(settings).done(function (response) {\n\tconsole.log(response);\n});';

$("#run-button").click(function () {
  var runbtn = document.getElementById("run-button");
  runbtn.disabled = true;
  runbtn.innerHTML =
    '<div class="spinner-border spinner-border-sm"></div> &nbsp; Running...';

  var settings = {
    url: window.location.href,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      json: { 
        "message" : "This is awesome!"
      },
    }),
  };

  $.ajax(settings).done(function (response, status, xhr) {
    console.log(response);
    if (status == "success") {
      document.getElementById("result").innerHTML =
        'Now you can run the GET request to retrive the data: <a class="fw-normal" href="' +
        window.location.href.split("#")[0] +
        "json/?otp=" +
        response.data.otp +
        '" target="_blank">' +
        window.location.href.split("#")[0] +
        "json/?otp=" +
        "<strong>" +
        response.data.otp +
        "</strong>" +
        "</a>";
      document.getElementById("result-json").innerHTML = JSON.stringify(
        response,
        null,
        2
      );
    } else {
      document.getElementById("result").innerHTML =
        "Failed to process the request. Reason: " + xhr.status;
    }

    var runbtn = document.getElementById("run-button");
    runbtn.disabled = false;
    runbtn.innerHTML = "Run script";

    Prism.highlightAll();
  });
});

$("#sendform").on("submit", function (e) {
  var msgbtn = document.getElementById("message-button");
  msgbtn.disabled = true;
  msgbtn.innerHTML =
    '<div class="spinner-border spinner-border-sm"></div> &nbsp; Sending...';

  var messageText = document.getElementById("quickmessage").value;
  if (messageText == "") {
    document.getElementById("quickmessage").className =
      "form-control is-invalid";

    var msgbtn = document.getElementById("message-button");
    msgbtn.disabled = false;
    msgbtn.innerHTML = "Send Message";
  } else {
    document.getElementById("quickmessage").className = "form-control";
    document.getElementById("quickmessage").value = "";

    var settings = {
      url: window.location.href,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        json: { "message" : window.btoa(messageText) },
      }),
    };

    $.ajax(settings).done(function (response, status, xhr) {
      console.log(response);

      if (status == "success") {
        var alert = document.createElement("div");
        alert.className = "alert alert-success alert-dismissible";
        alert.setAttribute("role", "alert");
        alert.innerHTML =
          "OTP: <strong>" +
          response.data.otp +
          "</strong>. Valid untill next 2 minutes." +
          '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
        document.getElementById("alertPlaceholder").append(alert);
      } else {
        var alert = document.createElement("div");
        alert.className = "alert alert-danger alert-dismissible";
        alert.setAttribute("role", "alert");
        alert.innerHTML =
          "Failed to send the message. Reason: " +
          xhr.status +
          '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
        document.getElementById("alertPlaceholder").append(alert);
      }
      var msgbtn = document.getElementById("message-button");
      msgbtn.disabled = false;
      msgbtn.innerHTML = "Send Message";
    });
  }

  //stop form submission
  e.preventDefault();
});

$("#fetchform").on("submit", function (e) {
  var fetchbtn = document.getElementById("fetch-button");
  fetchbtn.disabled = true;
  fetchbtn.innerHTML =
    '<div class="spinner-border spinner-border-sm"></div> &nbsp; Retrieving...';
  otp = document.getElementById("inputotp").value;

  if (!validateOTP(otp)) {
    document.getElementById("inputotp").className = "form-control is-invalid";

    fetchbtn.disabled = false;
    fetchbtn.innerHTML = "Fetch Message";
  } else {
    document.getElementById("inputotp").className = "form-control";
    document.getElementById("inputotp").value = "";
    var settings = {
      url: window.location.href.split("#")[0] + "json/?otp=" + otp,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    // console.log(settings);
    $.ajax(settings)
      .done(function (response, status, xhr) {
        console.log(response);

        var alert = document.createElement("div");
        alert.className = "alert alert-primary alert-dismissible";
        alert.setAttribute("role", "alert");
        alert.innerHTML =
          "Message:<br/> <pre>" +
          window.atob(response.json.message) +
          '</pre><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
        document.getElementById("messagePlaceholder").append(alert);

        fetchbtn.disabled = false;
        fetchbtn.innerHTML = "Fetch Message";
      })
      .fail(function (response, status, xhr) {
        var alert = document.createElement("div");
        alert.className = "alert alert-danger alert-dismissible";
        alert.setAttribute("role", "alert");
        alert.innerHTML =
          "Failed: " +
          response.responseJSON.error +
          '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
        document.getElementById("messagePlaceholder").append(alert);

        fetchbtn.disabled = false;
        fetchbtn.innerHTML = "Fetch Message";
      });
  }

  //stop form submission
  e.preventDefault();
});

function validateOTP(otp) {
  return RegExp(/^\d{4}$/).test(otp);
}
