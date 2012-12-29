test:
	node_modules/nodeunit/bin/nodeunit test_zip.js
	node_modules/nodeunit/bin/nodeunit test_response.js
	node_modules/nodeunit/bin/nodeunit test_command.js

stat:
	wc -l `find . -name "*.js" | grep -v 'node_modules'`
