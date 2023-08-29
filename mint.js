import * as starknet from "starknet"
import {readWallets, sleep} from "./common.js";
import {getGroundKey, precalculateAddress, restoreSeedPhrase, starkProvider} from "./starknet.js";

const quantumContract = '?'

const mnemonics = readWallets('mnemonics.txt');

for (let mnemonic of mnemonics) {
    const wallet_eth = restoreSeedPhrase(mnemonic);
    const starkKeyPair = getGroundKey(0, wallet_eth.privateKey);
    const starkKeyPublic = starknet.ec.starkCurve.getStarkKey(starkKeyPair);
    const contractAddress = precalculateAddress(starkKeyPublic);

    const account = new starknet.Account(
      starkProvider,
      contractAddress,
      starkKeyPair
    )

    let callIdentity = {
      contractAddress: quantumContract,
      entrypoint: "mint?",
      calldata: ['?'],
    };

    let exec_hash = await account.execute([callIdentity]);

    console.log(`${contractAddress}: Done -> ${exec_hash}`)

    await sleep(1.5 * 1000);
}