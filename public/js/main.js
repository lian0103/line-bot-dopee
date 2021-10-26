const domain = "";

$(document).ready(function () {
  $("#btnSend").on("click", function () {
    if (!$("#msgInput").val()) {
      console.log($("#msgInput").val());
      $("#sendError").text("請輸入訊息");
      return false;
    } else {
      $("#sendError").text("");
      let msg = $("#msgInput").val();
      let psw = $("#msgInputPsw").val();

      $.ajax({
        url: domain + `/broadcastAll/${psw}/${msg}`,
        method: "POST",
        dataType: "json",
        success: function (res) {
          console.log(res);
          $("#msgInput").val("");
          $("#msgInputPsw").val("")
          if(res.status != 200){
            $("#sendError").text(res.msg);
          }
        },
        error: function (err) {
          $("#sendError").text(err);
        },
      });
    }
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
