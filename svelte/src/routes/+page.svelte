<script lang="ts">
	import Counter from '$lib/Counter.svelte';

	import { onMount } from 'svelte';

	import { ethers } from 'ethers';
	import {
		connected,
		provider,
		signer,
		chainId,
		signerAddress,
		defaultEvmStores
	} from 'svelte-ethers-store';
	import Web3Modal from 'web3modal';

	let type;
	let pending = false;

	const enable = async () => {
		pending = true;
		/*
		const providerOptions = {
			walletconnect: {
				package: WalletConnectProvider,
				options: {
					rpc: {
						100: 'https://dai.poa.network'
					}
				}
			}
		};
		const web3Modal = new Web3Modal({
			providerOptions
		});
		const provider = await web3Modal.connect();*/
		let WalletConnectProvider = window.WalletConnectProvider.default
		const provider = new WalletConnectProvider({
			rpc: {
				1: "https://eth-mainnet.alchemyapi.io/v2/8UxYGtbZkkBdBL5AoED8Go6ZhJP_LC3W",
				5: "https://eth-goerli.alchemyapi.io/v2/kCzNVIXfuNMeTJUE66sxadw_bme0pPi0",
				137: "https://polygon-mainnet.g.alchemy.com/v2/As4Z0QB1e5xwpNozc-0RCwmJbovBQI7p"
			}
		})
		//  Enable session (triggers QR Code modal)
		await provider.enable();
		defaultEvmStores.setProvider(provider);
		pending = false;
	};

	const disconnect = async () => {
    	await defaultEvmStores.disconnect();
    	pending = false;
  	}

	$: network = $connected ? $provider.getNetwork() : '';
	$: account = $connected && $signer ? $signer.getAddress() : '';
</script>

<svelte:head>
	<title>Goërli</title>
	<meta name="description" content="Goërli counter UI" />
</svelte:head>

<section>
	<Counter />
	<button class="button" disabled={pending} on:click={enable}>Connect with Web3modal</button>
	{#if pending}connecting...{/if}


	{#if $connected}
  
	<p>
	  Well done, you are now connected to the blockchain (account {$signerAddress})
  
	  {#await network}
	  <span>waiting...</span>
	  {:then value}
	  <span>{JSON.stringify(value)}</span>
	  {/await}
  
	  {#await account}
	  <span>waiting...</span>
	  {:then value}
	  with {#if value}account {value}{:else}no account{/if}
	  {/await}
  
	</p>
  
	<button class="button" on:click={disconnect}> Disconnect </button>
  
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
</style>
