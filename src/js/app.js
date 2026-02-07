console.log("App.js is loading...");

App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 0,
    tokensSold: 0,
    tokensAvailable: 750000,

    log: function (message) {
        console.log(message);
        $('#debug-log').append('<p>' + message + '</p>');
    },

    init: async function () {
        console.log("App initialized...");
        this.log("App initialized...");

        // Safety timeout
        setTimeout(() => {
            if ($('#loader').is(':visible')) {
                this.log('<strong class="text-danger">Loading timed out. Check console.</strong>');
                $('#loader').append(`
          <p class="text-center text-danger">
            <strong>Loading timed out.</strong><br>
            Ensure MetaMask is unlocked and connected to Ganache (7545).
          </p>
        `);
            }
        }, 10000); // Increased to 10 seconds

        await this.initWeb3();
        this.initContracts();
    },

    initWeb3: async function () {
        this.log("Initializing Web3...");

        if (window.ethereum) {
            this.log("Modern Dapp Browser detected.");
            this.web3Provider = window.ethereum;

            try {
                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.log("MetaMask enabled.");
            } catch (error) {
                console.error("User denied account access:", error);
                this.log("User denied account access: " + error.message);
                return;
            }
        }
        else if (window.web3) {
            this.log("Legacy Web3 detected.");
            this.web3Provider = window.web3.currentProvider;
        }
        else {
            this.log("Non-Ethereum browser detected. Using Localhost.");
            this.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
        }

        // Instantiate Web3 with the selected provider
        web3 = new Web3(this.web3Provider);
        this.log("Web3 initialized successfully.");
    },

    initContracts: function () {
        this.log("Initializing contracts...");

        $.getJSON("VinayTokenSale.json", (saleArtifact) => {
            this.contracts.VinayTokenSale = TruffleContract(saleArtifact);
            this.contracts.VinayTokenSale.setProvider(this.web3Provider);
            this.log("VinayTokenSale loaded.");

            $.getJSON("VinayToken.json", (tokenArtifact) => {
                this.contracts.VinayToken = TruffleContract(tokenArtifact);
                this.contracts.VinayToken.setProvider(this.web3Provider);
                this.log("VinayToken loaded.");

                this.listenForEvents();
                this.render();
            }).fail((error) => {
                this.log("ERROR loading VinayToken.json: " + error.statusText);
                console.error("Failed to load VinayToken.json", error);
            });
        }).fail((error) => {
            this.log("ERROR loading VinayTokenSale.json: " + error.statusText);
            console.error("Failed to load VinayTokenSale.json", error);
        });
    },

    listenForEvents: function () {
        this.contracts.VinayTokenSale.deployed().then((instance) => {
            instance.Sell({}, { fromBlock: 0, toBlock: 'latest' })
                .on('data', () => this.render())
                .on('error', console.error);
        });
    },

    render: function () {
        if (this.loading) {
            this.log("Render already in progress, skipping...");
            return;
        }
        this.loading = true;
        this.log("Starting render...");

        const loader = $('#loader');
        const content = $('#content');

        loader.show();
        content.hide();

        web3.eth.getAccounts().then((accounts) => {
            if (!accounts.length) {
                this.log("ERROR: No accounts found. Is MetaMask locked?");
                loader.html('<p class="text-danger text-center">MetaMask locked.</p>');
                this.loading = false;
                return Promise.reject("No accounts");
            }

            this.account = accounts[0];
            this.log("Account found: " + this.account);
            $('#accountAddress').html("Your Account: " + this.account);

            return web3.eth.net.getId();
        }).then((networkId) => {
            this.log("Network ID: " + networkId);

            return this.contracts.VinayTokenSale.deployed();
        }).then((saleInstance) => {
            this.log("VinayTokenSale deployed instance retrieved.");
            this.saleInstance = saleInstance;
            return saleInstance.tokenPrice();
        }).then((price) => {
            this.log("Token price retrieved: " + price.toString());
            this.tokenPrice = price;
            $('.token-price').html(
                web3.utils.fromWei(price.toString(), 'ether')
            );
            return this.saleInstance.tokensSold();
        }).then((sold) => {
            this.log("Tokens sold: " + sold.toString());
            this.tokensSold = sold.toNumber();
            $('.tokens-sold').html(this.tokensSold);
            $('.tokens-available').html(this.tokensAvailable);

            const progress = (this.tokensSold / this.tokensAvailable) * 100;
            $('#progress').css('width', progress + '%');

            return this.contracts.VinayToken.deployed();
        }).then((tokenInstance) => {
            this.log("VinayToken deployed instance retrieved.");
            return tokenInstance.balanceOf(this.account);
        }).then((balance) => {
            this.log("Token balance: " + balance.toString());
            $('.dapp-balance').html(balance.toNumber());
            this.loading = false;
            loader.hide();
            content.show();
            this.log("SUCCESS: Page loaded!");
        }).catch((err) => {
            console.error("Render error:", err);
            this.log("ERROR in render: " + err.message);
            loader.html('<p class="text-danger text-center">' + err.message + '</p>');
            this.loading = false;
        });
    },

    buyTokens: function () {
        const numberOfTokens = $('#numberOfTokens').val();
        this.log("Attempting to buy " + numberOfTokens + " tokens...");

        $('#content').hide();
        $('#loader').show();
        $('#loader').html('<p class="text-center">Processing transaction...</p>');

        this.contracts.VinayTokenSale.deployed().then((instance) => {
            // Calculate value: tokenPrice * numberOfTokens (both in wei)
            // Use BigNumber multiplication to avoid floating-point errors
            const value = this.tokenPrice.mul(web3.utils.toBN(numberOfTokens));

            this.log("Sending " + web3.utils.fromWei(value.toString(), 'ether') + " ETH for " + numberOfTokens + " tokens");

            return instance.buyTokens(numberOfTokens, {
                from: this.account,
                value: value.toString(),
                gas: 500000
            });
        }).then((receipt) => {
            this.log("Tokens purchased successfully! Transaction: " + receipt.tx);
            $('#numberOfTokens').val('');
            // Refresh the page to show updated balances
            this.loading = false;
            return this.render();
        }).catch((err) => {
            this.log("ERROR buying tokens: " + err.message);
            console.error("Buy tokens error:", err);
            $('#loader').hide();
            $('#content').show();
            this.loading = false;
        });
    },

    transferTokens: function () {
        const recipient = $('#recipientAddress').val().trim();
        const amount = $('#transferAmount').val();

        // Validate Ethereum address format
        if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
            this.log("ERROR: Invalid recipient address format");
            alert("Please enter a valid Ethereum address (0x followed by 40 hex characters)");
            return;
        }

        this.log("Attempting to transfer " + amount + " VIN to " + recipient + "...");

        $('#content').hide();
        $('#loader').show();
        $('#loader').html('<p class="text-center">Processing transfer...</p>');

        this.contracts.VinayToken.deployed().then((instance) => {
            this.log("Sending " + amount + " tokens to " + recipient);

            return instance.transfer(recipient, amount, {
                from: this.account,
                gas: 100000
            });
        }).then((receipt) => {
            this.log("Transfer successful! Transaction: " + receipt.tx);
            $('#recipientAddress').val('');
            $('#transferAmount').val('1');
            // Refresh the page to show updated balances
            this.loading = false;
            return this.render();
        }).catch((err) => {
            this.log("ERROR transferring tokens: " + err.message);
            console.error("Transfer error:", err);
            $('#loader').hide();
            $('#content').show();
            this.loading = false;
        });
    }
};

$(window).on('load', function () {
    console.log("Window loaded, initializing App...");
    App.init();
});