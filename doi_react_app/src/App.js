import React, { useGlobal, useEffect } from "reactn"
import * as PropTypes from "prop-types"
import "./App.css"
import ContactsPage from "./pages/ContactsPage"
import WalletsPage from "./pages/WalletsPage"

import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import { register } from "./serviceWorker"
import initStorage from "./utils/storage"
import WalletCreator from "./pages/walletCreator/WalletCreator"
import AppBar from "@material-ui/core/AppBar"
import {appVersion} from "./appVersion";
import Settings from "./pages/Settings"
import PhoneIcon from "@material-ui/icons/Phone"
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet"
import SettingsIcon from "@material-ui/icons/Settings"
import CustomizedSnackbars from "./components/MySnackbarContentWrapper"
import changeNetwork from "./utils/network";

const App = props => {

    const [global, setGlobal] = useGlobal()
    const [currentTab, setCurrentTab] = useGlobal("currentTab")
    const [modus,setModus] = useGlobal("modus")
    const [activeWallet, setActiveWallet] = useGlobal("activeWallet")
    const [wallets] = useGlobal("wallets")

    register()

    useEffect(() => {
            initStorage(props.cordova, global, setGlobal)
    }, [])
    console.log('current network',global.network)
    changeNetwork(global.network)

    function TabPanel(props) {
        const { children, value, index, ...other } = props

        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                <Box p={3}>{children}</Box>
            </Typography>
        )
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`
        }
    }

    const our_CurrentTab = currentTab ? currentTab : 0
       if(!wallets || wallets.length === 0){
           return <WalletCreator />
             } else {
                 return (
                     <div>
                         <AppBar position="static">
                             <Tabs
                                 value={Number(our_CurrentTab)}
                                 onChange={(event, newValue) => {
                                     setCurrentTab(newValue)
                                     setActiveWallet(undefined)
                                     setModus("list")
                                 }}
                                 aria-label="Doichain Contacts"
                             >
                                 <Tab icon={<PhoneIcon id="phoneIcon" />} {...a11yProps(0)} />
                                 <Tab
                                     icon={<AccountBalanceWalletIcon id="walletIcon" />}
                                     {...a11yProps(1)}
                                 />
                                 <Tab icon={<SettingsIcon id="settingsIcon" />} {...a11yProps(2)} />
                                 <Tab
                                     label={appVersion}
                                     style={{
                                         align: "center",
                                         verticalAlign: "middle",
                                         fontSize: "9px"
                                     }}
                                 ></Tab>
                             </Tabs>
                         </AppBar>
                         <TabPanel value={Number(our_CurrentTab)} index={0}>
                             {Number(currentTab) === 0 && <ContactsPage />}
                         </TabPanel>
                         <TabPanel value={Number(our_CurrentTab)} index={1}>
                             {Number(currentTab) === 1 && <WalletsPage />}
                         </TabPanel>
                         <TabPanel value={Number(our_CurrentTab)} index={2}>
                             {Number(currentTab) === 2 && <Settings />}
                         </TabPanel>
                         <CustomizedSnackbars />
                     </div>
                 )
             }
}
export default App
