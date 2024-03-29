import React, { useGlobal, useContext } from "reactn"
import s from "./Welcome.module.css"
import logo from "./logo.jpg"
import Button from "@material-ui/core/Button"
import { appVersion } from "./../../appVersion"
import { useTranslation } from "react-i18next"
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import { network } from "doichain";
import FormControl from "@material-ui/core/FormControl";
import {makeStyles} from "@material-ui/core/styles";
import { Switch, CssBaseline } from "@material-ui/core"
import { ThemeProvider } from "@material-ui/core/styles";
import { ThemeContext } from "../../contexts/theme"

const Welcome = () => {
    const setGlobalNetwork = useGlobal("network")[1]
    const setModus = useGlobal("modus")[1]
    const { t, i18n } = useTranslation()
    const [darkMode, setDarkMode] = useGlobal("darkMode")

    const createNewWallet = e => {
        setModus("createNewWallet")
    }

    const restoreWallet = e => {
        setModus("restoreWallet")
    }

    const useStyles = makeStyles(theme => ({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 200
        },
        selectEmpty: {
            marginTop: theme.spacing(2)
        }
    })) 

    const classes = useStyles()
    const theme = useContext(ThemeContext);

    return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={s.welcomePage}>
            <img className={s.welcomeImg} src={logo} alt="welcome" />
            <div>
                <p>{t("welcome.1")}</p>
            </div>
            <br></br>
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="uncontrolled-native">{t("option.choose")}</InputLabel>
                <NativeSelect
                    defaultValue={i18n.language}
                    id="selectLang"
                    onChange={e => i18n.changeLanguage(e.target.value)}
                >
                    <option value={"en"} id="english">
                        English
                    </option>
                    <option value={"ru"} id="russian">
                        Русский
                    </option>
                    <option value={"fr"} id="french">
                        Francais
                    </option>
                </NativeSelect>
            </FormControl>
            <InputLabel htmlFor="uncontrolled-native">testnet/mainnet/regtest</InputLabel>
            <br></br>
            <FormControl className={classes.formControl}>
                <NativeSelect
                    defaultValue={network}
                    id="selectNetwork"
                    onChange={e => {
                        const ourNetwork = e.target.value
                        network.changeNetwork(ourNetwork)
                        setGlobalNetwork(ourNetwork)
                    }}
                >
                    <option value={"mainnet"} id="mainnet">
                        Mainnet
                    </option>
                    <option value={"testnet"} id="testnet">
                        Testnet
                    </option>
                    <option value={"regtest"} id="regtest">
                        Regtest
                    </option>
                </NativeSelect>
            </FormControl>
            <div className={classes.formControl}>
            <span>Toggle light/dark theme</span>
            <Switch defaultChecked={false} onChange={() => {
                const ourMode = darkMode
                setDarkMode(!ourMode)
            }} />
            </div>
            <div>
                <Button
                    onClick={createNewWallet}
                    id="createWallet"
                    variant="contained"
                    color="secondary"
                >
                    {t("button.createNewWallet")}
                </Button>
            </div>
            <br></br>
            <div>
                <Button
                    color="secondary"
                    onClick={restoreWallet}
                    variant="contained"
                    id="restoreWallet"
                >
                    {t("button.restoreWallet")}
                </Button>
            </div>
            <br></br>
            <div>v{appVersion}</div>
        </div>
        </ThemeProvider>
    )
}

export default Welcome
