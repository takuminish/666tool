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
        if(!isNaN(number)){
            if (number < 0) {
                chart_view();
            } else {
              akuma_number(number, result_text);
            }
          } else {
              not_number();
          }
    });
});

function chart_view( num_666, num_6, num_other ) {

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
    console.log("a : "+ c);
    if (parseInt(number/10) == 0 && (number != 6 || number != 9)) {return 0;}

    num = numarray_split(number);
    sum = num.reduce((s, n) => s + n, 0);
    result_text[c] = array_value_text(num, sum,"+");
    
    if ( check_akumanumber(sum, result_text) != 0 ) {return -1;};
    if ( add_1(sum, result_text,c+1) == -1 ) {return -1;} else {result_text.splice(c, 1);}
    if ( mult_1(sum,result_text,c+1) == -1 ) {return -1;} else {result_text.splice(c, 1);}
}

function mult_1(number, result_text,c) {

    var num = [];
    console.log("b : "+ c);
    if (parseInt(number/10) == 0 && (number != 6 || number != 9)) {return 0;}

    num = numarray_split(number);
    sum = num.reduce((s, n) => s * n, 1);
    
    result_text[c] = array_value_text(num, sum,"×");
    if ( check_akumanumber(sum, result_text) != 0 ) {return -1;};
    if ( add_1(sum, result_text,c+1) == -1 ) {return -1;} else {result_text.splice(c, 1);}
    if ( mult_1(sum,result_text,c+1) == -1 ) {return -1;} else {result_text.splice(c, 1);}
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
    
    if (check_akumanumber(number, result_text) != 0) { return -1;}
    if ( add_1(number, result_text,0) == -1 ) {return -1;}
    if ( mult_1(number,result_text,0) == -1 ) {return -1;}
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

function view_h2_text(text) {
    $("#result").append('<h2 style="text-align: center;">'+text+'</h2>');
}

function check_akumanumber(number, result_text) {

    number = check_extra_akumanumber(number, result_text);
    number = check_reverse_akumanumber(number,result_text);

    if (number == 6) {
        view_result_text(result_text);
        view_h2_text("悪魔の数字");
        view_img("./element/6.jpg",420,240);
        return 1;
    } else if (number == 666) {
        view_result_text(result_text);
        view_h2_text("悪魔の数字 フリーメイソン!!");
        view_img("./element/666.jpg",420,240);
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

