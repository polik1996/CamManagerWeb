$(document).ready(function(){
    $("#content div").hide(); // Скрытое содержимое
    $("#tabs li:first").attr("id","current"); // Какой таб показать первым
    $("#content div:first").fadeIn(); // Показ первого контента таба
    $('#tabs a').click(function(e){
        e.preventDefault();
        $("#content div").hide(); //Скрыть всё содержимое
        $("#tabs li").attr("id",""); //Сброс идентификаторов
        $(this).parent().attr("id","current"); // Активация идентификаторов
        $('#' + $(this).attr('title')).fadeIn(); // Показать содержимое текущей вкладки
    });
})();