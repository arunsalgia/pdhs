var router = express.Router();
const { 
	ALPHABETSTR,
	getLoginName, getDisplayName,
	getMaster, setMaster,
} = require('./functions'); 

router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

// send list of in chunks of blocks.
// Each Block will contain #medicines which is confgired in MEDBLOCK

router.get('/get/:hid', async function(req, res, next) {
  setHeader(res);
  
  var {hid } = req.params;
	
  var tmp = await M_Hod.findOne({hid: Number(hid)});
	if (tmp)	sendok(res, tmp);
	else			senderr(res, 601, {hid: 0});
});

router.get('/edit/:cid/:oldNote/:newNote', async function(req, res, next) {
  setHeader(res);
  
  var {cid, oldNote, newNote, desc, precaution} = req.params;
	let id;
	var mRec;
	
	let old_lname = getLoginName(oldNote);
	let new_lname = getLoginName(newNote);
	
	if (old_lname != new_lname) {
		// just check that of new medicine already in database
		mRec = await M_Hod.findOne({cid: cid, id: new_lname});
		if (mRec) {
			senderr(res, 601, "New Note already in database");
			return;
		}
	} 
	
	// check if old name really exists!!!! Only then we can modify it
	mRec = await M_Hod.findOne({cid: cid, id: old_lname});
	if (!mRec) {
		senderr(res, 611, "Old Note not found in database");
		return;
	}

	// good. now update the details
	mRec.id = new_lname;
	mRec.name = newNote;
	mRec.enabled = true;
	mRec.save();
	sendok(res, mRec);
});

router.get('/delete/:cid/:delNote', async function(req, res, next) {
  setHeader(res);
  
  var { cid, delNote } = req.params;
	
	let id = getLoginName(delNote);
	//console.log(id);
	
	M_Hod.deleteOne({cid: cid, id: id}).then(function(){
    //console.log("Data deleted"); // Success
		sendok(res, "1 note deleted");
	}).catch(function(error){
    console.log(error); // Failure
		senderr(res, 601, `Note not found in database.`);
	});
});

router.get('/list/:cid', async function(req, res, next) {
  setHeader(res);
  
  var { cid } = req.params;
	
	M_Hod.find({cid: cid}, {_id: 0, name: 1}, function(err, objs) {
		objs = _.sortBy(objs, 'name');
		sendok(res, objs);
  });
});

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;