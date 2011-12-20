# twiLiMe - extracting members from twitter lists

Small node.js to extract all twitter usernames contained from twitter lists.

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

1. write the lists you wnat to process inside lists.json file. All you need to do is write the name of list owner and name of the list (see lists.json file for an example)

2. execute the application :
    <pre>
      node twiLiMe.js
    </pre>

3. open results.txt to read the list of usernames.

## Twitter rate limit

In case you want to extract large amount of data, you will reach the twitter API's hourly rate limit: https://dev.twitter.com/docs/rate-limiting.

In such case re-run the previous step every hour to resume the extraction.

You can use CRON or another scheduling tool to do this.

## Dependencies

This app uses Mikeal's request library. Obviously, you should also have node.js working on your machine.

## Status
Under development. Basic tests have been performed and were successful under nodejs. 0.4.12.

## To do
support user authentication to increase rate limit and get able to extract from private lists to which the authenticated user has access

## License

This software is licensed under MIT License, please read LICENSE file. Do not hesitate to ask in case you want to use it under terms of another open source license.



