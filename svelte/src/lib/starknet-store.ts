
import { proxied } from 'svelte-proxied-store'
import { readable } from 'svelte/store'
import {Contract, json, Provider} from 'starknet';

export const createStore = () => {
  const provider = readable(null, (set) => {
      set(new Provider({
        network: 'goerli-alpha',
        feederGatewayUrl: 'feeder_gateway',
        gatewayUrl: 'gateway',
      }));
      return function stop() {set(null)};
    });


  const setBrowserProvider = () => setProvider()

  const disconnect = async () => {
    provider.stop();
  }

  return {
    setBrowserProvider,
    setProvider,
    disconnect,
    subscribe,
    get
  }
}

export const makeEvmStores = name => {
  const evmStore = (allStores[name] = createStore())
  const registry = createContractStore()
  const target = {}

  allStores[name].connected = derived(
    evmStore,
    $evmStore => $evmStore.connected
  )

  allStores[name].provider = derived(evmStore, $evmStore => $evmStore.provider)
  allStores[name].chainId = derived(evmStore, $evmStore => $evmStore.chainId)
  allStores[name].chainData = derived(evmStore, $evmStore =>
    $evmStore.chainId ? getData($evmStore.chainId) : {}
  )

  allStores[name].signer = derived(evmStore, $evmStore => $evmStore.signer)
  allStores[name].signerAddress = derived(
    evmStore,
    $evmStore => $evmStore.signerAddress
  )

  allStores[name].evmProviderType = derived(
    evmStore,
    $evmStore => $evmStore.evmProviderType
  )

  allStores[name].contracts = derived(
    [ evmStore, registry ],
    ([ $evmStore, $registry ]) => {
      if (!$evmStore.connected) return target
      for (let key of Object.keys($registry)) {
        target[key] = new ethers.Contract(
          $registry[key][0],
          $registry[key][1],
          !$registry[key][2] || !$evmStore.signer ? $evmStore.provider : $evmStore.signer
        )
      }
      return target
    }
  )

  // force one subscribtion on $contracts so it's defined via proxy
  allStores[name].contracts.subscribe(()=>{})

  return new Proxy(allStores[name], {
    get: function (internal, property) {
      if (property === '$contracts') return target
      if (/^\$/.test(property)) {
        // TODO forbid deconstruction !
        property = property.slice(1)
        if (subStoreNames.includes(property))
          return allStores[name].get(property)
        throw new Error(`[svelte-ethers-store] no store named ${property}`)
      }
      if (property === 'attachContract') return registry.attachContract
      if (
        [
          'setBrowserProvider',
          'setProvider',
          'disconnect',
          ...subStoreNames
        ].includes(property)
      )
        return Reflect.get(internal, property)
      throw new Error(`[svelte-ethers-store] no store named ${property}`)
    }
  })
}

const allStores = {}

export const defaultEvmStores = makeEvmStores()

export const connected = allStores.connected
export const provider = allStores.provider
