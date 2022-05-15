#!/usr/bin/env sh

source venv/bin/activate
RPC_URL=https://eth-goerli.alchemyapi.io/v2/kCzNVIXfuNMeTJUE66sxadw_bme0pPi0
PRIVATE_KEY=8906f19eb19c4c46767b15e714af428460ad8aab82d60d15bd0527177526d785
DATE=$(date +%s)

nile deploy --network goerli counter && \
forge create --extra-output-files metadata --rpc-url "${RPC_URL}" --private-key "${PRIVATE_KEY}" contracts/solidity/counter.sol:Counter \
  --constructor-args `grep artifacts/abis/counter.json goerli.deployments.txt | \
  tail -n 1 | sed -e 's/0x\([0-9a-zA-Z]\+\).*/\1/'` --json | tee out/deployment-Counter-"${DATE}".json
