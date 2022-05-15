# Build and test
build :; nile compile contracts/cairo/counter.cairo
		forge build --extra-output-files metadata
deploy:; ./deploy.sh

test  :; pytest tests/
