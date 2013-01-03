test: test-zip test-response test-command test-protocol test-packet
test-zip:
	node_modules/nodeunit/bin/nodeunit test_zip.js
test-response:
	node_modules/nodeunit/bin/nodeunit test_response.js
test-command:
	node_modules/nodeunit/bin/nodeunit test_command.js
test-protocol:
	node_modules/nodeunit/bin/nodeunit test_protocol.js
test-packet:
	node_modules/nodeunit/bin/nodeunit test_packet.js
test-model:
	# 经常出错, 如何修复?
	node_modules/nodeunit/bin/nodeunit test_model.js

stat:
	wc -l `find . -path "*node_modules*" -prune -o -type f -name "*.js" -print`
