import Caver from "caver-js";
let isItConnected = false;

let accounts;
const getAccounts = async () => {
  const { klaytn } = window;
  try {
    accounts = await klaytn.selectedAddress;
    console.log("Acc", accounts);
    return accounts;
  } catch (error) {
    console.log("Error while fetching acounts: ", error);
    return null;
  }
};

export const loadWeb3 = async () => {
  try {
    const { klaytn } = window;
    if (klaytn) {
      //   caver = new Caver(window.klaytn);
      await klaytn.enable();
      let netId = await klaytn.networkVersion;
      switch (netId.toString()) {
        case "1001":
          isItConnected = true;
          break;
        default:
          isItConnected = false;
      }
      if (isItConnected == true) {
        let accounts = await getAccounts();
        // console.log("acc:,",accounts);
        return accounts;
      } else {
        let res = "Wrong Network";
        return res;
      }
    } else {
      let res = "No Wallet";
      //   return res;
      console.log("no wallet");
    }
  } catch (error) {
    let res = "No Wallet";
    return res;
  }
};
