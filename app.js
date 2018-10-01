//====================================================================
// window.load
//====================================================================
$(function() {


    //----------------------------------------------------------------
    // textboxでEnterキーを押すことで、クリックイベント発火
    //----------------------------------------------------------------
    $('#number').on('keydown', function(e) {

        if (e.which == 13) {
        $('#button').trigger('click');
    }
    });

    //----------------------------------------------------------------
    // 変換ボタンを押すことで、悪魔の数字変換開始
    //----------------------------------------------------------------
    $("#button").click( function () {

        line_x = [];
        line_y_6 = [];
        line_y_666 = [];
        result_text = [];
        akuma_view_init();  // 結果表示要素を初期化
        number = $("#number").val(); // textboxの値を取得
        if(isNaN(number)){ // 値が数値がどうか
            not_number(); // 数値でないなら警告を表示
            return ;
        }
        if (number < 0) { // 数値が負数かどうか
            var chart_data = akuma_number_frequency(number*-1,line_x,line_y_6, line_y_666); // 0からnumberまでの悪魔の数字の頻度を求める
            pie_chart_view(chart_data[0], chart_data[1], chart_data[2]); // 円グラフとして表示
            line_chart_view(line_x,line_y_6, line_y_666);
        } else { 
            var viewcode = akuma_number(number, result_text); // 悪魔の数字に変換
            view_check_img(viewcode, result_text); // 結果を表示
        } 
    });
});

//--------------------------------------------------------------------
// 結果表示のdiv要素を初期化
//--------------------------------------------------------------------
function akuma_view_init() {

    $("#result").remove();
    $("#pie_chart_result").remove();
    $("#line_chart_result").remove();
    $("#akuma-view").append('<div id="result"></div>');
    $("#akuma-chart").append('<div id="pie_chart_result" style="width: 490px; float: left;"></div>');
    $("#akuma-chart").append('<div id="line_chart_result" style="width: 490px; float: right;"></div>');
}

//--------------------------------------------------------------------
// 数字以外が入力されたときの処理
//--------------------------------------------------------------------
function not_number() {

    view_h2_text("数字以外はいれちゃだめってこと。");
    view_img("./element/isNuN.jpg", 240,380);
}

//====================================================================
// textboxに負数が入力されたとき悪魔の数字の頻度を円グラフで表示
//====================================================================

//--------------------------------------------------------------------
// 6と666とそれ以外の頻度を0~numberの間で求める
//--------------------------------------------------------------------
function akuma_number_frequency(number, x, y_6, y_666) {

    var data = [0,0,0];
    var dx = parseInt(number / 10);
    var count_6 = 0;
    var count_666 = 0;
    var count2 = 0;
    y_6.push(0);
    y_666.push(0);
    x.push(0);

    for (var k = 1; k <= number; k++) {
        var result = akuma_number(k, result_text);
        data[result]++;
        if (result == 1) {
            count_6++;
        } else if (result == 2) {
            count_666++;
        }
        if ((k % dx) == 0 ) {
            count2++;
            y_6.push(count_6);
            y_666.push(count_666);
            x.push(count2*dx);
        }
    }

    if ((number % 10) != 0 ) {
        y_6.push(count_6);
        y_666.push(count_666);
        x.push(number);
    }

    return data;
}
//--------------------------------------------------------------------
// 6と666とそれ以外の頻度を円グラフとして表示
//--------------------------------------------------------------------
function pie_chart_view( num_other, num_6, num_666 ) {

    $("#pie_chart_result").append(' <canvas id="pieChart"></canvas>');

    var ctx = document.getElementById("pieChart").getContext('2d');
    ctx.canvas.height = 245;
    ctx.canvas.width = 490;
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ["6","666","other"],
            datasets: [{
            backgroundColor: [
                "yellow",
                "purple",
                "#404040",
            ],
            data: [num_6,num_666,num_other]
            }]
        },
        options: {
            responsive: false,
	    legend: {
		labels: {
		    fontColor: "white"
		}
	    }
        }
    });
}

//--------------------------------------------------------------------
// 悪魔の数字の推移を折れ線グラフとして表示
//--------------------------------------------------------------------
function line_chart_view( x,y_6, y_666) {

    $("#line_chart_result").append(' <canvas id="lineChart" class="well"></canvas>');

    var ctx = document.getElementById("lineChart").getContext('2d');
    ctx.canvas.height = 245;
    ctx.canvas.width = 490;
    var myChart = new Chart(ctx, {
	type: 'line',
	data: {
	    labels: x,
	    datasets: [{
		label: "6",
		borderColor: "yellow",
		fill: false,
		backgroundColor: "yellow",
		data: y_6
	    },{
		label: "666",
		borderColor: "purple",
		fill: false,
		backgroundColor: "purple",
		data: y_666
	    }]
	},
	options: {
	    responsive: false,
	    scales: {
		xAxes: [{
		    gridLines: {
			color: 'white'
		    },
		    ticks: {
			fontColor: "white"
		    }
		}],
		yAxes: [{
		    gridLines: {
			color: 'white'
		    },
		    ticks: {
			fontColor: "white"
		    }
		}]
	    },
	    legend: {
		labels: {
		    fontColor: "white"
		}
	    }
	}
    });
}


//====================================================================
// textboxに正数が入力されたとき
//====================================================================

//--------------------------------------------------------------------
// 入力された数字をなんとか悪魔の数字にする
//--------------------------------------------------------------------
function akuma_number(number, result_text) {
    
    var check = check_akumanumber(number, result_text);  // 悪魔の数字かどうかチェック

    if ( check != 0 ) {return check;}
    var result = add_1(number, result_text,0);  // 処理1 すべて加算
    if ( result != 0 ) {return result;}  
    var result = mult_1(number, result_text,0); // 処理2 すべて乗算 
    if ( result != 0 ) {return result;} 
    return 0;
}

//--------------------------------------------------------------------
// 数字を1桁ずつ分解し、すべて足す (mult_1と相互再帰)
//--------------------------------------------------------------------
function add_1(number, result_text,c) {

    var num = [];
    if (parseInt(number/10) == 0 && (number != 6 || number != 9)) {return 0;} // 1桁になって悪魔の数字じゃなければ失敗

    num = numarray_split(number);  // 数値を1桁ずつ分解
    sum = num.reduce((s, n) => s + n, 0); // すべて加算
    result_text[c] = array_value_text(num, sum,"+"); // 計算過程の文字列を作成
    
    var check = check_akumanumber(sum, result_text);  // 悪魔の数字かどうかチェック
    if ( check != 0 ) {return check;}  // 悪魔の数字なら終了

    var result = add_1(sum, result_text,c+1);  // 処理1を実行(再帰)
    if ( result != 0 ) {return result;} else {result_text.splice(c, 1);}
    
    var result = mult_1(sum, result_text,c+1); // 処理2を実行(相互再帰)
    if ( result != 0 ) {return result;} else {result_text.splice(c, 1);}

    return 0;
}

//--------------------------------------------------------------------
// 数字を1桁ずつ分解し、すべてかける (add_1と相互再帰)
//--------------------------------------------------------------------
function mult_1(number, result_text,c) {

    var num = [];
    if (parseInt(number/10) == 0 && (number != 6 || number != 9)) {return 0;}  // 1桁になって悪魔の数字じゃなければ失敗

    num = numarray_split(number); // 数値を1桁ずつ分解
    sum = num.reduce((s, n) => s * n, 1); // すべて乗算
    result_text[c] = array_value_text(num, sum,"×"); // 計算過程の文字列を作成
    
    var check = check_akumanumber(sum, result_text); // 悪魔の数字かどうかチェック
    if ( check != 0 ) {return check;} // 悪魔の数字なら終了
    
    var result = add_1(sum, result_text,c+1); // 処理1を実行(相互再帰)
    if ( result != 0 ) {return result;} else {result_text.splice(c, 1);}
    
    var result = mult_1(sum, result_text,c+1); // 処理2を実行(再帰)
    if ( result != 0 ) {return result;} else {result_text.splice(c, 1);}

    return 0;
}

//--------------------------------------------------------------------
// 数字を1桁ずつ分解する
//--------------------------------------------------------------------
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

//--------------------------------------------------------------------
// 悪魔の数字になっているかチェック
//--------------------------------------------------------------------
function check_akumanumber(number, result_text) {

    number = check_extra_akumanumber(number, result_text);  // 18を666、27を999に変換
    number = check_reverse_akumanumber(number,result_text); // 9を6、999を666に変換

    if (number == 6) { // 悪魔の数字かどうか
        return 1;
    } else if (number == 666) {
        return 2;
    } else {
        return 0;
    }
}

//--------------------------------------------------------------------
// 18を666、27を999として扱う
//--------------------------------------------------------------------
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

//--------------------------------------------------------------------
// 9を6、999を666として扱う
//--------------------------------------------------------------------
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

//--------------------------------------------------------------------
// 計算過程をh2タグとして、登録する
//--------------------------------------------------------------------
function array_value_text(number,sum,operator) {

    var sum_text = number[0];
    for (var k = 1; k < number.length; k++) {
        sum_text += operator;
        sum_text += number[k];
    }
    sum_text += " = " + sum;
    return sum_text;
}

//--------------------------------------------------------------------
// 計算結果が6か666かによって表示を変える
//--------------------------------------------------------------------
function view_check_img(view_code, result_text) {

    if (view_code == 1) {
        view_result(result_text, "./element/6.jpg", "悪魔の数字");
    } else if (view_code){
        view_result(result_text, "./element/666.jpg", "悪魔の数字 フリーメイソン!!");
    }
}

//--------------------------------------------------------------------
// 計算結果を表示する
//--------------------------------------------------------------------
function view_result(result_text, img, h2_text) {
    view_result_text(result_text);
    view_h2_text(h2_text);
    view_img(img,420,240);
}

//--------------------------------------------------------------------
// 計算過程をすべて表示する
//--------------------------------------------------------------------
function view_result_text(result_text) {

    for (var k = 0; k < result_text.length; k++) {
        view_h2_text(result_text[k]);
        view_h2_text("↓");
    }
}

//--------------------------------------------------------------------
// h2タグを表示する
//--------------------------------------------------------------------
function view_h2_text(text) {
    $("#result").append('<h2 style="text-align: center; color: white;">'+text+'</h2>');
}

//--------------------------------------------------------------------
// 画像を表示する
//--------------------------------------------------------------------
function view_img(src, width, height) {

    var result = $("#result");
    var img = new Image(width,height);
    img.src = src;
    $("#result").append(img).css("text-align","center");
}

