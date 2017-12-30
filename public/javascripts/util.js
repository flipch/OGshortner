var shouldUpload = false;
var compressed;
const imageCompressor = new ImageCompressor();

document.getElementById('file').addEventListener('change', (e) => {

  const file = e.target.files[0];

  if (!file) {
    return;
  }
  let loading = $('#loading');
  loading.show();

  new ImageCompressor(file, {
    quality: .7,
    maxWidth: 800,
    maxHeight: 800,
    convertSize: 5000000,
    success(result) {
      var reader = new window.FileReader();
      compressed = result;
      reader.readAsDataURL(result);
      reader.onloadend = function () {

        loading.hide();
        $('#image-preview').attr('src', reader.result);
        $('#image-preview').show();

        shouldUpload = true;
      }
    },
    error(e) {
      console.log(e.message);
    },
  });
})

function copyC() {
  var copyText = document.getElementById("copy");
  copyText.select();
  document.execCommand("Copy");
  alert("Copied the text: " + copyText.value);
}

function init() {
  $('#submitButton').click(submitButtonHandler);
  new Clipboard('#copy-button');
  $('#end').click(function () { location.reload() });
}

function urlExists(url) {
        var request = false;
        if (window.XMLHttpRequest) {
                request = new XMLHttpRequest;
        } else if (window.ActiveXObject) {
                request = new ActiveXObject("Microsoft.XMLHttp");
        }
        if (request) {
                request.open("GET", url);
                if (request.status == 200) { return true; }
        }

        return false;
}

function checkURL (abc) {
  var string = abc.value;
  if (!~string.indexOf("http")) {
    string = "http://" + string;
  }
  abc.value = string;
  return abc
}

function submitButtonHandler(evt) {
  var testForm = document.getElementById('usrform');

  //prevent form submission
  evt.preventDefault();
  evt.stopPropagation();

  var formD = new FormData(testForm);
  formD.set('pic', compressed); //Actually send the compressed img

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/fbshare", true);
  xhr.upload.addEventListener("progress", function (evt) {
    if (evt.lengthComputable) {
      var percentComplete = (evt.loaded / evt.total) * 100;
      if (percentComplete == 100)
        $('div.progress > div.progress-bar').text("All done =)");
      else
        $('div.progress > div.progress-bar').text(percentComplete.toFixed(2) + "/100");
      $('div.progress > div.progress-bar').css({ "width": percentComplete + "%" });
    }
  }, false);

  xhr.onload = function (e) {
    $('#modalB').append("<br>");
    $('#modalB').append("<a href='http://www.felipech.com/og/" + xhr.responseText + "'id='copy'>http://www.felipech.com/og/" + xhr.responseText + "</a>");
    $('#myModal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#reset').click();
  }
  xhr.send(formD);
}

function onError(img) {
  delete img.onerror;
  jQuery(img).hide();
}
function alsoClearImage() {
  $('#image-preview').attr('src', '');
  shouldUpload = false;
}

//init on document ready
$(document).ready(init);
