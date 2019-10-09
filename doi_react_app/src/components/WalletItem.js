import React, {useEffect,useState,setState } from 'react';
import bitcore from "bitcore-doichain";
//import QRCode from 'qrcode'
import {CropFree} from '@material-ui/icons'
import TypoGraphy from "@material-ui/core/Typography/Typography";
import QRCode from 'qrcode-react'


const WalletItem = ({walletName,senderEmail,subject,content, publicKey,contentType,redirectUrl,returnPath}) => {
    const [balance, setBalance] = useState(0)
    const [show,setShow] = useState(false)
    const [address, setAddress] = useState()
    let fetched = false
        useEffect( () => {
         async function fetchData(){
             bitcore.Networks.defaultNetwork =  bitcore.Networks.get('doichain-testnet')
             const address = bitcore.getAddressOfPublicKey(publicKey).toString()
             console.log("address",address)
             try{
                 if(address){
                     console.log('fetching data for address',address)
                     const response = await bitcore.getUTXOAndBalance(address.toString())
                     console.log("response",response)
                     const balanceAllUTXOs = response.balanceAllUTXOs
                     setBalance(balanceAllUTXOs)
                     fetched=true
                 }
             }catch(Exception){
                 console.log("error while fetching utxos from server",publicKey)
             }
             setAddress(address)
         }
        fetchData();
     },[fetched])
    return (
        <div>
            <li style={{"fontSize":"9px"}} onClick={() => {setShow(!show)}}>
                <b>{walletName}</b> DoiCoin-Address: <b>{address?address.toString():''}</b> Balance: {balance} DOI
            </li>
            { show ? <div style={{"fontSize":"9px","border":'2px solid lightgrey'}}>
                    <table>
                        <tbody>
                            <tr>
                                <td><QRCode value={"doicoin:"+address?address.toString():''} /><br/></td>
                                <td>
                                    <label htmlFor={"walletName"}>Wallet: </label>{walletName}<br/>
                                    <label htmlFor={"senderEmail"}>Email: </label>{senderEmail}<br/>
                                    <label htmlFor={"subject"}></label>Subject: {subject}<br/>
                                    <label htmlFor={"content"}></label>Content: {content}<br/>
                                    <label htmlFor={"contentType"}></label>Content-Type: {contentType}<br/>
                                    <label htmlFor={"redirectUrl"}></label>Redirect-Url: {redirectUrl}><br/>
                                    <label htmlFor={"returnPath"}></label>Return-Path: {returnPath}<br/>
                                    <button>Check Balance</button><br/>
                                    <button onClick={()=>deleteWallet(publicKey)}>Delete Wallet</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                   <b>PubKey:{publicKey}</b><br/>
                </div>
                : null
            }
        </div>

        )
}

const deleteWallet = publicKey => {
    console.log('deleting pubKey',publicKey)
   // const  db = new localStorageDB("doiworks", localStorage); //https://nadh.in/code/localstoragedb/
   // if(db.tableExists("wallets")) {
     /*   console.log("deteled:",db.deleteRows("wallets", (row)=>{
           // console.log(row)
            if(row.publicKey==publicKey){
                console.log(row)
                return true
            }
            else return false
        })); */
        //db.queryAll("wallets", )
   // }
}

export default WalletItem
