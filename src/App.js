import './App.css';
import {TextField, Typography} from "@material-ui/core";
import {useEffect, useState} from "react";
import axios from "axios";

function App() {
    let [amount, setAmount] = useState("");
    let [orders, setOrders] = useState([0]);
    let [time, setTime] = useState(new Date());

    useEffect(() => {
        const get = async () => {
            let result = await axios.get("https://enginehistory.ryamer.com/accountHistory?account=hk-vault&symbol=BUDS");
            let d = new Date();
            d.setUTCHours(0,0,0,0);

            let orders = result.data;

            let orders2 = [];
            for (let i = 0; i < orders.length; i++) {
                if (orders[i].timestamp > Math.floor(d.getTime() / 1000.0)) {
                    orders2.push(orders[i]);
                }
            }

            setOrders(orders2);
        };

        get();
    }, [setOrders]);

    setInterval(() => {
        setTime(new Date());
    }, 1000);

    let onChanged = event => {
        try {
            if (parseInt(event.target.value).toString() === event.target.value || event.target.value === "") {
                setAmount(event.target.value);
            }
        } catch (ignored) {}
    }

    let total = orders.reduce((total, value) => {return (parseInt(total) || 0) + parseInt(value.quantity);})

    function timeStr(date) {
        return date.getUTCHours().toString().padStart(2, "0") + ":" + date.getUTCMinutes().toString().padStart(2, "0") + ":" + date.getUTCSeconds().toString().padStart(2, "0");
    }

    return (
        <div className="App">
            <Typography>BUDS To Burn:</Typography>
            <TextField type={"text"} onChange={onChanged} value={amount} />
            <Typography>If no one else burns, you'll receive approximately: {(1000.0 * (parseFloat(amount || 0) / (parseFloat(amount || 0) + total))).toFixed(3)} MOTA</Typography>
            <Typography>Burns Fetched: {orders.length} - Value {total} BUDS</Typography>
            <Typography>This tool isn't guaranteed to be accurate as more people can add to the pool and reduce the amount you'll recieve. I am not liable for any incorrect figures produced by this app!</Typography>
            <Typography>{orders.length === 500 ? "Couldn't load all burns for today. Data May be incorrect." : ""}</Typography>
            <Typography>Pool Resets at UTC 00:00:00. Current Time UTC: {timeStr(time)}</Typography>
        </div>
    );
}

export default App;
