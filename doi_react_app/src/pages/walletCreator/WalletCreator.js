import React, { useGlobal, useState, useContext } from "reactn"
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
import { network, restoreDoichainWalletFromHdKey, createHdKeyFromMnemonic, encryptAES } from "doichain";
import LoadingSpinner from '../../components/LoadingSpinner'
import { ThemeProvider } from "@material-ui/core/styles";
import { ThemeContext } from "../../contexts/theme"
import { CssBaseline } from "@material-ui/core"


const WalletCreator = () => {

    const [modus, setModus] = useGlobal("modus")
    const [checked] = useGlobal("checked")
    const setWallets = useGlobal("wallets")[1]
    const [seed, setSeed] = useGlobal("seed")
    const setEncryptedSeed = useGlobal("encryptedSeed")[1]
    const [password1, setPassword1] = useGlobal("password1")
    const [loading, setLoading] = useState(false)

    const [t] = useTranslation()

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
            setPassword1(undefined)
            setLoading(true)

            let options = {}
            if(modus === "restoreWallet") options = {rescan: true, options: global.DEFAULT_NETWORK }
            restoreDoichainWalletFromHdKey(hdkey,options).then((wallets) => {
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
    
    //TODO is this necessary here? CAn we cnetralize it somewhere? 
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

    const classes = useStyles()
    const theme = useContext(ThemeContext);
    return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
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
        </ThemeProvider>
    )
}
export default WalletCreator
