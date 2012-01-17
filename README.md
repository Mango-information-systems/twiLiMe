# twiLiMe - extracting members from twitter lists

Small node.js utility to extract all twitter usernames contained from twitter lists.

## features
* Extracts all twitter usernames from many lists into a single txt file.
* No twitter authentication required - only public lists are browsable
* Resumes extraction when interrupted by twitter hourly rate limiting.

## Installation

1. Get the source code from github:
    <pre>
      git clone git://github.com/mef/twiLiMe.git 
      cd twiLiMe
    </pre>

2. Install dependency: request node.js module
    <pre>
      npm install -d
    </pre>

3. You're ready to go

## How to use

1. write the names of the lists you want to process inside lists.json file. All you need is the name of list owner and name of the list. Example file:

````javascript
{
  "lists":[
	{
	  "owner": "Support",
	  "listName": "international-support
	},
	{
	  "owner": "crystal",
	  "listName": "twizzles"
	}
  ]
}
````

2. execute the application :
    <pre>
      node twiLiMe.js
    </pre>

3. read output from the command line. Execution is completed successfully in case the following output is displayed:
    members from all lists have been extracted successfully :)
    ... results were saved!
    
The file results.txt stores the list of usernames.

## guidelines
During the processing, the lists.json file will be updated to store the progress of the extraction. keep a copy of the original file in case you want to re-use it for another purpose 

## Twitter rate limit

In case you want to extract large amount of data, you will reach the twitter API's hourly rate limit: https://dev.twitter.com/docs/rate-limiting.

In such case re-run the previous step every hour to resume the extraction.

You can use CRON or another scheduling tool to do this.

## Dependencies

This app uses Mikeal's [request](https://github.com/mikeal/request) library. Obviously, you should also have node.js working on your machine.

## Status
Under development. Basic tests have been performed and were successful under nodejs. 0.4.12.

JSON response from twitter sometimes fails to parse correctly.

## To do
support user authentication to increase rate limit and get able to extract from private lists to which the authenticated user has access

## License

This software is licensed under MIT License, please read LICENSE file. Do not hesitate to ask in case you want to use it under terms of another open source license.



