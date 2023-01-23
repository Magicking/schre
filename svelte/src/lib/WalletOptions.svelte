<script lang="ts">
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
    
    let open = false;
	let pending = false;

	const walletConnect = async () => {
		pending = true;
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
    const injected = async () => {
    	pending = true;
    	const provider = new ethers.providers.Web3Provider(window.ethereum);
    	defaultEvmStores.setProvider(provider);
    	pending = false;
    }

	const disconnect = async () => {
    	await defaultEvmStores.disconnect();
    	pending = false;
  	}
/*
	$: network = $connected ? $provider.getNetwork() : '';
	$: account = $connected && $signer ? $signer.getAddress() : '';
    */
</script>
<section>
    <details bind:open>
        <summary>Wallet: {$connected}</summary>
	    <button class="button" disabled={pending} on:click={walletConnect}>WalletConnect</button>
	    <button class="button" disabled={pending} on:click={injected}>Injected</button>
    </details>
</section>