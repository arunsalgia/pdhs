//const { pin } = require("pincode");

const {  akshuGetUser, GroupMemberCount,  
  encrypt, decrypt, dbencrypt, dbToSvrText, svrToDbText, dbdecrypt,
	numberDate, 
	generateOrder, generateOrderByDate,
	setOldPendingAppointment,
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


router.get('/list', async function (req, res) {
  setHeader(res);

	let allHumads = await M_Humad.find({active: true}).sort({mid: 1, upgradeIndex: -1});
	let allMids = _.map(allHumads, 'mid');
	//allMids = _.uniqBy(allMids);
	let allMembers = await M_Member.find({mid: {$in: allMids}}, 
	{_id: 0, mid: 1, title: 1, firstName: 1, middleName: 1, lastName: 1, alias: 1, mobile: 1,
		dateOfMarriage: 1, dob: 1, gender: 1}).sort({lastName: 1, firstName: 1, middleName: 1 });
	//console.log(allHumads.length, allMembers.length);
	//console.log(allMembers);

	let myData = {humad: allHumads, member: allMembers };
	sendok(res, myData);
});		

router.get('/listbyalphabet/:chrStr', async function (req, res) {
  setHeader(res);
	var { chrStr } = req.params;
	
	let allMembers = await M_Member.find({ lastName: { $regex: "^"+chrStr, $options: "i" }, humadMember: true }, 
		{_id: 0, mid: 1, title: 1, firstName: 1, middleName: 1, lastName: 1, alias: 1, mobile: 1,
		dateOfMarriage: 1, dob: 1, gender: 1}).sort({lastName: 1, firstName: 1, middleName: 1 });
		
	let allMids = _.map(allMembers, 'mid');
	let allHumads = await M_Humad.find({ mid: {$in: allMids}, active: true}).sort({mid: 1, upgradeIndex: -1});
	
	let myData = {humad: allHumads, member: allMembers };
	sendok(res, myData);
});	

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
	console.log(filterQuery);

	let myData = await M_Member.find(filterQuery).limit(36).sort({lastName: 1, firstName: 1, middleName: 1});
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

router.get('/test/:pinCode', async function (req, res) {
  setHeader(res);
  var {pinCode } = req.params;
	pin.seachByPin('560057', function (response){
		response.forEach(function (data) {
		console.log(data);
		});
		});
	sendok(res, "OK"); 
	//publishAppointments(res, {cid: cid, date: Number(date), month: Number(month), year: Number(year)})
});	

router.get('/pendinglist/date/:cid/:year/:month/:date/:days', async function (req, res) {
  setHeader(res);
  var {cid, date, month, year, days } = req.params;
	let iDate = Number(date);
	let iMonth = Number(month);
	let iYear = Number(year);
	let iDays = Number(days);
	
	let startOrder = generateOrder(iYear, iMonth, iDate, 0, 0);
	
	let endDate = new Date(iYear, iMonth, iDate +iDays);
	let endOrder = generateOrder(
		endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 
		0, 0);
	let myFilter = { cid: cid, visit: VISITTYPE.pending, order: { $lte: endOrder, $gte: startOrder} }
	publishAppointments(res, myFilter);
});		

router.get('/pendinglist/all/:cid', async function (req, res) {
  setHeader(res);
  var { cid } = req.params;

	publishAppointments(res, { cid: cid, visit: VISITTYPE.pending })
});		

router.get('/list/pid/:cid/:pid', async function (req, res) {
  setHeader(res);
  var { cid, pid } = req.params;
	//console.log(cid, pid);
	publishAppointments(res, { cid: cid, pid: Number(pid) })
});		

router.get('/pendinglist/pid/:cid/:pid', async function (req, res) {
  setHeader(res);
  var { cid, pid } = req.params;
	//console.log(cid, pid);
	publishAppointments(res, { cid: cid, pid: Number(pid), visit: VISITTYPE.pending})
});		

router.get('/pendinglist/date/:cid/:year/:month/:date', async function (req, res) {
  setHeader(res);
  var {cid, date, month, year } = req.params;
	
	publishAppointments(res, { cid: cid, visit: VISITTYPE.pending, date: Number(date), month: Number(month), year: Number(year)})
});		

router.get('/list/month/:cid/:year/:month', async function (req, res) {
  setHeader(res);
  var {cid, month, year } = req.params;
	
	publishAppointments(res, {cid: cid, month: Number(month), year: Number(year)})
});		

router.get('/list/year/:cid/:year', async function (req, res) {
  setHeader(res);
  var { cid, year } = req.params;
	
	publishAppointments(res, {cid: cid, year: Number(year)});
});		

router.get('/list/all/:cid', async function (req, res) {
  setHeader(res);
	var {cid} = req.params;
	
	publishAppointments( res, {cid: cid} );
});		

router.get('/list/all/fromtoday/:cid', async function (req, res) {
  setHeader(res);
	var {cid} = req.params;
	
	let thisTime = new Date();
	//thisTime = new Date(thisTime.getFullYear(), thisTime.getMonth(), thisTime.getDate(), 0, 0, 0);
	//console.log(thisTime);
	let myMon = thisTime.getMonth();
	let myDat = thisTime.getDate();
	
	let chkOrder = ((thisTime.getFullYear() * 100) + thisTime.getMonth())*100 + thisTime.getDate();
	chkOrder *= 100 * 100;
	console.log("Chkorder", chkOrder);
	
publishAppointments( res, {cid: cid, order: {$gte: chkOrder}, visit: {$nin: [VISITTYPE.cancelled, VISITTYPE.expired] } } );
});		


router.get('/count/patient/:cid/:pid', async function (req, res) {
  setHeader(res);
  var {cid, pid, year } = req.params;
	pid = Number(pid);
	
	/*
    $group : {
       _id: $date,
       //user_totaldocs: { $sum: "$user_totaldocs"}, // for your case use local.user_totaldocs
       //user_totalthings: { $sum: "$user_totalthings" }, // for your case use local.user_totalthings
       count: { $sum: 1 } // for no. of documents count
    }	
		[
  { $match: { age: { $lt: 30 } } },
  {
    $group: {
      _id: '$age',
      count: { $sum: 1 }
    }
  }
]
*/
	let filterQuery = [
		{ $match: { cid: cid, pid: pid, visit: VISITTYPE.pending } },
		{ $group: { _id: '$pid', count: { $sum: 1 } } }
  ];
	let calcelledQuery = [
		{ $match: { cid: cid, pid: pid, visit: VISITTYPE.cancelled } },
		{ $group: { _id: '$pid', count: { $sum: 1 } } }
  ];
	let overQuery = [
		{ $match: { cid: cid, pid: pid, visit: {$nin : [VISITTYPE.pending, VISITTYPE.cancelled]} } },
		{ $group: { _id: '$pid', count: { $sum: 1 } } }
  ];
	
	let p, c, o;
	p = await M_Appointment.aggregate(filterQuery)
	c = await M_Appointment.aggregate(calcelledQuery)
	o = await M_Appointment.aggregate(overQuery)
	
	let pCount = (p.length > 0) ? p[0].count : 0;
	let cCount = (c.length > 0) ? c[0].count : 0;
	let oCount = (o.length > 0) ? o[0].count : 0;

	sendok(res, {pending: pCount, cancelled: cCount, visit: oCount});
});		


router.get('/count/month/:cid/:year/:month', async function (req, res) {
  setHeader(res);
  var {cid, month, year } = req.params;
	
	/*
    $group : {
       _id: $date,
       //user_totaldocs: { $sum: "$user_totaldocs"}, // for your case use local.user_totaldocs
       //user_totalthings: { $sum: "$user_totalthings" }, // for your case use local.user_totalthings
       count: { $sum: 1 } // for no. of documents count
    }	
		[
  { $match: { age: { $lt: 30 } } },
  {
    $group: {
      _id: '$age',
      count: { $sum: 1 }
    }
  }
]
*/
	let iy = Number(year);
	let im = Number(month);
	
	let ddd = new Date(iy, im+1, 0);
	let lastDate = ddd.getDate();
	
	
	let filterQuery = [
		{ $match: { cid: cid, year: iy, month: im, visit: VISITTYPE.pending } },
		{ $group: { _id: '$date', count: { $sum: 1 } } }
  ];
	let calcelledQuery = [
		{ $match: { cid: cid, year: iy, month: im, visit: VISITTYPE.cancelled } },
		{ $group: { _id: '$date', count: { $sum: 1 } } }
  ];
	let overQuery = [
		{ $match: { cid: cid, year: iy, month: im, visit: {$nin : [VISITTYPE.pending, VISITTYPE.cancelled]} } },
		{ $group: { _id: '$date', count: { $sum: 1 } } }
  ];
	
	let p, c, o;
	p = await M_Appointment.aggregate(filterQuery)
	c = await M_Appointment.aggregate(calcelledQuery)
	o = await M_Appointment.aggregate(overQuery)

	/***
	let chk = await await M_Appointment.find({visit: {$nin : ["cancelled", "pending"]} });
	if (chk.length > 0) {
		console.log(chk[0].visit);
		let allRecs = await M_Visit.findOne({_id: chk[0].visit});
		console.log(allRecs);
	}
	***/
	
	let finalData = [];
	let pending, cancelled, over;
	let xxx;
	for(let i=1; i<=lastDate; ++i) {
		xxx = p.find(x => x._id === i);
		pending = (xxx) ? xxx.count : 0;
		
		xxx = c.find(x => x._id === i);
		cancelled = (xxx) ? xxx.count : 0;
		
		xxx = o.find(x => x._id === i);
		over = (xxx) ? xxx.count : 0;
		
		//if ((pending + cancelled + over) > 0)
		finalData.push({date: i, pending: pending, cancelled: cancelled, visit: over});
	}
	//console.log(finalData);
	
	sendok(res, finalData);
});		

router.get('/cancel/pending', async function (req, res) {
  setHeader(res);
	await cancelOldAppt();
	sendok(res, "Cancelled");
});
	
async function publishAppointments(res, filter) {
	//console.log(filter)
	let hRec = await M_Appointment.find(filter);
	//console.log(hRec);
	sendok(res, hRec);
};

async function cancelOldAppt() {
	// cancel all appointment as of yesterday
	let thisTime = new Date();
	//thisTime = new Date(thisTime.getFullYear(), thisTime.getMonth(), thisTime.getDate(), 0, 0, 0);
	console.log(thisTime);
	let myMon = thisTime.getMonth();
	let myDat = thisTime.getDate();
	
	let chkOrder = ((thisTime.getFullYear() * 100) + thisTime.getMonth())*100 + thisTime.getDate();
	//console.log("Chkorder", chkOrder);
	chkOrder *= 100 * 100;
	console.log("Chkorder", chkOrder);
	
	let allPendingAppts = await M_Appointment.find({visit: VISITTYPE.pending, order: {$lte: chkOrder} } );
	console.log("Count: ",allPendingAppts.length);
	
	for(let i=0; i<allPendingAppts.length; ++i) {
		allPendingAppts[i].visit = VISITTYPE.cancelled;
		allPendingAppts[i].save();
		//console.log(allPendingAppts[i].apptTime, allPendingAppts[i].order);
	}
}



function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

module.exports = router;
