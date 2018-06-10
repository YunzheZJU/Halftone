$('#submit').click(function () {
    if ($('#input_file')[0].files.length) {
        $('#upload-file').ajaxSubmit({
            url: "calculate",
            type: "post",
            enctype: 'multipart/form-data',
            success: function (data) {
                console.log(data);
                $('.img_to_match').removeClass("matched");
                $('#img_' + data).addClass("matched")
            },
            error: function () {
                console.log("Error");
            }
        })
    }
});