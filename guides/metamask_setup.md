# How to Import Ganache Account to MetaMask

## Prerequisites
- **MetaMask** installed in your browser.
- **Ganache** running on `127.0.0.1:7545`.

## Steps

### 1. Connect MetaMask to Localhost
1. Open MetaMask.
2. Click on the **Network Dropdown** (top-left or top-right).
3. Select **Add Network** -> **Add a network manually**.
4. Fill in the details:
    - **Network Name**: Ganache Local
    - **RPC URL**: `http://127.0.0.1:7545`
    - **Chain ID**: `1337`
    - **Currency Symbol**: ETH
5. Click **Save**.

### 2. Get Private Key from Ganache
1. Open your Ganache UI (or look at the terminal if using CLI).
2. You will see a list of accounts (Addresses) and a **Key** icon on the right side of each row.
3. Click the **Key icon** for the first account (Index 0).
4. Copy the **Private Key** (do not include the generic `0x` prefix if the input field already handles it, but usually, complete copy is fine).

### 3. Import Account to MetaMask
1. Open MetaMask.
2. Click on the **Account Badge** (top circle icon) -> **Import Account** (or "Add account or hardware wallet" -> "Import account").
3. Paste the **Private Key** you copied from Ganache.
4. Click **Import**.

**Success!** You should now see an account with ~100 ETH (or slightly less if you deployed contracts) in MetaMask.
