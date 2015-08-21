/**
 * Created by minto on 15/08/18.
 */

var Storage;
Storage = {
    getSelectedAreaName: function () {
        return localStorage.getItem("area");
    },

    setSelectedAreaName: function (name) {
        localStorage.setItem("area", name);
    },

    getSelectedAreaMasterName: function () {
        return localStorage.getItem("area_master");
    },

    setSelectedAreaMasterName: function (name) {
        localStorage.setItem("area_master", name);
    }
};