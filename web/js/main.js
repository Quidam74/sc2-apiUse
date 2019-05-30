"use strict";

//import Page from './components/Page'
//import {getBrowser} from './utils/environment'
var App = {
  init: function init() {
    document.addEventListener('DOMContentLoaded', this.ready.bind(this), false);
  },
  ready: function ready() {
    this.initComponents();
    this.bindEvent();
    var that = this;
    var mapProgress = [];
    var recencedMap = [];
    fetch('https://eu.api.blizzard.com/sc2/profile/2/1/1577911?locale=fr_FR&access_token=').then(function (response) {
      response.json().then(function (gameProfile) {
        //console.log(gameProfile);
        document.querySelector(".hero-name").innerHTML = gameProfile.summary.displayName;
        document.querySelector(".hero-TotalSucces").innerHTML = gameProfile.summary.totalAchievementPoints;
        document.querySelector(".hero-levels-total").innerHTML = gameProfile.summary.totalSwarmLevel;
        document.querySelector(".hero-levels-zerg").innerHTML = gameProfile.swarmLevels.zerg.level;
        document.querySelector(".hero-levels-terran").innerHTML = gameProfile.swarmLevels.terran.level;
        document.querySelector(".hero-levels-protoss").innerHTML = gameProfile.swarmLevels.protoss.level;
        document.querySelector(".hero-career-max").innerHTML = gameProfile.career.best1v1Finish.leagueName;
        document.querySelector(".hero-career-maxTime").innerHTML = gameProfile.career.best1v1Finish.timesAchieved;
        document.querySelector(".hero-careerTeam-max").innerHTML = gameProfile.career.bestTeamFinish.leagueName;
        document.querySelector(".hero-careerTeam-maxTime").innerHTML = gameProfile.career.bestTeamFinish.timesAchieved;
      })["catch"](function (error) {
        console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message + "c'est sans doute lié a une clé d'api mal renseigné !");
      });
    });
    fetch('https://eu.api.blizzard.com/sc2/legacy/profile/2/1/1577911/matches?access_token=').then(function (response) {
      response.json().then(function (gameLader) {
        gameLader.matches.forEach(function (elem, index) {
          var mapIsCounted = false;
          var formattedTime = that.casttimestampToDate(elem.date);
          document.querySelector(".history").innerHTML += "<div><span>" + elem.map + "</span><span>" + elem.type + "</span><span>" + formattedTime + "</span><span>" + elem.decision + "</span></div>";

          if (recencedMap.length == 0) {
            recencedMap.push(elem.map);
            that.pushFirstMap(mapProgress, elem.decision, elem.map);
          } else {
            recencedMap.forEach(function (mapName, position) {
              if (mapName == elem.map) {
                mapIsCounted = true;
              }
            });

            if (!mapIsCounted) {
              recencedMap.push(elem.map);
              that.pushFirstMap(mapProgress, elem.decision, elem.map);
            } else {
              mapProgress.forEach(function (stats, nombre) {
                if (stats.mapName == elem.map) {
                  if (elem.decision == "Win") stats.win += 1;else stats.lose += 1;
                }
              });
            }
          }
        });
        mapProgress.forEach(function (stats, nombre) {
          stats.ratio = Math.round(eval(stats.win / stats.lose) * 100) / 100;
        });
        mapProgress = that.sortByKey(mapProgress, "ratio");
        mapProgress.forEach(function (stats, nombre) {
          document.querySelector(".mapAnalyse").innerHTML += "<div><span>" + stats.mapName + "</span><span>" + stats.ratio + "</span></div>";
        });
      });
    });
  },
  bindEvent: function bindEvent() {},
  initComponents: function initComponents() {},
  casttimestampToDate: function casttimestampToDate(timeStamp) {
    var date = new Date(timeStamp * 1000);
    var day = date.getUTCDate();
    var month;
    if (eval(date.getMonth() + 1) >= 10) month = eval(date.getMonth() + 1);else month = "0" + eval(date.getMonth() + 1);
    var year = +date.getUTCFullYear();
    var formattedTime = day + '/' + month + '/' + year;
    return formattedTime;
  },
  pushFirstMap: function pushFirstMap(mapProgress, decision, map) {
    if (decision == "Win") mapProgress.push({
      "mapName": map,
      "win": 1,
      "lose": 0
    });else mapProgress.push({
      "mapName": map,
      "win": 0,
      "lose": 1
    });
  },
  sortByKey: function sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }
};
App.init();