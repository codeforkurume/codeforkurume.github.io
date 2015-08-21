/**
 * Created by minto on 15/08/19.
 */

var Search = new Object();

/**
 * textからAreaModelを持ってくる(nameとの完全一致)
 * textと一致するものが無ければnullを返す
 */
Search.getMatchArea = function(text){
    var return_value = null;
    function searchMatchName(area){
        if(area.name==text){
            return_value = area;
        }
    }

    var data = AreaModel.data;
    data.forEach(searchMatchName);
    return return_value;
};

/**
 * textから検索補完の候補を取得する
 * return AreaModel
 */
Search.getCandidate = function(text){
    var return_area = [];
    if(text.length==0){
        return return_area;
    }
    function pushCandidate(area){
        if(area.name.indexOf(text)!=-1 || area.furigana.indexOf(text)!=-1){
            return_area.push(area);
        }
    }

    AreaModel.data.forEach(pushCandidate);
    return return_area;
};

/**
 * Selectの中のCandidateを更新する
 */
Search.changeSelectCandidate = function(areas){
    var select = $("#candidates");

    function pushDiv(div, text){
        var div = $(
            "<div></div>",
            {
                text: text,
                "class": "candidate"
            }
        );
        select.append(div);
    }

    select.empty();
    //候補を追加
    var children = select.children();
    var length = Math.min(MaxCandidateNum, areas.length);
    for(var i=0;i<length;i++){
        pushDiv(children[i], areas[i].name);
    }
    $(".candidate").click(Search.changeSelect);
};

/**
 * 検索用のinputが変更されたときの処理。
 */
Search.updateInput = function(){
    var input = $("#input_area");
    var area = Search.getMatchArea(input.val());

    if(area!=null){
        var area_master = AreaMasterModel.data[area.mastercode-1];
        Event.getInstance().$emit("updateArea", area_master, area);
        input.val("");
    }

    var area_candidate = Search.getCandidate(input.val());
    Search.changeSelectCandidate(area_candidate);
    $("#search-result-num").text("検索結果"+area_candidate.length+"件");
};

Search.changeSelect = function(e){
    var area_name = $(e.target).text();
    var input_area = $("#input_area");
    input_area.val(area_name);
    Search.updateInput();
};

$("#input_area").keyup(Search.updateInput);
