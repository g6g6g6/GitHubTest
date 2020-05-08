var total = 20;
//カードの枚数
var speed = 150;
//カードをめくる速度
var returnSec = 1000;
//めくったカードが元に戻る秒数
var cat = [];
//各カードの番号を格納する配列
var index;
//クリックしたカードの並び順
var first = true;
//クリックしたカードが1枚目かどうかの判定用
var card1;
//1枚目に引いたカードの番号
var card2;
//2枚目に引いたカードの番号
var pair = 0;
//正解したカードのペア数
var imgClkCnt = 0;
//画像クリックした回数

//クリックできないようにカードをロック
function imgClickCount() {
    imgClkCnt++;
    $("#num_first").attr("src", "images/num" + Math.floor(imgClkCnt / 1) % 10 + ".png");
    $("#num_second").attr("src", "images/num" + Math.floor(imgClkCnt / 10) % 10 + ".png");
    $("#num_third").attr("src", "images/num" + Math.floor(imgClkCnt / 100) % 10 + ".png");
}

//カードを閉じる
function cardClose(i, n) {
    $("#card li:eq(" + i + ")").stop().animate({
        left: "75"
    }, speed);
    $("#card li:eq(" + i + ") img").stop().animate({
        width: "0",
        height: "200px"
    }, speed, function() {
        n(i);
    });
}
//表面を開く
function omoteOpen() {
    $("#card li:eq(" + index + ") img").attr("src", "images/card" + cat[index] + ".png");
    $("#card li:eq(" + index + ") img").stop().animate({
        width: "150px",
        height: "200px"
    }, speed);
    $("#card li:eq(" + index + ")").stop().animate({
        left: "0"
    }, speed);
}
//裏面を開く
function uraOpen(j) {
    $("#card li:eq(" + j + ") img").attr("src", "images/card.png");
    $("#card li:eq(" + j + ") img").stop().animate({
        width: "150px",
        height: "200px"
    }, speed);
    $("#card li:eq(" + j + ")").stop().animate({
        left: "0"
    }, speed);
}

//クリックできないようにカードをロック
function cardlock() {
    $("#card li:eq(" + index + ")").addClass("lock");
}
//全てのカードをロック
function alllock() {
    $("#card li").addClass("lock");
}
//全てのカードをアンロック
function unlock() {
    $("#card li").removeClass("lock");
}

//選んだ2枚のカードの正否
function comparison() {
    if (card1 == card2) {
        //2枚が同じカードであれば
        $("#card li:eq(" + index + ")").addClass("off");
        //2枚目のカードのクリック判定を無効に
        $("#card li:eq(" + index1 + ")").addClass("off");
        //1枚目のカードのクリック判定を無効に
        pair++;
        //ペア数を1増やす
        if (pair == total / 2) {
            //ペアが全て見つかったら
            setTimeout(function() {
                //最後のカードがめくられた後にクリアー表示
                alert("クリアー！")
            }, returnSec);
        }
    } else {
        //2枚が違うカードであれば
        setTimeout(function() {
            //returnSecミリ秒後（カードをめくる動作が終わった後）に
            cardClose(index, uraOpen);
            //2枚目のカードを裏面に戻す
            cardClose(index1, uraOpen);
            //1枚目のカードを裏面に戻す
        }, returnSec);
    }
    first = true;
    //1枚目かどうかの判定を有効に
    card2 = 0;
    //2枚目のカードの並び順をリセット
    setTimeout(function() {
        unlock();
        //全てのカードの.lockを削除
    }, returnSec + speed * 2);
}

$(function() {
    //カードの番号を配列に格納
    for (i = 1; i <= total / 2; i++) {
        cat.push(i, i);
    }
    //配列の中身をランダムに並び替え
    cat.sort(function() {
        return Math.random() - Math.random();
    });
    //カード画像の入ったliタグの生成
    for (i = 1; i <= total; i++) {
        $("#card").append("<li><img src='images/card.png'></li>");
    }

    $("#card li").click(function() {
        index = $("#card li").index(this);
        //選択したカードの順番をindexに保存
        cardlock();
        //選択したカードのクリックを無効にする関数
        cardClose(index, omoteOpen);
        //カードを閉じ、表面を開く関数

        imgClickCount();
        //クリックした回数をカウントする

        if (first == true) {
            //選択したカードが1枚目であれば
            index1 = index;
            //カードの順番をindex1に保存
            card1 = cat[index];
            //並び順を基に表面の番号を配列から取り出しcard1に保存
            first = false;
            //1枚目かどうかの判定を無効に

        } else {
            //選択したカードが2枚目であれば
            alllock();
            //全てのカードのクリックを無効にする関数
            card2 = cat[index];
            //並び順を基に表面の番号を配列から取り出しcard2に保存
            comparison();
            //card1とcard2を比べて正否の判定をする関数
        }
    });

});