/**
 * Created by minto on 15/08/18.
 */
var Descriptions;
Areas = (function () {
    var _instance;
    var _fromGetInstance = false;
    this._data = null;

    function _construct(){
        if(!_fromGetInstance){
            throw new Error("this class is a singleton!!!!!!");
        }
        if(data===null){
            throw new Error("data is null!!!!!!!!!!!!!!");
        }
        _fromGetInstance = false;
    }

    _construct.getInstance = function(){
        _fromGetInstance = true;
    }

    return _construct;
})();

AreaMasters.prototype.getData = function(){
    return this._data;
};

$(document).ready(function() {
    Utility.setCSVFileData(DesCriptionCSVFileName, Descriptions);
});