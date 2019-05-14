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
    console.log("aaa"); //console.log(getBrowser());
    //new Page();
  },
  bindEvent: function bindEvent() {},
  initComponents: function initComponents() {}
};
App.init();