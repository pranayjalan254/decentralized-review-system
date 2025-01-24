require("dotenv").config();

const cli = require("@aptos-labs/ts-sdk/dist/common/cli/index.js");

async function test() {
  const move = new cli.Move();

  await move.test({
    packageDirectoryPath: "/home/ghostrider/Blockchain/review2/decentralized-review-system/smartcontracts/",
    namedAddresses: {
      launchpad_addr: "0x8da516e736ab6f2933d5f7bc6aded99b276035e5891ad75038b21a87b770533e",
    },
  });
}
test();
