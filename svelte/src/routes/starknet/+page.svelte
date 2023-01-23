<script lang="ts">
	import Counter from '$lib/Counter.svelte';

	import { onMount } from 'svelte';
	import {Contract, json, Provider} from 'starknet';
	import { writable } from 'svelte/store';

	const contractAddr = '0x04516dd716ce43ea93ed1479baf811b0156e432aef855b458a465fe1299761bb';
	const abi = json.parse("[{\"inputs\":[],\"name\":\"count\",\"outputs\":[{\"name\":\"count\",\"type\":\"felt\"}],\"type\":\"function\"},{\"inputs\":[],\"name\":\"getCounter\",\"outputs\":[{\"name\":\"count\",\"type\":\"felt\"},{\"name\":\"on_stark_net\",\"type\":\"felt\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"get_l1_gateway\",\"outputs\":[{\"name\":\"_l1_gateway\",\"type\":\"felt\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"name\":\"from_address\",\"type\":\"felt\"},{\"name\":\"_counter\",\"type\":\"felt\"}],\"name\":\"EVMtoSN\",\"outputs\":[],\"type\":\"l1_handler\"},{\"inputs\":[],\"name\":\"SNtoEVM\",\"outputs\":[],\"type\":\"function\"}]");
	const counte = writable(0);
	let countValue;

	counte.subscribe(value => {
		countValue = value;
		console.log(countValue)
	})
	onMount(async () => {
		const provider = new Provider({
			baseUrl: 'https://alpha4.starknet.io',
			feederGatewayUrl: 'feeder_gateway',
			gatewayUrl: 'gateway',
		});

		const counter = new Contract(abi, contractAddr, provider);
		const {count, on_stark_net} = await counter.getCounter();
		counte.set(count.toNumber());
	});
</script>

<svelte:head>
	<title>StarkNet</title>
	<meta name="description" content="StarkNet counter UI" />
</svelte:head>

<section>
	<Counter /> {countValue}
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
