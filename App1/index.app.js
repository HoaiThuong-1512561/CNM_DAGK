
$("#btnSubmit").click(function() {
    var name = $('#name').val();
    var phone = $('#phone').val();
    var address = $('#address').val();
    var note = $('#note').val();

    axios.post('http://localhost:3000/app1/request', {
        name: name,
        phone: phone,
        address:address,
        note:note,
    })
        .then(function (response) {
            alert("thanhf cong");
        })
        .catch(function (error) {
            alert("looix");
        });

    // $.ajax({
    //     url: 'http://localhost:3000/app1/request',
    //     type: 'POST',
    //     dataType: 'json',
    //     timeout: 10000
    // })
    //     .fail(function () {
    //         var source = document.getElementById("fail-template").innerHTML;
    //         var template = Handlebars.compile(source);
    //         var html = template();
    //         var html2='<input type="text" class="form-control" >';
    //         $('#vietnam').html(html2);
    //         $('#fail').show();
    //         $('#fail').html(html);
    // })
    //     .done(function(data) {
    //     $.ajax({
    //         url: 'http://localhost:3000/translate/EnglishToVietnamese?english='+data.english,
    //         type: 'GET',
    //         dataType: 'json',
    //         timeout: 10000
    //     }).done(function(data2) {
    //         var source = document.getElementById("vietnamese-template").innerHTML;
    //         var template = Handlebars.compile(source);
    //         var html = template(data2);
    //          $('#vietnam').html(html);
    //          $('#fail').hide();
    //     })
    // })
});