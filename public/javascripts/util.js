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
    quality: .6,
    success(result) {
      var reader = new window.FileReader();
      reader.readAsDataURL(result);
      reader.onloadend = function () {
        compressed = reader.result
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
      $('div.progress > div.progress-bar').text(percentComplete + "/100");
      $('div.progress > div.progress-bar').css({ "width": percentComplete + "%" });
    }
  }, false);

  xhr.onload = function (e) {
    let modal = $('#myModal');
    $('#modalB').append("<br>");
    $('#modalB').append("<a href='http://www.felipech.com/og/" + xhr.responseText + "'id='copy'>http://www.felipech.com/og/" + xhr.responseText + "</a>");
    modal.modal('toggle');
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
