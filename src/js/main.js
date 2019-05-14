
//import Page from './components/Page'
//import {getBrowser} from './utils/environment'

const App = {

    init(){
        document.addEventListener('DOMContentLoaded', this.ready.bind(this), false);

    },
    ready(){
        this.initComponents();
        this.bindEvent();
        console.log("aaa")
        //console.log(getBrowser());
        //new Page();
    },

    bindEvent(){

    },

    initComponents(){


    }
};

 
App.init();