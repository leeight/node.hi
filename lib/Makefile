test:
	node_modules/nodeunit/bin/nodeunit test_zip.js
	node_modules/nodeunit/bin/nodeunit test_response.js
	node_modules/nodeunit/bin/nodeunit test_command.js
	node_modules/nodeunit/bin/nodeunit test_protocol.js
	node_modules/nodeunit/bin/nodeunit test_packet.js

stat:
	wc -l `find . -path "*node_modules*" -prune -o -type f -name "*.js" -print`
