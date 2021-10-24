const puppeteer = require('puppeteer');
const fs = require("fs");
const { Parser } = require("json2csv");

class eShop {
    constructor(USERNAME, PASSWORD, json, jsonLength) {
        this.USERNAME = USERNAME
        this.PASSWORD = PASSWORD
        this.json = json
        this.jsonLength = jsonLength
    }
}