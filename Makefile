TS = $(shell find . -name "*.ts")
JS = $(TS:.ts=.js)

all: $(JS)

%.js: %.ts
	tsc $<
clean:
	rm -f $(JS)

.PHONY: clean
