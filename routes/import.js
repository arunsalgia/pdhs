const readXlsxFile = require('read-excel-file/node')

const {  akshuGetUser,   
  encrypt, decrypt, dbencrypt, dbToSvrText, svrToDbText, dbdecrypt,
	numberDate
} = require('./functions'); 
var router = express.Router();

var ROOTDIR="";
function getRootDir() {
  if (ROOTDIR === "")
    ROOTDIR = process.cwd() + "/"
  return ROOTDIR;
} 

function capitalizeFirstLetter(string) {
	let tmp =  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
	//console.log(tmp);
  return tmp;
}


/* GET users listing. */
router.use('/', function(req, res, next) {
  // WalletRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
	//console.log("Hi");
	
  next('route');
});


router.get('/hod', async function (req, res) {
  setHeader(res);
  
	var filePath = getRootDir() + ARCHIVEDIR + "import/hod.xlsx";
	console.log(filePath);

	if (!fs.existsSync(filePath))  return senderr(res, 601, "HOD file not found");

	// File path.
	await M_Hod.deleteMany({});
	readXlsxFile(filePath).then((rows) => {
		// `rows` is an array of rows
		// each row being an array of cells.
		console.log(rows.length);

		for(let i = 1; i<rows.length; ++i) {
			let myData = rows[i];
			if (myData[2] === 'Data NA') continue;

			let mid = Math.round(myData[1]*100);
			mid = Math.trunc(mid / 100) * FAMILYMF + (mid % 100);
			console.log(myData[0], myData[1], mid);

			let myRec = new M_Hod();
			myRec.hid = myData[0];
			myRec.mid = mid;
			myRec.gotra = myData[2];
			myRec.village = myData[3];

			let xxx = myData[4].split(',');
			myRec.resAddr1 = (xxx.length > 0) ? xxx[0].trim() : "";
			myRec.resAddr2 = (xxx.length > 1) ? xxx[1].trim() : "";
			myRec.resAddr3 = (xxx.length > 2) ? xxx[2].trim() : "";
			myRec.resAddr4 = (xxx.length > 3) ? xxx[3].trim() : "";
			myRec.resAddr5 = (xxx.length > 4) ? xxx[4].trim() : "";
			myRec.resAddr6 = (xxx.length > 5) ? xxx[5].trim() : "";

			console.log(myRec.resAddr1, myRec.resAddr2, myRec.resAddr3, myRec.resAddr4);

			myRec.suburb = myData[5];
			myRec.city = myData[6];
			myRec.pinCode = myData[7];
			myRec.district = (myData[8]) ? myData[8] : "";
			myRec.state = myData[9];
			myRec.resPhone1 = (myData[10]) ? myData[10] : "";
			myRec.resPhone2 = (myData[11]) ? myData[11] : "";
			myRec.save();
		}
	})

	sendok(res, "OK");
});


router.get('/member', async function (req, res) {
  setHeader(res);
  
	var filePath = getRootDir() + ARCHIVEDIR + "import/member.xlsx";
	console.log(filePath);

	if (!fs.existsSync(filePath))  return senderr(res, 601, "Member file not found");
	let allHods = await M_Hod.find({});
	// File path.
	await M_Member.deleteMany({});
	readXlsxFile(filePath).then((rows) => {
		// `rows` is an array of rows
		// each row being an array of cells.
		console.log(rows.length);

		for(let i = 1; i<rows.length; ++i) {
			let myData = rows[i];

			// first check if hod record is there
			let myHod = allHods.filter(x => x.hid == myData[0]);
			console.log(myHod.length);
			if (myHod.length !== 1) {
				console.log(`HOD ${myData[0]} not available. Ignoring this family record of ${myData[2]}`);
				continue;
			}

			//if (myData[2] === 'Data NA') continue;
			//console.log(myData[0], Math.round(myData[1]*FAMILYMF));

			let mid = Math.round(myData[2]*100);
			mid = Math.trunc(mid / 100) * FAMILYMF + (mid % 100);
			console.log(myData[0], myData[2], mid);

			let myRec = new M_Member();
			myRec.hid = myData[0];
			myRec.mid = mid;			//Math.round(myData[2]*FAMILYMF);

			myRec.title = capitalizeFirstLetter(myData[3].trim());
			myRec.lastName = capitalizeFirstLetter(myData[4].trim());
			myRec.firstName =capitalizeFirstLetter(myData[5].trim());
			myRec.middleName = capitalizeFirstLetter(myData[6].trim());
			myRec.alias = (myData[7]) ? capitalizeFirstLetter(myData[7].trim()) : "";
			myRec.relation = capitalizeFirstLetter(myData[8].trim());
			myRec.gender = capitalizeFirstLetter(myData[9].trim());
			myRec.dob = (myData[10] !== "") ? new Date(myData[10]) : new Date(1900, 0, 1);

			myRec.bloodGroup = (myData[11]) ? capitalizeFirstLetter(myData[11].trim()) : ""
			
			myRec.emsStatus = (myData[12]) ? myData[12].trim() : "";
			myRec.education = (myData[13]) ? myData[13].trim() : ""; 
			myRec.educationLevel =(myData[14]) ?  myData[14].trim() : "";
			myRec.educationCategory = (myData[15]) ? myData[15].trim() : "";
			myRec.educationField = (myData[16]) ?  myData[16].trim() : "";
			
			myRec.occupation = (myData[17]) ? myData[17].trim() : "";
			myRec.mobile = (myData[18]) ?  myData[18].trim() : "";
			let tmp = (myData[19]) ?  myData[19].toLowerCase().trim() : "-";
			myRec.email = dbencrypt(tmp);  //dbencrypt(tmp);

			myRec.officeName = (myData[20]) ? myData[20].trim() : "";
			myRec.officeAddr1 = (myData[21]) ? myData[21].trim() : "";
			myRec.officeAddr2 = (myData[22]) ? myData[22].trim() : "";
			myRec.officePhone = (myData[23]) ? myData[23].trim() : "";

			myRec.mobile1 = (myData[24]) ? myData[24].toLowerCase().trim() : "";
			tmp = (myData[25]) ?  myData[25].trim() : "-";
			myRec.email1 = dbencrypt(tmp);

			//console.log(myData[26]);
			myRec.ceased = myData[26];
			tmp = "";
			if (myData[27]) tmp = myData[27];
			//console.log(tmp);
			myRec.ceasedDate = ((myRec.ceased) && (tmp !== "")) ? new Date(tmp) : new Date(1900, 0, 1);

			myRec.save();
		}
	})

	sendok(res, "OK");
});

router.get('/order', async function (req, res) {
	setHeader(res); 
	for(let i = 1; i<30; ++i) {
		let myHod = await M_Hod.findOne({hid: i});
		let myData = await M_Member.find({hid: i}).sort({mid: 1});
		
		// bring HOD family member at the top
		let hodRec = myData.filter(x => x.mid === myHod.mid);
		let nonhodRec =  myData.filter(x => x.mid !== myHod.mid);
		let allMerged = hodRec.concat(nonhodRec);

		for(let m=0; m < allMerged.length; ++m) {
			allMerged[m]["order"] = m;
			allMerged[m].save();
			console.log(allMerged[m]);
		}
	}
	sendok(res, "OK");
});

router.get('/emailencrypt', async function (req, res) {
  setHeader(res);

	let myData = await M_Member.find({});
	//console.log(myData);
	for(let i = 0; i < myData.length; ++i) {
		myData[i].email = dbencrypt(myData[i].email);
		myData[i].email1 = dbencrypt(myData[i].email1);

	}
	sendok(res, "OK");
});

router.get('/listfamily/:hid', async function (req, res) {
	setHeader(res);
	var {hid} = req.params;
	let myData = await M_Member.find({hid: Number(hid)}).sort({mid: 1});
	sendok(res, myData);
});

router.get('/listhod/:hid', async function (req, res) {
	setHeader(res);
	var {hid} = req.params;
	let myData = await M_Hod.findOne({hid: Number(hid)});
	sendok(res, myData);
});

router.get('/high', async function (req, res) {
	setHeader(res);
	for(let i = 1; i<30; ++i) {
		let myData = await M_Member.find({hid: i}).sort({mid: 1});
		for(let m=0; m<myData.length; ++m) {
			myData[m]["order"] = m+1;
			myData[m].save();
		}
	}
	sendok(res, "OK");
});

router.get('/delete/:cid/:year/:month/:date', async function (req, res) {
  setHeader(res);
  var {cid, date, month, year } = req.params;
	
	
	let hRec = await M_Holiday.deleteOne({cid: cid, date: Number(date), month: Number(month), year: Number(year)});
	sendok(res, "OK");
});


router.get('/oldset/:year/:month/:date/:desc', async function (req, res) {
  setHeader(res);
  var {date, month, year, desc} = req.params;
	
	let hRec = await M_Holiday.findOne({date: date, month: month, year: year});
	//console.log(hRec);
	
	let imonth = Number(month);
	let iyear = Number(year);
	
	++imonth;
	if (imonth > 12) { ++iyear; imonth = 1; }
	
	if (!hRec) {
		hRec = new M_Holiday();
		hRec.date = date;
		hRec.month = imonth;
		hRec.year = iyear;
		hRec.holidayDate = numberDate(iyear, imonth, Number(date));
	}
	hRec.desc = desc;
	hRec.save();
	sendok(res, hRec);
});	


router.get('/set/:cid/:year/:month/:date/:desc', async function (req, res) {
  setHeader(res);
  var {cid, date, month, year, desc} = req.params;
	
	let hRec = await M_Holiday.findOne({cid: cid, date: date, month: month, year: year});
	console.log(hRec);
	
	if (!hRec) {
		hRec = new M_Holiday();
		hRec.cid = cid
		hRec.date = date;
		hRec.month = month;
		hRec.year = year;
		hRec.holidayDate = new Date(Number(year), Number(month), Number(date));
	}
	hRec.desc = desc;
	hRec.save();
	sendok(res, hRec);
});	


router.get('/monthly/:cid/:year/:month', async function (req, res) {
  setHeader(res);
  var {cid, month, year } = req.params;
	
	let hRec = await M_Holiday.find({cid: cid, month: month, year: year}).sort({year: 1, month: 1, date: 1});
	//console.log(hRec);
	sendok(res, hRec);
});		


router.get('/yearly/:cid/:year', async function (req, res) {
  setHeader(res);
  var { cid, year } = req.params;
	
	let hRec = await M_Holiday.find({cid: cid, year: year});
	sendok(res, hRec);
});		


router.get('/fromtoday/:cid', async function (req, res) {
  setHeader(res);
  var {cid} = req.params;
	let d = new Date();
	d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
	
	let hRec = await M_Holiday.find({cid: cid, holidayDate: {$gte: d} });

	sendok(res, hRec);
});		


router.get('/isholiday/:cid/:year/:month/:date', async function (req, res) {
  setHeader(res);
  var { cid, year, month, date } = req.params;
	
	let hRec = await M_Holiday.findOne({cid: cid, date: date, month: month, year: year});
	sendok(res, {status: (hRec != null) });
});		

router.get('/test/:cid/:year/:month', async function (req, res) {
  setHeader(res);
  var {cid, month, year } = req.params;

	let iyear = Number(year);
	let imonth = Number(month);
	
	let sNum = new Date(iyear, imonth, 1);
	let eNum = new Date(iyear, imonth+1, 1);
		
	//price: { $lte: maxPrice || 1000000000, $gte: minPrice || 0 }
	//console.log(sNum, eNum);
	let hRec = await M_Holiday.find( {cid: cid, holidayDate: {"$gte": sNum, "$lt": eNum} } );
	sendok(res, hRec);
});		

router.get('/all/:cid', async function (req, res) {
  setHeader(res);
  var {cid, month, year } = req.params;
		
	let hRec = await M_Holiday.find( {cid: cid} );
	sendok(res, hRec);
});		

function getDate(x) {
	let y = ("0" + x.getDate()).slice(-2) + "/" +
		("0" + (x.getMonth()+1)).slice(-2) + "/" +
		x.getFullYear();
	return y;
}



function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

module.exports = router;
