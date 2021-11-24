import logo from "./logo.svg";
import "./App.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import { CButton, CContainer, CForm, CFormCheck, CFormInput, CFormLabel, CFormText, CNav, CNavItem, CNavLink, CTabContent, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CTabPane } from "@coreui/react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

function App() {
  const [activeKey, setActiveKey] = useState(1);
  const contractAddress = "0x01f4b2b8655B81403E877F8D5B938B0235954e44";
  const ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "planId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "date",
          "type": "uint256"
        }
      ],
      "name": "PaymentSent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "merchant",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "planId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "date",
          "type": "uint256"
        }
      ],
      "name": "PlanCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "subscriber",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "planId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "date",
          "type": "uint256"
        }
      ],
      "name": "SubscriptionCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "subscriber",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "planId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "date",
          "type": "uint256"
        }
      ],
      "name": "SubscriptionCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "planId",
          "type": "uint256"
        }
      ],
      "name": "cancel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "frequency",
          "type": "uint256"
        }
      ],
      "name": "createPlan",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextPlanId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "subscriber",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "planId",
          "type": "uint256"
        }
      ],
      "name": "pay",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "plans",
      "outputs": [
        {
          "internalType": "address",
          "name": "merchant",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "frequency",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "planId",
          "type": "uint256"
        }
      ],
      "name": "subscribe",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "subscriptions",
      "outputs": [
        {
          "internalType": "address",
          "name": "subscriber",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "start",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "nextPayment",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  const [provider, setProvider] = useState(new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/"));
  const [lastPlan, setLastPlan] = useState(0);
  const [isConnect, setIsConnect] = useState(false);
  const [address, setAddress] = useState("");
  const [list, setList] = useState([]);
  const [planId, setPlanId] = useState();
  // const [signer, setSigner] = useState();
  const read = new ethers.Contract(contractAddress, ABI, provider);
  

  async function connect() {
    if (typeof web3 !== "undefined") {
      setProvider(new ethers.providers.Web3Provider(window.ethereum, "any"));
      
    }
    
    // write = new ethers.Contract(contractAddress, ABI, provider.getSigner().address)
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAddress(accounts[0])
    localStorage.setItem("address", accounts[0])
    setIsConnect(true)
    localStorage.setItem("connect", isConnect);
  }
  async function getData(){
    // let a = await provider.getSigner()
    // console.log(a);
    setIsConnect(localStorage.getItem("connect"))
    setAddress(localStorage.getItem("address"))
    console.log(localStorage.getItem("connect"));
      let allPlan = await read.nextPlanId();
      setLastPlan(Number(allPlan))
      console.log(Number(allPlan)); 
       let arr = [];
      for(let i=0; i<lastPlan; i++){
        
        let res = await read.plans(i);
        let obj = {
          address: res[0],
          amount: Number(res[1]),
          frequency: Number(res[2]) 
        }
        console.log(obj);
        arr.push(obj)
      }
      setList(arr)
  }
  async function subscribe() {
    let signer = provider.getSigner();
    const write = new ethers.Contract(contractAddress, ABI, signer);
    if(planId != ""){
      await write.subscribe(planId)
    }
    
  }
  async function pay(){
    let signer = provider.getSigner();
    const write = new ethers.Contract(contractAddress, ABI, signer);
    let plan = await read.plans(planId);
    console.log(plan);
    let amount = Number(plan[1])
    console.log();
    await write.pay(address, planId, {gasLimit: 30000, value: ethers.utils.parseEther(amount.toString())})
  }
  function onChange(e){
    console.log(e.target.value);
    setPlanId(e.target.value)
  }
  useEffect(() => {
    console.log("hello");
    if(isConnect){
      getData()
    }
    
  }, [isConnect])

  return (
    
    <>
      <CContainer>
        <CButton color="info" onClick={() => { connect() }}>Connect</CButton>
        {isConnect && (
          <p>Address: {address}</p>
        )}


        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">planId</CTableHeaderCell>
              <CTableHeaderCell scope="col">Merchant</CTableHeaderCell>
              <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
              <CTableHeaderCell scope="col">Frequency</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {list && list.map((item, index) => {
              return (
                <CTableRow key={index}>
                  <CTableHeaderCell scope="row">{index}</CTableHeaderCell>
                  <CTableDataCell>{item.address}</CTableDataCell>
                  <CTableDataCell>{item.amount}</CTableDataCell>
                  <CTableDataCell>{item.frequency}</CTableDataCell>
                </CTableRow>    
              )
            })}
            
          </CTableBody>
        </CTable>
        <CForm>
          <div className="mb-3">
            <CFormLabel htmlFor="exampleInputEmail1">PlanId</CFormLabel>
            <CFormInput type="number" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={onChange} />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="exampleInputPassword1">Email Password</CFormLabel>
            <CFormInput type="password" id="exampleInputPassword1" />
          </div>
          <CFormCheck
            className="mb-3"
            label="Check me out"
            onChange={(e) => {
              console.log(e.target)
            }}
          />
          <CButton color="primary" onClick={() => subscribe()}>
            Subscribe
          </CButton>
          <CButton color="primary" onClick={() => pay()}>
            Pay
          </CButton>
        </CForm>

      </CContainer>
    </>
  );
}

export default App;
