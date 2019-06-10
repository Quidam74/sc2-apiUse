//import Page from './components/Page'
//import {getBrowser} from './utils/environment'

var token = 'aaa'
const App = {

    init() {
        document.addEventListener('DOMContentLoaded', this.ready.bind(this), false);
    },
    ready() {
        this.initComponents();

        this.bindEvent();
    },
    bindEvent() {

    },
    clickOnViewMore() {
        document.querySelector('.history-extend').addEventListener('click', function () {
            if (document.querySelector('.history-content').style.height !== "100%") {
                document.querySelector('.history-content').style.height = "100%"
                document.querySelector('.history-extend').style.position = "static"
                document.querySelector('.arrow').style.display = "none"
                document.querySelector('.history-extend p').innerHTML = "Voir moins"
            } else {
                document.querySelector('.history-content').style.height = "30vh"
                document.querySelector('.history-extend').style.position = "relative"
                document.querySelector('.arrow').style.display = "block"
                document.querySelector('.history-extend p').innerHTML = "Voir plus"
            }
        })
    },
    getToken() {
        var that = this
        fetch("https://us.battle.net/oauth/token", {
            body: "grant_type=client_credentials",
            headers: {
                Authorization: "Basic NzFhMTY0ZmMwNDc0NDg4Y2IyYWM4ZDJhZDJkY2MyYjE6dmdlZVNpczdGTjFMMUVYNGZjekJ6OTZ5U21xRGo5RE4=",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
        }).then(function (response) {
            response.json().then(function (tokenData) {
                token = tokenData.access_token
                var mapProgress = [];
                var recencedMap = [];
                fetch('https://eu.api.blizzard.com/sc2/profile/2/1/1577911?locale=fr_FR&access_token=' + token)
                    .then(function (response) {
                        response.json().then(function (gameProfile) {
                            document.querySelector(".hero-Bio img").src = gameProfile.summary.portrait
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
                            .catch(function (error) {
                                console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message + "c'est sans doute lié a une clé d'api mal renseigné !");
                            });
                    });

                fetch('https://eu.api.blizzard.com/sc2/legacy/profile/2/1/1577911/matches?access_token=' + token)
                    .then(function (response) {
                        response.json().then(function (gameLader) {
                            gameLader.matches.forEach(function (elem, index) {
                                var mapIsCounted = false;
                                var formattedTime = that.casttimestampToDate(elem.date);
                                document.querySelector(".history-content").innerHTML += "<div><span>" + elem.map + "</span><span>" + elem.type + "</span><span>" + formattedTime + "</span><span>" + elem.decision + "</span></div>";
                                if (recencedMap.length == 0) {
                                    recencedMap.push(elem.map)
                                    that.pushFirstMap(mapProgress, elem.decision, elem.map)
                                } else {
                                    recencedMap.forEach(function (mapName, position) {
                                        if (mapName == elem.map) {
                                            mapIsCounted = true;
                                        }
                                    })
                                    if (!mapIsCounted) {
                                        recencedMap.push(elem.map)
                                        that.pushFirstMap(mapProgress, elem.decision, elem.map)
                                    } else {
                                        mapProgress.forEach(function (stats, nombre) {
                                            if (stats.mapName == elem.map) {
                                                if (elem.decision == "Win")
                                                    stats.win += 1;
                                                else
                                                    stats.lose += 1;
                                            }
                                        })
                                    }
                                }
                            })

                            document.querySelector(".history-content").innerHTML += " <div class=\"history-extend\"><p>Voir plus</p><div class='arrow'></div></div>"

                            that.clickOnViewMore()
                            mapProgress.forEach(function (stats, nombre) {
                                stats.ratio = Math.round(eval(stats.win / stats.lose) * 100) / 100
                            })
                            mapProgress = that.sortByKey(mapProgress, "ratio")
                            mapProgress.forEach(function (stats, nombre) {
                                document.querySelector(".mapAnalyse-content").innerHTML += "<div><span>" + stats.mapName + "</span><span>" + stats.win + "</span><span>" + stats.lose + "</span><span>" + stats.ratio + "</span></div>";
                            })

                        })
                    });
            })
        })
    },
    initComponents() {
        this.getToken()
    },
    casttimestampToDate(timeStamp) {
        var date = new Date(timeStamp * 1000);
        var day = date.getUTCDate();
        var month;
        if (eval(date.getMonth() + 1) >= 10)
            month = eval(date.getMonth() + 1);
        else
            month = "0" + eval(date.getMonth() + 1);
        var year = +date.getUTCFullYear();
        var formattedTime = day + '/' + month + '/' + year;
        return formattedTime;
    }
    ,
    pushFirstMap(mapProgress, decision, map) {
        if (decision == "Win")
            mapProgress.push({"mapName": map, "win": 1, "lose": 0})
        else
            mapProgress.push({"mapName": map, "win": 0, "lose": 1})
    }
    ,
    sortByKey(array, key) {
        return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }


};


App.init();