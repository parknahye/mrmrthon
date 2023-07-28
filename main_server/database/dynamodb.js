const AWS = require('aws-sdk')
const dynamoClient = new AWS.DynamoDB.DocumentClient()

require('dotenv').config()

const PLAYER = "player"

AWS.config.update({
  region: "ap-northeast-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})


const marathonModule = require('./marathon')
const getMarathons = marathonModule.getMarathons
const getMarathonsById = marathonModule.getMarathonsById
const addMarathon = marathonModule.addMarathon
const updateMarathons = marathonModule.updateMarathons
const deleteMarathon = marathonModule.deleteMarathon


const playerModule = require('./player')
const getPlayer = playerModule.getPlayer
const getPlayerById = playerModule.getPlayerById
const addPlayer = playerModule.addPlayer
const deletePlayer = playerModule.deletePlayer  


const officialRecordModule = require('./official_record')
const getOfficialRecord = officialRecordModule.getOfficialRecord
const addOfficialRecord = officialRecordModule.addOfficialRecord
const selectPointByMid  = officialRecordModule.selectPointByMid
const updateOfficialRecord  = officialRecordModule.updateOfficialRecord
const deleteOfficialRecord  = officialRecordModule.deleteOfficialRecord


const nonOfficialRecordModule = require('./non_official_record')
const getNonOfficialRecord = nonOfficialRecordModule.getNonOfficialRecord
const addNonOfficialRecord = nonOfficialRecordModule.addNonOfficialRecord
const updateNonOfficialRecord  = nonOfficialRecordModule.updateNonOfficialRecord
const deleteNonOfficialRecord  = nonOfficialRecordModule.deleteNonOfficialRecord


module.exports = {
  getMarathons,
  getMarathonsById,
  addMarathon,
  updateMarathons,
  deleteMarathon,
  getPlayer,
  getPlayerById,
  addPlayer,
  deletePlayer,
  getOfficialRecord,
  addOfficialRecord,
  selectPointByMid,
  updateOfficialRecord,
  deleteOfficialRecord,
  getNonOfficialRecord,
  addNonOfficialRecord,
  updateNonOfficialRecord,
  deleteNonOfficialRecord
}