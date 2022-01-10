const {   
  encrypt, decrypt, dbencrypt, dbToSvrText, svrToDbText, dbdecrypt,
} = require('./functions'); 
var router = express.Router();


/* GET users listing. */
router.use('/', function(req, res, next) {
  // WalletRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  next('route');
});

function partFind(name) {
return { $regex: name, $options: "i" }
}


router.get('/namelist/:fName/:mName/:lName', async function (req, res) {
  setHeader(res);
  var {fName, mName, lName } = req.params;

	let filterQuery;
	if ((fName === "-") && (mName === "-") && (lName === "-"))
		filterQuery = {};
  else if ((fName === "-") && (mName === "-"))
		filterQuery = {lastName: partFind(lName)};
	else if	((fName === "-") && (lName === "-"))
		filterQuery = {middleName: partFind(mName)};
	else if	((mName === "-") && (lName === "-"))
		filterQuery = {firstName:partFind(fName)};
	else if	(fName === "-")
		filterQuery = {middleName: partFind(mName),  lastName: partFind(lName) };
	else if	(mName === "-")
		filterQuery = {firstName: partFind(fName),  lastName: partFind(lName)};
	else 
		filterQuery = {firstName: partFind(fName),  middleName: partFind(mName), lastName: partFind(lName)};

	filterQuery["ceased"] = false;
	//console.log(filterQuery);

	let myData = await M_Member.find(filterQuery).limit(54).sort({lastName: 1, firstName: 1, middleName: 1});
	//console.log(myData);
	sendok(res, myData);
});		

router.get('/hod/:hid', async function (req, res) {
  setHeader(res);
  var {hid } = req.params;
	let myData = await M_Member.find({hid: hid, ceased: false}).sort({order: 1});
	//console.log(myData);
	for(let i=0; i<myData.length; ++i) {
		myData[i].email = dbToSvrText(myData[i].email);
		myData[i].email1 = dbToSvrText(myData[i].email1);
	}
	sendok(res, myData);
});		

router.post('/sethod/:mid', async function (req, res) {
  setHeader(res);
  var {mid } = req.params;
	mid = Number(mid);
	let hid = Math.trunc(mid / FAMILYMF);

	let hodRec = await M_Hod.findOne({hid: hid});
	hodRec.mid = mid;
	hodRec.save();
	
	let myData = await M_Member.find({hid: hid, ceased: false}).sort({order: 1});
	myData[0].relation = "Relative";
	for(let i=0, startOrder=1; i<myData.length; ++i) {
		if (myData[i].mid === mid) {
			myData[i].order = 0;
			myData[i].relation = "Self";
		} else	{
			myData[i].order = startOrder++;
		}
		myData[i].save();
	}
	sendok(res, "Done");
});	

router.post('/ceased/:mid/:datestr', async function (req, res) {
  setHeader(res);
  var {mid, datestr } = req.params;
	mid = Number(mid);
	let hid = Math.trunc(mid / FAMILYMF);
	let d = new Date(
		Number(datestr.substr(0,4)), 
		Number(datestr.substr(4, 2))-1,
		Number(datestr.substr(6, 2)),
		0, 0, 0
	);
	
	// get all members of the family sorted by 'order'
	let myData = await M_Member.find({hid: hid}).sort({order: 1});
	
	// update ceased information in member
	let tmp = myData.find(x => x.mid === mid);
	tmp.ceased = true;
	tmp.ceasedDate = d;
	
	// update details of member's spouse
	tmp = myData.find(x => x.mid === tmp.spouseMid);
	if (tmp) {
		tmp.emsStatus = (myData.gender === "Male") ? "Widower" : "Widow";
		tmp.spouseMid = 0;
	}
	
	for(let i=0, startOrder=0; i<myData.length; ++i) {
		if (myData[i].mid !== mid) {
			myData[i].order = startOrder++;
		}
		await myData[i].save();
	}

	// also update in Humad, PJYM and PRWS

	sendok(res, "Done");
});


router.get('/split/:newFamilyData', async function (req, res) {
  setHeader(res);
  var {newFamilyData } = req.params;
	newFamilyData = JSON.parse(newFamilyData);
	let hid = Math.trunc(newFamilyData.hod / FAMILYMF);
	let tmpRec = await M_Hod.find({}).limit(1).sort({hid: -1});
	let newHid = tmpRec[0].hid + 1;

	let hidRec = await M_Hod.findOne({hid: hid});
	
	let newRec = new M_Hod(_.omit(hidRec, '_id'));
	newRec.hid = newHid;
	newRec.mid = newRec.hid*FAMILYMF + 1;		// mid of HOD
	console.log(newRec);
	await newRec.save();

	let allMemRec = await M_Member.find({hid: hid, ceased: false});
	let newMid, newOrder, newRelation;

	// now rectify order number of members who are not getting transferred
	for (let i=0, orderNo=1; i<allMemRec.length; ++i) {
		if (!newFamilyData.memberList.includes(allMemRec[i].mid)) {
			console.log(allMemRec[i].mid);
			if (allMemRec[i].mid === hidRec.mid) {
				newOrder = 0;
			} else {
				newOrder = orderNo++
			}
			allMemRec[i].order = newOrder;
			allMemRec[i].save();
		}
	}
	
	// now transfer all selected members to new family
	for (let i=0, orderNo=1, seqNo=2; i<allMemRec.length; ++i) {
		if (newFamilyData.memberList.includes(allMemRec[i].mid)) {
			console.log(allMemRec[i].mid);
			if (allMemRec[i].mid === newFamilyData.hod) {
				newMid = newRec.hid*FAMILYMF + 1;
				newOrder = 0;
				newRelation = "Self";
			} else {
				newMid = newRec.hid*FAMILYMF + seqNo;
				seqNo++;
				newOrder = orderNo++
				newRelation = allMemRec[i].relation;
			}
			allMemRec[i].hid = newRec.hid
			allMemRec[i].mid = newMid;
			allMemRec[i].order = newOrder;
			allMemRec[i].relation = newRelation;
			allMemRec[i].save();
		}
	}

	sendok(res, "OK");
});	


router.post('/scrollup/:mid', async function (req, res) {
  setHeader(res);
  var {mid } = req.params;
	mid = Number(mid);
	let hid = Math.trunc(mid / FAMILYMF);

	let myData = await M_Member.find({hid: hid, ceased: false}).sort({order: 1});
	myData[0].relation = "Relative";
	for(let i=0, startOrder=1; i<myData.length; ++i) {
		if (myData[i].mid !== mid) continue;
		--myData[i].order;
		++myData[i-1].order;		
		myData[i-1].save();
		myData[i].save();
	}
	sendok(res, "Done");
});	

router.post('/scrolldown/:mid', async function (req, res) {
  setHeader(res);
  var {mid } = req.params;
	mid = Number(mid);
	let hid = Math.trunc(mid / FAMILYMF);

	let myData = await M_Member.find({hid: hid, ceased: false}).sort({order: 1});
	myData[0].relation = "Relative";
	for(let i=0, startOrder=1; i<myData.length; ++i) {
		if (myData[i].mid !== mid) continue;
		++myData[i].order;
		--myData[i+1].order;		
		myData[i].save();
		myData[i+1].save();
	}
	sendok(res, "Done");
});	


router.get('/delete/:cid/:year/:month/:date/:order/:pid', async function (req, res) {
  setHeader(res);
  var {cid, pid, date, month, year, order } = req.params;
	
	//let myFilter = {date: Number(date), month: Number(month), year: Number(year), order: Number(order), pid: Number(pid)};
	
	let myFilter = { cid: cid, date: Number(date), month: Number(month), year: Number(year),order: Number(order), pid: Number(pid) };
	//console.log(myFilter);
	let hRec = await M_Appointment.deleteOne(myFilter);
	//console.log(hRec);
	sendok(res, "OK");
});


router.get('/cancel/:cid/:pid/:order', async function (req, res) {
  setHeader(res);
  var {cid, pid, order } = req.params;
	
	
	let myFilter = { cid: cid, pid: Number(pid), order: Number(order), visit: VISITTYPE.pending };
	//console.log(myFilter);
	let hRec = await M_Appointment.findOne(myFilter);
	if (hRec) {
		//console.log(hRec);
		hRec.visit = VISITTYPE.cancelled;
		hRec.save();
		sendok(res, "OK");
	} else {
		senderr(res, 601, "Appoint not found");
	}
});


router.get('/add/:cid/:apptdata', async function (req, res) {
  setHeader(res);
  var {cid, apptdata} = req.params;
	
	let newData = JSON.parse(apptdata);
	console.log(newData);
	
	let hRec = await M_Appointment.find({
		cid: cid, date: newData.date, month: newData.month, year: newData.year, 
		order: newData.order, pid: newData.pid,
	});
	
	if (hRec.count > 0) {
		senderr(res, 601, "Duplicate Entry");
		return;
	}
	
	hRec = new M_Appointment();
	hRec.cid = cid;
	//hRec.data = newData.data;
	hRec.apptTime  = newData.apptTime;
	hRec.order = newData.order;
	
	//hRec.pid = newData.data.pid;
	hRec.pid = newData.pid;
	hRec.displayName = newData.displayName
	
	hRec.date = newData.date;
	hRec.month = newData.month;
	hRec.year = newData.year;	
	hRec.hour = newData.hour;
	hRec.minute = newData.minute;
	
	hRec.visit = newData.visit;
	
	hRec.save();
	sendok(res, hRec);
});	

router.get('/list/date/:cid/:year/:month/:date', async function (req, res) {
  setHeader(res);
  var {cid, date, month, year } = req.params;
	
	publishAppointments(res, {cid: cid, date: Number(date), month: Number(month), year: Number(year)})
});		





function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

module.exports = router;
