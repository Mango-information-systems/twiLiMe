var fs=require('fs'),
	request = require('request');	
	
var lock=0,
	twitterLists = [],
	processedLists = 0,
	members = [],
	someErrors = false;
	
function initializeList(callback) {
// initialize members list from results file
	fs.readFile('results.txt', 'ascii', function(err,data){
		if(err) {
			console.error("Could not open file: %s", err);
			process.exit(1);
		}
	
		members = data.split('\n');
		
		callback();
	});
	
}	
	
function getListMembers(list, owner, cursor, callback) {
// fill in array of usernames extracted from the twitter list
// cursor is id returned by twitter to browse paginated results
// will not insert duplicates 
// when processing is finished executes the callback function

	apiUrl = 'https://api.twitter.com/1/lists/members.json?skip_status=true&slug='+ list +'&owner_screen_name='+ owner +'&cursor='+cursor;

	request.get({'url': apiUrl}, function(error, response, body) {
// debugging code:
// console.log(response)
//	console.log(body)
		if (error) {
		// some error prevented the list to be parsed (input file wrong syntax or twitter API-related error
			console.log('error querying twitter API for list members')
			console.log(error);
			someErrors = true;
			processedLists++;
		}
		else if (JSON.parse(body).error) {
			console.log('error querying twitter API for list members')
			if ( JSON.parse(body).error=='Rate limit exceeded. Clients may not make more than 150 requests per hour.' ) {
			// twitter rate limit has been reached, save extraction status to re-run the process later
				console.log('twitter rate limiting reached');
				callback();
				saveProcessingStatus();
			}
			else {
			// some error prevented the list to be parsed (input file wrong syntax or twitter API-related error
				console.log(JSON.parse(body).error, JSON.parse(body).request);
				someErrors = true;
				processedLists++;
			}
		}
		else {
		// processing result 
			var result = JSON.parse(body)
			for (var i in result.users) {
				if (members.indexOf(result.users[i].screen_name) == -1)
				// saving member in case he is not already listed
					members.push(result.users[i].screen_name);
			}
			//save status 
			updateListStatus(list, owner, result.next_cursor);
			if (result.next_cursor && result.next_cursor !=0)
			// process next page of results for this list
				getListMembers(list, owner, result.next_cursor, callback)
			else {
			//processing of the list is finished
				processedLists++;
				if (processedLists == lock) {
					if (someErrors && members.length == 0)
						console.log('Extractions have failed - no result could be retrieved. Please check your lists file content and twitter APIs status');
					else {
						if (someErrors)
							console.log('Some extractions have failed - storing partial results if any inside file results-incomplete.txt');
						else
							console.log('members from all lists have been extracted successfully :)');
						callback();
					}
				}
			}
		}
// todo: handle errors
	});
}

function updateListStatus(list, owner, cursor) {
// save status of data processing
	for (var i in twitterLists) {
		if (twitterLists[i].owner == owner && twitterLists[i].listName == list) {
			if (cursor == 0)
				twitterLists[i].process_complete = true;
			else 
				twitterLists[i].processed_until = cursor;
		}
	}
}

function saveListMembers() {
// save members list in a txt file, one username per row

	if (someErrors)
		fileName = 'results-incomplete.txt';
	else 
		fileName = 'results.txt';

	fs.writeFile(fileName, members.join('\n'), function(err) {
		if(err) {
			console.log('error saving results file: '+ err);
		} else {
			console.log("... results were saved!");
		}
	});
}

function saveProcessingStatus() {
// save members list in a txt file, one username per row
	fs.writeFile('lists.json', JSON.stringify({"lists": twitterLists}), function(err) {
		if(err) {
			console.log('error updating the list of twitter lists'+ err);
		} else {
			console.log("... List of twitter lists to parse has been updated");
			console.log("exiting process");
			process.exit(1);
		}
	});	
}

function readListsToParse() {
// 1. read list of twitter lists to be parsed
	fs.readFile('lists.json', 'ascii', function(err,data){
		if(err) {
			console.error("Could not open file: %s", err);
		process.exit(1);
		}
		
		twitterLists = JSON.parse(data).lists;
		
		for (var i in twitterLists) {
		// 2. query twitter API for members		
			if (!twitterLists[i].process_complete && twitterLists[i].listName !='' && twitterLists[i].owner!='') {
				// increase the number of lists counter
				lock++;
				// retrieve previous cursor (next page index) in case partial extraction has already been done
				cursor = twitterLists[i].processed_until?twitterLists[i].processed_until:-1;
				console.log('extracting members from list '+ twitterLists[i].listName + ' from ' + twitterLists[i].owner)
				// query twitter API to retrieve twitter usernames
				getListMembers(twitterLists[i].listName, twitterLists[i].owner, cursor, saveListMembers);
			}
		}
	});	
}

// 0. initialize list with data present in result file
initializeList(readListsToParse);
