# StarkNet.js + Nile + Forge + Svelte-web3

## Blockchain Layer 1 & 2

### Build setup

Setup a virtual environment, currently only working with python 3.9

`virtualenv venv -p python3.9`

or 

`python3 -m venv env` if your python version is still 3.9 (use `python
--version` to determine your version.

Activate your virtual environment

`source venv/bin/activate`

Install [OpenZepplin nile](https://github.com/OpenZeppelin/nile)

`pip install cairo-nile`

Install StarkNet dev tools using nile

`nile install`

### StarkNet

[Setup yourself an account using nile](https://github.com/OpenZeppelin/nile#setup)

Either use a `.env` file (preferred) or export an environnement variable

```export bogusprivatekey=9876
nile setup bogusprivatekey
```

### Contracts

How to setup contracts, order matters for the artifacts and deployments, first
build all, then deploy StarkNet, initialize and then deploy solidity contracts.

#### StarkNet

##### Build

`make build`

##### Deploy

`nile deploy --network goerli counter`

##### Verify

The `contracts` directory contains a simple Cairo contract with the following
function:

Getters:
- `getCounter()`: returns the current counter value and wether or not it's on
  StarkNet.
- `get_l1_gateway()`: returns L1 ethereum address

Setters:
- `count()`: increment the counter by the given amount.
- `SNtoEVM()`: Send count value to L1 contract via StarkNet messaging.

Layer 1 Handler:
 - `EVMtoSN()`: L1 handler to receive counter value and enable counter on
   StarkNet.

The contract is deployed at [``](https://voyager.online/contract/0x5ee069079158344aef3526153db4ba7a3e39481a285059f21c34c4592ed5b2d)
on StarkNet alpha 4.

#### Ethereum

##### Build

`make build`

##### Deploy

Deploy contract with latest StarkNet deployment

`make deploy`

##### Verify

Verify contract on Goerli with metadata from StarkNet and Forge

`forge verify-contract --chain-id 5 --num-of-optimizations `jq < out/counter.sol/Counter.metadata.json .settings.optimizer.runs`  --constructor-args \
$(cast abi-encode "constructor(uint256)" `grep artifacts/abis/counter.json goerli.deployments.txt | tail -n 1 | sed -e 's/0x\([0-9a-zA-Z]\+\).*/\1/'`) \
--compiler-version v`jq -r < out/counter.sol/Counter.metadata.json .compiler.version` $(jq -r < `ls out/deployment-Counter* | sort -n | tail -n 1` .deployedTo) contracts/solidity/counter.sol:Counter <etherscan-api-key>`

 - etherscan-api-key: Sign in and go to [Etherscan API key](https://etherscan.io/myapikey)

### Useful links

## Svelte (Web App)

### Developing

Once you've created a project and installed dependencies with `yarn install`, start a development server:

```bash
yarn run dev


 or start the server and open the app in a new browser tab
yarn run dev -- --open
```

### Building

To create a production version of your app:

```bash
yarn run build
```

You can preview the production build with `yarn run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
