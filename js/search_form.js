/**
 * Created by minto on 15/08/19.
 */

var Search = new Object();

/**
 * text‚©‚çAreaModel‚ğ‚Á‚Ä‚­‚é(name‚Æ‚ÌŠ®‘Sˆê’v)
 * text‚Æˆê’v‚·‚é‚à‚Ì‚ª–³‚¯‚ê‚Înull‚ğ•Ô‚·
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

Search.updateInput = function(){
    var input = $("#input_area").val();
    var area = Search.getMatchArea(input);

    if(area!=null){
        var area_master = AreaMasterModel.data[area.mastercode-1];
        console.log(area_master);
    }
    console.log(input);
    console.log(area);
};

$("#input_area").keyup(Search.updateInput);