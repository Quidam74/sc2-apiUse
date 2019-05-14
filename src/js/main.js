
//import Page from './components/Page'
//import {getBrowser} from './utils/environment'

const App = {

    init(){
        document.addEventListener('DOMContentLoaded', this.ready.bind(this), false);

    },
    ready(){
        this.initComponents();
        this.bindEvent();

        fetch('https://eu.api.blizzard.com/sc2/profile/2/1/1577911?locale=fr_FR&access_token=')
        .then(function(response) {
          response.json().then(function(gameProfile){
           //console.log(gameProfile);
           document.querySelector(".hero-name").innerHTML = gameProfile.summary.displayName
           document.querySelector(".hero-TotalSucces").innerHTML = gameProfile.summary.totalAchievementPoints
           document.querySelector(".hero-levels-total").innerHTML = gameProfile.summary.totalSwarmLevel
           document.querySelector(".hero-levels-zerg").innerHTML = gameProfile.swarmLevels.zerg.level
           document.querySelector(".hero-levels-terran").innerHTML = gameProfile.swarmLevels.terran.level
           document.querySelector(".hero-levels-protoss").innerHTML = gameProfile.swarmLevels.protoss.level

           document.querySelector(".hero-career-max").innerHTML = gameProfile.career.best1v1Finish.leagueName
           document.querySelector(".hero-career-maxTime").innerHTML = gameProfile.career.best1v1Finish.timesAchieved

           document.querySelector(".hero-careerTeam-max").innerHTML = gameProfile.career.bestTeamFinish.leagueName
           document.querySelector(".hero-careerTeam-maxTime").innerHTML = gameProfile.career.bestTeamFinish.timesAchieved
       })
      });


 fetch('https://eu.api.blizzard.com/sc2/profile/2/1/1577911/ladder/summary?locale=fr_FR&access_token=')
        .then(function(response) {
          response.json().then(function(gameLader){
           console.log(gameLader);
            })
      });

    },

    bindEvent(){

    },

    initComponents(){


    },

};


App.init();