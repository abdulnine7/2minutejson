var pc = document.getElementById("post-code");

pc.innerHTML =
  'var settings = {\n\t"url": "' +
  window.location.href +
  '",\n\t"method": "POST",\n\t"headers": {\n\t\t"Content-Type": "application/json"\n\t},\n\t"data": JSON.stringify({\n\t\t"json": \'{ "message" : "This is awesome!" }\'\n\t}),\n};\n\n$.ajax(settings).done(function (response) {\n\tconsole.log(response);\n});';

function postRun() {
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
      json: '{ "message" : "This is awesome!" }',
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
}
