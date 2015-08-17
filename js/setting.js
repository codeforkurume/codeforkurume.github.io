/*
 * 5374 setting
 *
 */

var SVGLabel = false; // SVGイメージを使用するときは、true。用意できない場合はfalse。

var MaxDescription = 30; // ごみの最大種類、９を超えない場合は変更の必要はありません。

var MaxMonth = 3;

var WeekShift = false; // 休止期間なら週をずらすときは、true。金沢の仕様は、true。

var AbleEmptyDate = true; // falseにするとarea_daysのごみの回収日をすべて設定する必要がある。 
//ゴミ種別によって回収の無い地域のarea_daysの日付を""にすると種別も表示されない、久留米はtrue。

var AreaMasterCSV = "data/area_master.csv";
var AreaCSV = "data/area_days.csv";
var CenterCSV = "data/center.csv";