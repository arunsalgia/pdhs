const {  akshuGetUser, GroupMemberCount,  
	numberDate, 
	getMemberName
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

	let myData = await M_Pjym.find({});
	sendok(res, myData);
});		

router.get('/withmap', async function (req, res) {
  setHeader(res);

	let myData = await M_Pjym.find({active: true}, {_id: 0, __v: 0});
	let allMids = _.map(myData, 'mid');
	let myNames = await M_Member.find({mid: {$in: allMids}}, 
	{_id: 0, mid: 1, title: 1, firstName: 1, middleName: 1, lastName: 1, 
		dateOfMarriage: 1, dob: 1, gender: 1});
	let nameList = [];
	for(let i=0; i<myNames.length; ++i) {
		nameList.push({
			mid: myNames[i].mid, 
			title: myNames[i].title, 
			memberName: getMemberName(myNames[i]),
			dateOfMarriage: myNames[i].dateOfMarriage,
			dob: myNames[i].dob,
			gender: myNames[i].gender
		});
	}
	nameList = _.sortBy(nameList, 'memberName');
	console.log(nameList);
	sendok(res, {pjym: myData, member: nameList});
});

router.get('/listwithnames', async function (req, res) {
  setHeader(res);

	let myPjym = await M_Pjym.find({active: true}, {_id: 0, __v: 0});
	let allMids = _.map(myPjym, 'mid');
	let allNames = await M_Member.find({mid: {$in: allMids}}, 
	{_id: 0, mid: 1, title: 1, firstName: 1, middleName: 1, lastName: 1, 
		dob: 1, gender: 1});

	let finalData = [];
	for(i=0; i<myPjym.length; ++i) {
		let nameRec = allNames.find(x => x.mid === myPjym[i].mid);
		let tmp = {
			hid: 								myPjym[i].hid,
			mid: 								myPjym[i].mid,
			membershipNumber: 	myPjym[i].membershipNumber,
			membershipDate: 		myPjym[i].membershipDate,
			membershipReceipt: 	myPjym[i].membershipReceipt,
			upgradeIndex: 			myPjym[i].upgradeIndex,
			title:							nameRec.title,
			memberName:					getMemberName(nameRec),
			dob:								nameRec.dob,
			gender:							nameRec.gender
		}
		finalData.push(tmp);
	}

	sendok(res, finalData);
});

router.get('/listbyalphabet/:chrStr', async function (req, res) {
  setHeader(res);
	var {chrStr } = req.params;

	
	let allNames = await M_Member.find(
		{lastName: { $regex: "^"+chrStr, $options: "i" }, pjymMember: true,  ceased: false},
		{_id: 0, mid: 1, title: 1, firstName: 1, middleName: 1, lastName: 1, dob: 1, gender: 1}
		).sort({lastName: 1, middleName: 1, firstName: 1});
		
	let allMids = _.map(allNames, 'mid');
	let allPjym = await M_Pjym.find({mid: {$in: allMids}, active: true}, {_id: 0, __v: 0});
	
	let finalData = [];
	for(i=0; i<allNames.length; ++i) {
		let pyjmRec = allPjym.find(x => x.mid === allNames[i].mid);
		let tmp = {
			hid: 								pyjmRec.hid,
			mid: 								pyjmRec.mid,
			membershipNumber: 	pyjmRec.membershipNumber,
			membershipDate: 		pyjmRec.membershipDate,
			membershipReceipt: 	pyjmRec.membershipReceipt,
			upgradeIndex: 			pyjmRec.upgradeIndex,
			title:							allNames[i].title,
			memberName:					getMemberName(allNames[i]),
			dob:								allNames[i].dob,
			gender:							allNames[i].gender
		}
		finalData.push(tmp);
	}
	finalData = _.sortBy(finalData, 'memberName')
	sendok(res, finalData);
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
	filterQuery["pjymMember"] = true;
	//console.log(filterQuery);

	let allNames = await M_Member.find(
		filterQuery,
		{_id: 0, mid: 1, title: 1, firstName: 1, middleName: 1, lastName: 1, dob: 1, gender: 1}
	).sort({lastName: 1, firstName: 1, middleName: 1});
	
	let allMids = _.map(allNames, 'mid');
	let allPjym = await M_Pjym.find({mid: {$in: allMids}, active: true}, {_id: 0, __v: 0});
	
	let finalData = [];
	for(i=0; i<allNames.length; ++i) {
		let pyjmRec = allPjym.find(x => x.mid === allNames[i].mid);
		let tmp = {
			hid: 								pyjmRec.hid,
			mid: 								pyjmRec.mid,
			membershipNumber: 	pyjmRec.membershipNumber,
			membershipDate: 		pyjmRec.membershipDate,
			membershipReceipt: 	pyjmRec.membershipReceipt,
			upgradeIndex: 			pyjmRec.upgradeIndex,
			title:							allNames[i].title,
			memberName:					getMemberName(allNames[i]),
			dob:								allNames[i].dob,
			gender:							allNames[i].gender
		}
		finalData.push(tmp);
	}
	
	sendok(res, finalData);
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



function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

module.exports = router;
