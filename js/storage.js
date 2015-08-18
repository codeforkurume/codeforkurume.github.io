/**
 * Created by minto on 15/08/18.
 */
/**
 * Created by minto on 15/08/18.
 */
var Storage;
Storage = {
    getSelectedAreaName: function(){
        return localStorage.getItem("selected_area_name");
    },

    setSelectedAreaName: function(name){
        localStorage.setItem("selected_area_name", name);
    },

    getSelectedAreaMasterName: function() {
        return localStorage.getItem("selected_area_master_name");
    },

    setSelectedAreaMasterName: function(name) {
        localStorage.setItem("selected_area_master_name", name);
    },

    getSelectedAreaMasterNameBefore: function() {
        return localStorage.getItem("selected_area_master_name_before");
    },

    setSelectedAreaMasterNameBefore: function(name) {
        localStorage.setItem("selected_area_master_name_before", name);
    }
};