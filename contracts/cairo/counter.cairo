# Declare this file as a StarkNet contract and set the required
# builtins.
%lang starknet
%builtins pedersen range_check

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.starknet.common.messages import send_message_to_l1
from starkware.cairo.common.math import assert_le, assert_not_zero


# l1 gateway address
@storage_var
func l1_gateway() -> (res : felt):
end

# keep track of the counter
@storage_var
func counter() -> (res : felt):
end

# keep track of the counter
@storage_var
func isOnStarkNet() -> (res : felt):
end

# TODO Add nonce

@external
func count{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (count : felt):
    let (onStarkNet) = isOnStarkNet.read()
    assert onStarkNet = 1
    let (currentCounter) = counter.read()

    counter.write(currentCounter+1)
    return (count=currentCounter+1)
end

@view
func getCounter{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (count : felt, on_stark_net: felt):
    let (count) = counter.read()
    let (is_on_stark_net) = isOnStarkNet.read()
    return (count=count, on_stark_net=is_on_stark_net)
end

@view
func get_l1_gateway{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (_l1_gateway : felt):
    let (res) = l1_gateway.read()
    return (_l1_gateway=res)
end

@l1_handler
func EVMtoSN{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        from_address : felt, _counter : felt):
    let (onStarkNet) = isOnStarkNet.read()
    assert onStarkNet = 0
    l1_gateway.write(from_address)

    let (currentCounter) = counter.read()
    assert_le(currentCounter, _counter)

    counter.write(_counter)
    isOnStarkNet.write(1)

    return ()
end

@external
func SNtoEVM{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}():
    let (onStarkNet) = isOnStarkNet.read()
    assert onStarkNet = 1
    let (l1_gateway_address) = l1_gateway.read()
    assert_not_zero(l1_gateway_address)
    let (currentCounter) = counter.read()

    let (message_payload : felt*) = alloc()
    assert message_payload[0] = currentCounter

    send_message_to_l1(to_address=l1_gateway_address, payload_size=1, payload=message_payload)

    isOnStarkNet.write(0)
    return ()
end
