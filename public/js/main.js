const domain = "";

$(document).ready(function () {
  let imgFile = null;

  $("#fileInput").on("change", function () {
    imgFile = $("#fileInput").prop("files")[0];

    if (imgFile) {
      $('#imgboxNextSvg').hide();
      $("#imgbox").empty();
      let src = URL.createObjectURL(imgFile);
      let imgTemp = `<p class="text-gray-700">名稱:${imgFile.name}</p> <img class='' src=${src} />`;
      $("#imgbox").append(imgTemp);
    }
  });

  $("#btnSend").on("click", async function () {
    if (!$("#msgInput").val()) {
      $("#sendError").text("請輸入訊息");
      return false;
    }

    if (!$("#msgInputPsw").val()) {
      $("#sendError").text("請輸入密碼");
      return false;
    }

    let imgUploadInfo = null;
    if (imgFile) {
      await new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append("imgFile", imgFile);

        $.ajax({
          url: domain + `/images/upload`,
          data: formData,
          processData: false,
          contentType: false,
          type: "POST",
          success: function (data) {
            console.log(data);
            imgUploadInfo = data.imgUploadInfo;
            resolve(true);
          },
          error: function (err) {
            reject(err);
          },
        });
      });
    }

    $("#sendError").text("");
    let msg = encodeURIComponent($("#msgInput").val());
    let psw = encodeURIComponent($("#msgInputPsw").val());

    let url = imgUploadInfo
      ? domain + `/broadcastAll/${psw}/${msg}/${imgUploadInfo.filename}`
      : domain + `/broadcastAll/${psw}/${msg}`;

    $.ajax({
      url,
      method: "POST",
      dataType: "json",
      success: function (res) {
        console.log(res);
        $("#msgInput").val("");
        $("#msgInputPsw").val("");
        imgFile = null;
        $("#imgbox").empty();
        $('#imgboxNextSvg').show();
        if (res.status != 200) {
          $("#sendError").text(res.msg);
        }
      },
      error: function (err) {
        $("#sendError").text(err);
      },
    });
  });

  $("#btnQuery").on("click", function () {
    $.ajax({
      url: domain + "/queryTodayMsgRecord",
      method: "GET",
      dataType: "json",
      success: function (res) {
        // console.log(res);
        $("#todayMsgBox").empty();

        let temp = "<ul>";
        res
          .filter((item) => item.msg && item.msg != "null")
          .forEach((item) => {
            temp += `<li class="pb-2">傳送人: <span class="font-bold"> ${
              item.name
            } </span> <p>
            訊息: <span class="font-bold">${item.msg}  </span>
            </p>  <p class="text-right"> ${moment(item.updated).format(
              "YYYY-MM-DD hh:mm:ss "
            )}</p> </li>`;
          });
        temp += "</ul>";
        $("#todayMsgBox").append(temp);
      },
      error: function (err) {
        $("#todayMsgBox").empty();
        $("#todayMsgBox").append("" + err);
      },
    });
  });

  $("#btnQuery").click();
});
