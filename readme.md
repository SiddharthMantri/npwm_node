1. Search API: GET /search?q=any-text-here Suggest looking for terms that occur less frequently as POSTMAN might crash trying to load 5-6k results
2. Tweet Details: GET /tweet/<tweet_id> tweet_id is defined by the id column in the db
3. Add comment: POST /tweet/<tweet_id> Using same API but different HTTP method adds RESTful behavior to the application


Python version 2.7.6 to be used

install.sh will install the dependencies on any machine that is capable of running shell scripts
run.sh activates the virtual environment for python and runs the flask app

If the scripts do not run, just run the commands within each of the files in order