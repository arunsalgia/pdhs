var router = express.Router();
const { 
	getLoginName, getDisplayName,
} = require('./functions'); 

router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

router.post('/update/:cid/:pid/:newInfo', async function(req, res, next) {
  setHeader(res);
  
  var {cid, pid, newInfo } = req.params;
	pid = Number(pid);
	newInfo = JSON.parse(newInfo);
	console.log(newInfo);
  var iRec = await M_DentalTreatment.findOne({cid: cid, pid: pid, treatmentNumber: 0});
  if (!iRec) {
		iRec = new M_DentalTreatment();
		iRec.cid = cid;
		iRec.pid = pid;
		iRec.treatmentNumber = 0;
		iRec.enabled = true;
  }
	iRec.treatmentDate = new Date();
	iRec.treatment = newInfo.treatment;
	console.log(iRec);
	await iRec.save();
	
	// now update payment
	let myProfChargeRec = await M_ProfCharge.findOne({treatment: iRec._id});
	if (!myProfChargeRec) {
		myProfChargeRec = new M_ProfCharge();
		myProfChargeRec.cid = cid;
		myProfChargeRec.pid = pid;
		myProfChargeRec.treatment = iRec._id;
		myProfChargeRec.paymentmode = "";
		myProfChargeRec.enable = true;
		
		// get new tid
		let tmp = await M_ProfCharge.find({}).limit(1).sort({tid: -1});
		myProfChargeRec.tid = (tmp.length > 0) ? tmp[0].tid + 1 : "1";
	}
	myProfChargeRec.description = "professional charges dated 19-10-2021";
	myProfChargeRec.date = new Date();
	myProfChargeRec.amount = _.sumBy(newInfo.treatment, 'amount');
	myProfChargeRec.save();
	
	sendok(res, 'Done');
});

router.get('/list/:cid/:pid', async function(req, res, next) {
  setHeader(res);
  
  var { cid, pid } = req.params;
	pid = Number(pid);
	
	let allRecs = await M_DentalTreatment.find({cid: cid, pid: pid}).sort({treatmentNumber: -1})
	if (allRecs.length > 0) {
		if (allRecs[allRecs.length-1].treatmentNumber === 0) {	
			allRecs = [allRecs[allRecs.length-1]].concat(allRecs.slice(0, allRecs.length-1));
		}
	}
	console.log(allRecs);
	sendok(res, allRecs);
});

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;