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

	const disconnect = async () => {
		if ($connected)
    		await defaultEvmStores.disconnect();
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
