JADE = $(shell find . -path "*node_modules*" -prune -o -type f -name "*.jade" -print)
HTML = $(JADE:.jade=.html)
LESS = $(shell find . -path "*node_modules*" -prune -o -type f -name "*.less" -print)
CSS  = $(LESS:.less=.css)

all: $(HTML) $(CSS)

%.html: %.jade
		../node_modules/jade/bin/jade < $< --path $< > $@

%.css: %.less
		../node_modules/less/bin/lessc --yui-compress --include-path=assets/less $< $@

clean:
		rm -f $(HTML) $(CSS)

.PHONY: clean
