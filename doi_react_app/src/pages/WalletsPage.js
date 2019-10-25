import React, {useEffect, useState, useGlobal, setGlobal, addCallback} from 'reactn';
import bitcore from "bitcore-doichain";
import WalletList from "../components/WalletList";
import Slide from "@material-ui/core/Slide";
import TextField from '@material-ui/core/TextField';
import WalletItem from "../components/WalletItem";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';

const WalletsPage = () => {

    const [walletItemsChanged, setWalletItemsChanged] = useState(false)
    const [wallets, setWallets] = useGlobal("wallets")
    const [activeWallet, setActiveWallet ] = useGlobal("activeWallet")
    const [modus, setModus] = useGlobal("modus")
    const [global] = useGlobal()
    console.log(wallets)
    useEffect(() => {
    },[modus])

    const addWallet = (walletName,senderEmail, subject,content,contentType,redirectUrl,returnPath) => {

        const our_walletName = "Example Wallet"
        const our_senderEmail = "info@doichain.org"
        const our_subject = "Doichain Contacts Request"
        const our_content = "Hello, please give me permission to write you an email.\n\n${confirmation_url}\n\n Yours\n\nNico"
        const our_contentType = "text/plain"
        const our_redirectUrl = "http://www.doichain.org"
        const our_returnPath = "doichain@doichain.org"

        if(!walletName) walletName = our_walletName
        if(!senderEmail) senderEmail = our_senderEmail
        if(!subject) subject = our_subject
        if(!content) content = our_content
        if(!contentType) contentType = our_contentType
        if(!redirectUrl) redirectUrl = our_redirectUrl
        if(!returnPath) returnPath = our_returnPath

        const ourWallet = bitcore.createWallet(walletName)
        const wallet = {}
        wallet.walletName = walletName
        wallet.senderEmail = senderEmail
        wallet.subject = subject
        wallet.content = content
        wallet.contentType = contentType
        wallet.redirectUrl = redirectUrl
        wallet.returnPath = returnPath
        wallet.privateKey = ourWallet.privateKey.toString()
        wallet.publicKey = ourWallet.publicKey.toString()

        let newwallets = wallets
        newwallets.push(wallet)
        console.log("adding wallet",wallet)
        setWallets(wallets)
        setWalletItemsChanged(true);
        setActiveWallet(wallets.length-1)
        setModus('detail')
    }

    const updateWallet = (walletName,senderEmail, subject,content,contentType,redirectUrl,returnPath) => {

        const wallet = wallets[activeWallet]
        wallet.walletName = walletName
        wallet.senderEmail = senderEmail
        wallet.subject = subject
        wallet.content = content
        wallet.contentType = contentType
        wallet.redirectUrl = redirectUrl
        wallet.returnPath = returnPath

        wallets[activeWallet] = wallet
        setWallets(wallets)
        setWalletItemsChanged(true);
        setModus('detail')
    }

    useEffect(() => {
        setWalletItemsChanged(false)
    },[walletItemsChanged])

    const handleCancel = (e) => {
        setModus('list')
        setActiveWallet(undefined)
    };

    const ComponentHead = () => {
        return (<h1>DoiCoin Wallets</h1>)
    }

    if(global.modus === 'list'){
        return (
            <div>
            <ComponentHead/>
            <WalletList checked={activeWallet!==undefined} />
            <div style={{float:'right'}}>
                <Fab aria-label={"new contact"}
                     color={"primary"}
                     style={{position: 'absolute',
                         right: "7em",
                         bottom: "3em"}}
                     onClick={() =>  {
                         setModus("add")
                         setActiveWallet(undefined)
                     }}>
                    <AddIcon />
                </Fab>
            </div>
        </div>)
    }
    else{
            if(global.modus==='detail') {
                return (
                    <div>
                        <ComponentHead/>
                        <Slide aria-label="wallet-detail"
                               direction={"up"}
                               in={activeWallet !== undefined && global.modus === 'detail'}
                               mountOnEnter unmountOnExit>
                            <div>
                                <WalletItem
                                    walletName={global.wallets[global.activeWallet].walletName}
                                    senderEmail={global.wallets[global.activeWallet].senderEmail}
                                    subject={global.wallets[global.activeWallet].subject}
                                    content={global.wallets[global.activeWallet].content}
                                    publicKey={global.wallets[global.activeWallet].publicKey}
                                    contentType={global.wallets[global.activeWallet].contentType}
                                    redirectUrl={global.wallets[global.activeWallet].redirectUrl}
                                    returnPath={global.wallets[global.activeWallet].returnPath}/>

                                <Button color={'primary'} variant="contained"  onClick={() => handleCancel()}>Cancel</Button>
                            </div>
                        </Slide>
                    </div>
                )
            } else if(global.modus==='edit' || global.modus === 'add') {
                return (
                        <div>
                        <ComponentHead/>
                        <Slide aria-label="wallet-edit"
                               direction={"up"}
                               in={global.modus === 'edit' || global.modus === 'add'}
                               mountOnEnter unmountOnExit>
                            <div>

                                <form onSubmit={(e) => {
                                    e.preventDefault();

                                    const walletName = e.target.walletName.value
                                    const senderEmail = e.target.senderEmail.value
                                    const subject = e.target.subject.value
                                    const content = e.target.content.value
                                    const contentType = e.target.contentType.value
                                    const redirectUrl = e.target.redirectUrl.value
                                    const returnPath = e.target.returnPath.value

                                    if(activeWallet===undefined)
                                        addWallet(walletName,senderEmail,subject,content, contentType, redirectUrl,returnPath)
                                    else
                                        updateWallet(walletName,senderEmail,subject,content, contentType, redirectUrl,returnPath)

                                }}>

                                    <TextField
                                        id="walletName"
                                        name="walletName"
                                        label="Wallet Name"
                                        fullWidth={true}
                                        defaultValue={wallets[activeWallet]?wallets[activeWallet].walletName:''}
                                        margin="normal"
                                    /> <br/>

                                    <TextField
                                        id="senderEmail"
                                        label="Sender email"
                                        fullWidth={true}
                                        defaultValue={wallets[activeWallet]?wallets[activeWallet].senderEmail:''}
                                        margin="normal"
                                    /> <br/>

                                    <TextField
                                        id="subject"
                                        label="Subject"
                                        fullWidth={true}
                                        defaultValue={wallets[activeWallet]?wallets[activeWallet].subject:'no wallet'}
                                        margin="normal"
                                    /> <br/>

                                    <label >Content-Type</label><br/>
                                    <select name="contentType" defaultValue={wallets[activeWallet] && wallets[activeWallet].contentType}>
                                        <option value="text">text/plain</option>
                                        <option value="html">text/html</option>
                                        <option value="json">text/json (mixed) </option>
                                    </select>
                                    <br/>

                                    <TextField
                                        id="content"
                                        label="Email Content Template"
                                        fullWidth={true}
                                        rows={5}
                                        defaultValue={wallets[activeWallet]?wallets[activeWallet].content:''}
                                        margin="normal"
                                    /> <br/>

                                    <TextField
                                        id="redirectUrl"
                                        label="Redirect URL (after commit)"
                                        fullWidth={true}
                                        defaultValue={wallets[activeWallet]?wallets[activeWallet].redirectUrl:''}

                                        margin="normal"
                                    />     <br/>

                                    <TextField
                                        id="returnPath"
                                        label="ReturnPath (email)"
                                        fullWidth={true}
                                        defaultValue={wallets[activeWallet]?wallets[activeWallet].returnPath:''}

                                        margin="normal"
                                    />     <br/>

                                    <Button color={'primary'} variant="contained">
                                        {(activeWallet!==undefined)?'Update Wallet':'Add Wallet'}
                                    </Button>
                                </form>
                                <Button color={'primary'} variant="contained"  onClick={() => handleCancel()}>Cancel</Button>
                            </div>
                        </Slide>
                    </div>
                )
            }
    }
}

export default WalletsPage