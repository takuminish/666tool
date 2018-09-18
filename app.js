$(function() {

    $('#number').on('keydown', function(e) {
        if (e.which == 13) {
        $('#button').trigger('click');
    }
    });

    $("#button").click( function () {
        result_text = [];
        akuma_view_init();
        number = $("#number").val();
        if(isNaN(number)){
            not_number();
            return ;
        }
        if (number < 0) {
            var chart_data = akuma_number_frequency(number*-1);
            chart_view(chart_data[0], chart_data[1], chart_data[2]);
        } else {
            var viewcode = akuma_number(number, result_text);
            view_check_img(viewcode, result_text);
        } 
    });
});

function akuma_number_frequency(number) {

    var data = [0,0,0];
    for (var k = 0; k <= number; k++) {
        var result = akuma_number(k, result_text);
        data[result]++;
    }
    return data;
}

function chart_view( num_other, num_6, num_666 ) {

    $("#result").append(' <canvas id="resultChart" style="height: 500px; width: 400px;"></canvas>');

    var ctx = document.getElementById("resultChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ["666","6","other"],
            datasets: [{
            backgroundColor: [
                "#2ecc71",
                "#3498db",
                "#95a5a6",
            ],
            data: [num_666,num_6,num_other]
            }]
        }
    });
}


function add_1(number, result_text,c) {

    var num = [];
    if (parseInt(number/10) == 0 && (number != 6 || number != 9)) {return 0;}

    num = numarray_split(number);
    sum = num.reduce((s, n) => s + n, 0);
    result_text[c] = array_value_text(num, sum,"+");
    
    var check = check_akumanumber(sum, result_text);
    if ( check != 0 ) {return check;}

    var result = add_1(sum, result_text,c+1);
    if ( result != 0 ) {return result;} else {result_text.splice(c, 1);}
    
    var result = mult_1(sum, result_text,c+1);
    if ( result != 0 ) {return result;} else {result_text.splice(c, 1);}

    return 0;
}

function mult_1(number, result_text,c) {

    var num = [];
    if (parseInt(number/10) == 0 && (number != 6 || number != 9)) {return 0;}

    num = numarray_split(number);
    sum = num.reduce((s, n) => s * n, 1);
    result_text[c] = array_value_text(num, sum,"×");
    
    var check = check_akumanumber(sum, result_text);
    if ( check != 0 ) {return check;}
    
    var result = add_1(sum, result_text,c+1);
    if ( result != 0 ) {return result;} else {result_text.splice(c, 1);}
    
    var result = mult_1(sum, result_text,c+1);
    if ( result != 0 ) {return result;} else {result_text.splice(c, 1);}

    return 0;
}

function numarray_split(number) {

    var num = [];
    var k = 0;
    while(parseInt(number) > 0 ) {
        num[k] = number % 10;
        number = parseInt(number/10);
        k++;
    }
    num.reverse();
    return num;
}

function array_value_text(number,sum,operator) {
    var sum_text = "<h2 style='text-align: center'>" + number[0];
    for (var k = 1; k < number.length; k++) {
        sum_text += operator;
        sum_text += number[k];
    }
    sum_text += " = " + sum;
    sum_text += "</h2>";
    return sum_text;
}

function akuma_number(number, result_text) {
    
    var check = check_akumanumber(number, result_text);

    if ( check != 0 ) {return check;}
    var result = add_1(number, result_text,0);
    if ( result != 0 ) {return result;} 
    var result = mult_1(number, result_text,0);
    if ( result != 0 ) {return result;} 
    return 0;
}

function not_number() {
    view_h2_text("数字以外はいれちゃだめってこと。");
    view_img("./element/isNuN.jpg", 240,380);
}

function akuma_view_init() {
    $("#result").remove();
    $("#akuma-view").append('<div id="result"></div>');
}

function view_img(src, width, height) {
    var result = $("#result");
    var img = new Image(width,height);
    img.src = src;
    $("#result").append(img).css("text-align","center");

    
}

function view_check_img(view_code, result_text) {

    if (view_code == 1) {
        view_result(result_text, "./element/6.jpg", "悪魔の数字");
    } else if (view_code){
        view_result(result_text, "./element/666.jpg", "悪魔の数字 フリーメイソン!!");
    }
}

function view_result(result_text, img, h2_text) {
    view_result_text(result_text);
    view_h2_text(h2_text);
    view_img(img,420,240);
}

function view_h2_text(text) {
    $("#result").append('<h2 style="text-align: center;">'+text+'</h2>');
}

function check_akumanumber(number, result_text) {

    number = check_extra_akumanumber(number, result_text);
    number = check_reverse_akumanumber(number,result_text);

    if (number == 6) {
        return 1;
    } else if (number == 666) {
        return 2;
    } else {
        return 0;
    }
}

function view_result_text(result_text) {

    for (var k = 0; k < result_text.length; k++) {
        view_h2_text(result_text[k]);
        view_h2_text("↓");
    }
}

function check_reverse_akumanumber(number,result_text) {

    if (number == 9) {
        result_text.push("9を反転させると6");
        return 6;
    } else if (number == 999) {
        result_text.push("999を反転させると666");
        return 666;
    }
    return number;
}

function check_extra_akumanumber(number, result_text) {
    if (number == 18) {
        result_text.push("18は6 + 6 + 6");
        return 666;
    } else if (number == 27) {
        result_text.push("27は9 + 9 + 9");
        return 999;
    }
    return number;
}

