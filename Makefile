TS = $(shell find . -name "*.ts")
JS = $(TS:.ts=.js)
DTS = $(TS:.ts=.d.ts)

all: $(JS)

%.js: %.ts
	tsc --out out/$@ $<
clean:
	rm -f $(JS) $(DTS)

.PHONY: clean
