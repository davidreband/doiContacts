import React, { useGlobal, useState } from "reactn"
import Welcome from "./Welcome"
import ConfirmRecoveryPhrase from "./ConfirmRecoveryPhrase"
import CreateNewWalletPage from "./CreateNewWalletPage"
import RestoreWalletPage from "./RestoreWalletPage"
import SetPassword from "./SetPassword"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import { Toolbar, IconButton, Typography } from "@material-ui/core"
import ArrowLeft from "@material-ui/icons/ArrowLeft"
import { makeStyles } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import useEventListener from '../../hooks/useEventListener';
import { network, restoreDoichainWalletFromHdKey, createHdKeyFromMnemonic, encryptAES, decryptAES} from "doichain";
import LoadingSpinner from '../../components/LoadingSpinner'
var GLOBAL = global || window;

const WalletCreator = () => {

    const [modus, setModus] = useGlobal("modus")
    const [checked] = useGlobal("checked")
    const [wallets, setWallets] = useGlobal("wallets")
    const [seed, setSeed] = useGlobal("seed")
    const [encryptedSeed, setEncryptedSeed] = useGlobal("encryptedSeed")
    const [email] = useGlobal("email")
    const [password1] = useState("")
    const [loading, setLoading] = useState(false)

    const [t] = useTranslation()

    const useStyles = makeStyles(theme => ({
        root: {
            flexGrow: 1
        },
        menuButton: {
            marginRight: theme.spacing(2)
        },
        title: {
            flexGrow: 1
        }
    }))

    const back = e => {
        if (modus === "createNewWallet") setModus(undefined)
        if (modus === "restoreWallet") setModus(undefined)
        if (modus === "confirmRecoveryPhrase") setModus("createNewWallet")
        if (modus === "setPassword") setModus("confirmRecoveryPhrase")
    }

    const next = e => {
        if (modus === "createNewWallet") setModus("confirmRecoveryPhrase")
        if (modus === "confirmRecoveryPhrase") setModus("setPassword")
        if (modus === "setPassword" || modus === "restoreWallet") {

            network.changeNetwork(global.network)
            const password = password1 ? password1 : "mnemonic"
            const hdkey = createHdKeyFromMnemonic(seed,password)
            const encryptedS = encryptAES(seed,password)
            setEncryptedSeed(encryptedS)
            setSeed(undefined)
            setLoading(true)
            console.log('checking current network for wallets')
            restoreDoichainWalletFromHdKey(hdkey,email,GLOBAL.DEFAULT_NETWORK).then((wallets) => {
                if(wallets.length>0){
                    setWallets(wallets)
                    setLoading(false)
                }
                else  {
                    setWallets([])
                    setLoading(false)
                }
            })
        }
    }

    useEventListener(document, "backbutton", () => back());

    const classes = useStyles()
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    {modus ? (
                        <IconButton
                            onClick={back}
                            id="preview"
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="menu"
                        >
                            <ArrowLeft />
                        </IconButton>
                    ) : (
                        ""
                    )}
                    <Typography variant="h6" className={classes.title}>
                        DoiContacts
                    </Typography>
                    {modus ? (
                        <Button color="inherit" disabled={!checked} id="next" onClick={next}>
                            {t("button.next")}
                        </Button>
                    ) : (
                        ""
                    )}
                </Toolbar>
            </AppBar>
            {modus === undefined ? <Welcome /> : ""}
            {modus === "createNewWallet" ? <CreateNewWalletPage /> : ""}
            {modus === "confirmRecoveryPhrase" ? <ConfirmRecoveryPhrase next={next} /> : ""}
            {modus === "setPassword" ? (loading?<LoadingSpinner loading="creating wallet ..."/>:<SetPassword />) : ""}
            {modus === "restoreWallet" ? (loading?<LoadingSpinner loading="restoring wallets ..."/>:<RestoreWalletPage />) : ""}
        </div>
    )
}
export default WalletCreator
